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
      date: '22 May 2024',
      time: '10:00 AM - 11:30 AM',
      location: 'Sala de Juntas A',
      participants: 5,
      totalParticipants: 8,
      progress: 62
    },
    {
      status: 'Programada',
      statusClass: 'scheduled',
      title: 'Revisión de roadmap',
      date: '23 May 2024',
      time: '02:00 PM - 03:30 PM',
      location: 'Sala Zoom',
      participants: 4,
      totalParticipants: 7,
      progress: 57
    },
    {
      status: 'Pendiente',
      statusClass: 'pending',
      title: 'Plan de marketing mensual',
      date: '24 May 2024',
      time: '09:30 AM - 10:30 AM',
      location: 'Sala de Juntas B',
      participants: 4,
      totalParticipants: 5,
      progress: 80
    },
    {
      status: 'Completada',
      statusClass: 'completed',
      title: 'Retrospectiva de sprint',
      date: '20 May 2024',
      time: '11:00 AM - 12:00 PM',
      location: 'Sala de Juntas A',
      participants: 3,
      totalParticipants: 6,
      progress: 50
    },
    {
      status: 'Programada',
      statusClass: 'scheduled',
      title: 'Presentación a stakeholders',
      date: '27 May 2024',
      time: '03:00 PM - 04:30 PM',
      location: 'Sala Zoom',
      participants: 4,
      totalParticipants: 8,
      progress: 50
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
}
