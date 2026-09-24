import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MeetingService, Meeting } from '../services/meeting.service';
import { IpService } from '../services/ip.service';

@Component({
  selector: 'app-reuniones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reuniones.component.html',
  styleUrl: './reuniones.component.css'
})
export class ReunionesComponent {
  activeTab = 'Todas';
  tabs = ['Todas', 'Hoy', 'Próximas', 'Pasadas', 'Canceladas'];
  
  showIpConfig = false;
  manualIp = '';
  currentUrl = '';
  
  meetings: Meeting[] = [];
  
  quickSummary = {
    meetingsThisWeek: 0,
    totalParticipants: 0
  };

  recentActivities = [
    {
      icon: '📅',
      description: 'Reunión \'Estrategia de producto Q2\' en curso',
      time: '10:05 AM',
      status: 'En curso'
    },
    {
      icon: '👤',
      description: 'Gianna Contreras creó una nueva reunión',
      time: 'Ayer, 04:30 PM',
      status: 'Programada'
    },
    {
      icon: '✅',
      description: 'Reunión \'Retrospectiva de sprint\' completada',
      time: 'Ayer, 12:15 PM',
      status: 'Completada'
    },
    {
      icon: '👥',
      description: 'Nuevo participante agregado a \'Plan de marketing mensual\'',
      time: '22 may, 09:15 AM',
      status: 'Pendiente'
    }
  ];

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private ipService: IpService
  ) {
    this.loadMeetings();
    this.updateCurrentUrl();
  }

  loadMeetings(): void {
    this.meetingService.meetings$.subscribe(meetings => {
      this.meetings = meetings;
      this.quickSummary.meetingsThisWeek = meetings.length;
      this.quickSummary.totalParticipants = meetings.reduce((sum, m) => sum + m.participantsCount, 0);
    });
  }

  updateCurrentUrl(): void {
    this.currentUrl = this.ipService.getBaseUrl();
    this.manualIp = this.currentUrl.replace('http://', '').replace(':4200', '');
  }

  openIpConfig(): void {
    this.showIpConfig = true;
    this.updateCurrentUrl();
  }

  closeIpConfig(): void {
    this.showIpConfig = false;
  }

  setManualIp(): void {
    if (this.manualIp) {
      this.ipService.setManualIp(this.manualIp);
      this.updateCurrentUrl();
      this.closeIpConfig();
    }
  }

  get filteredMeetings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.activeTab) {
      case 'Hoy':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() === today.getTime();
        });
      case 'Próximas':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() > today.getTime() && meeting.status !== 'Completada';
        });
      case 'Pasadas':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() < today.getTime() || meeting.status === 'Completada';
        });
      case 'Canceladas':
        return this.meetings.filter(meeting => meeting.status === 'Cancelada');
      case 'Todas':
      default:
        return this.meetings;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  joinMeeting(meetingId: string): void {
    this.router.navigate(['/meeting', meetingId]);
  }

  get todayMeetingsCount(): number {
    return this.meetingService.getTodayMeetings().length;
  }
}
