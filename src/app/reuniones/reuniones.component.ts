import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MeetingService, Meeting } from '../services/meeting.service';
import { IpService } from '../services/ip.service';
import { CrearReunionModalComponent } from '../crear-reunion-modal/crear-reunion-modal.component';

@Component({
  selector: 'app-reuniones',
  standalone: true,
  imports: [CommonModule, CrearReunionModalComponent],
  templateUrl: './reuniones.component.html',
  styleUrl: './reuniones.component.css'
})
export class ReunionesComponent {
  showCrearReunionModal = false;

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

  recentActivities: any[] = [];

  private timeInterval: any;
  private clockInterval: any;

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private ipService: IpService
  ) {
    this.loadMeetings();
    this.updateCurrentUrl();
    this.timeInterval = setInterval(() => {
      this.meetingService.loadMeetings();
    }, 5000);
    this.clockInterval = setInterval(() => {
      this.getCurrentTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  loadMeetings(): void {
    this.meetingService.meetings$.subscribe(meetings => {
      this.meetings = meetings;
      this.quickSummary.meetingsThisWeek = meetings.length;
      this.quickSummary.totalParticipants = meetings.reduce((sum, m) => sum + m.participantsCount, 0);
      this.updateRecentActivities();
    });
    this.meetingService.loadMeetings();
  }

  updateRecentActivities(): void {
    this.recentActivities = this.meetings.slice(0, 4).map(m => ({
      icon: m.status === 'En curso' ? '📅' : m.status === 'Completada' ? '✅' : m.status === 'Cancelada' ? '❌' : '👤',
      description: `Reunión '${m.title}' - ${m.status}`,
      time: m.date,
      status: m.status
    }));
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
          return meetingDate.getTime() > today.getTime() && meeting.status !== 'Completada' && meeting.status !== 'Cancelada';
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

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  joinMeeting(meetingId: string): void {
    this.router.navigate(['/videollamada', meetingId]);
  }

  cancelMeeting(meetingId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas cancelar esta reunión?')) {
      this.meetingService.updateMeeting(meetingId, {
        status: 'Cancelada',
        statusClass: 'cancelled',
        progress: 0
      });
    }
  }

  get todayMeetingsCount(): number {
    return this.meetingService.getTodayMeetings().length;
  }

  createNewMeeting(): void {
    this.showCrearReunionModal = true;
  }

  onMeetingCreated(meeting: Meeting): void {
    this.showCrearReunionModal = false;
    this.router.navigate(['/videollamada', meeting.id]);
  }

  onModalClosed(): void {
    this.showCrearReunionModal = false;
  }
}
