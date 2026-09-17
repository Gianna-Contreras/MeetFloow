import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  meetings = [
    {
      status: 'En curso',
      statusClass: 'in-progress',
      title: 'Estrategia de producto Q2',
      date: '16 Sep 2026',
      time: '10:00 AM - 11:30 AM',
      location: 'Sala de Juntas A',
      participants: 5,
      totalParticipants: 8,
      progress: 62,
      fullDate: new Date('2026-09-16')
    },
    {
      status: 'Programada',
      statusClass: 'scheduled',
      title: 'Revisión de roadmap',
      date: '16 Sep 2026',
      time: '02:00 PM - 03:30 PM',
      location: 'Sala Zoom',
      participants: 4,
      totalParticipants: 7,
      progress: 57,
      fullDate: new Date('2026-09-16')
    },
    {
      status: 'Pendiente',
      statusClass: 'pending',
      title: 'Plan de marketing mensual',
      date: '17 Sep 2026',
      time: '09:30 AM - 10:30 AM',
      location: 'Sala de Juntas B',
      participants: 4,
      totalParticipants: 5,
      progress: 80,
      fullDate: new Date('2026-09-17')
    },
    {
      status: 'Completada',
      statusClass: 'completed',
      title: 'Retrospectiva de sprint',
      date: '15 Sep 2026',
      time: '11:00 AM - 12:00 PM',
      location: 'Sala de Juntas A',
      participants: 3,
      totalParticipants: 6,
      progress: 50,
      fullDate: new Date('2026-09-15')
    },
    {
      status: 'Programada',
      statusClass: 'scheduled',
      title: 'Presentación a stakeholders',
      date: '18 Sep 2026',
      time: '03:00 PM - 04:30 PM',
      location: 'Sala Zoom',
      participants: 4,
      totalParticipants: 8,
      progress: 50,
      fullDate: new Date('2026-09-18')
    },
    {
      status: 'Cancelada',
      statusClass: 'cancelled',
      title: 'Revisión de presupuesto',
      date: '14 Sep 2026',
      time: '04:00 PM - 05:00 PM',
      location: 'Sala de Juntas A',
      participants: 3,
      totalParticipants: 5,
      progress: 0,
      fullDate: new Date('2026-09-14')
    },
    {
      status: 'Programada',
      statusClass: 'scheduled',
      title: 'Kickoff de proyecto',
      date: '20 Sep 2026',
      time: '10:00 AM - 11:00 AM',
      location: 'Sala de Conferencias',
      participants: 6,
      totalParticipants: 10,
      progress: 30,
      fullDate: new Date('2026-09-20')
    }
  ];

  quickSummary = {
    meetingsThisWeek: 7,
    totalParticipants: 32
  };

  recentActivities = [
    {
      icon: '📅',
      description: 'Nueva reunión creada: "Estrategia de producto Q2"',
      time: 'Hace 2 horas',
      status: 'Completado'
    },
    {
      icon: '👥',
      description: 'Gianna Contreras se unió a "Revisión de roadmap"',
      time: 'Hace 3 horas',
      status: 'Completado'
    },
    {
      icon: '✅',
      description: 'Retrospectiva de sprint finalizada',
      time: 'Hace 5 horas',
      status: 'Completado'
    },
    {
      icon: '📝',
      description: 'Notas actualizadas en "Plan de marketing"',
      time: 'Hace 1 día',
      status: 'Completado'
    }
  ];

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
}
