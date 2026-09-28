import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  currentFilter = 'todas';

  meetings = [
    {
      dateDay: '22',
      dateMonth: 'may',
      time: '10:30 AM',
      title: 'Estrategia Q2 - Revisión de resultados',
      duration: '55 min',
      location: 'Sala de Juntas',
      status: 'Completada',
      participants: [
        { color: '#667eea' },
        { color: '#764ba2' },
        { color: '#f093fb' },
        { color: '#4facfe' }
      ]
    },
    {
      dateDay: '20',
      dateMonth: 'may',
      time: '2:00 PM',
      title: 'Reunión de equipo semanal',
      duration: '45 min',
      location: 'Sala de Conferencias',
      status: 'Completada',
      participants: [
        { color: '#43e97b' },
        { color: '#38f9d7' },
        { color: '#fa709a' }
      ]
    },
    {
      dateDay: '18',
      dateMonth: 'may',
      time: '11:00 AM',
      title: 'Presentación de proyecto',
      duration: '30 min',
      location: 'Sala de Juntas',
      status: 'Cancelada',
      participants: [
        { color: '#fee140' },
        { color: '#fa709a' }
      ]
    },
    {
      dateDay: '15',
      dateMonth: 'may',
      time: '3:30 PM',
      title: 'Revisión de presupuesto',
      duration: '60 min',
      location: 'Sala de Conferencias',
      status: 'Completada',
      participants: [
        { color: '#667eea' },
        { color: '#764ba2' },
        { color: '#4facfe' },
        { color: '#43e97b' },
        { color: '#38f9d7' }
      ]
    },
    {
      dateDay: '12',
      dateMonth: 'may',
      time: '9:00 AM',
      title: 'Kickoff de campaña',
      duration: '90 min',
      location: 'Sala de Juntas',
      status: 'Completada',
      participants: [
        { color: '#f093fb' },
        { color: '#f5576c' },
        { color: '#4facfe' }
      ]
    },
    {
      dateDay: '10',
      dateMonth: 'may',
      time: '4:00 PM',
      title: 'Entrevista candidato desarrollador',
      duration: '45 min',
      location: 'Sala Zoom',
      status: 'Completada',
      participants: [
        { color: '#fa709a' },
        { color: '#fee140' }
      ]
    },
    {
      dateDay: '8',
      dateMonth: 'may',
      time: '11:30 AM',
      title: 'Planificación sprint',
      duration: '60 min',
      location: 'Sala de Juntas',
      status: 'Completada',
      participants: [
        { color: '#667eea' },
        { color: '#764ba2' },
        { color: '#43e97b' },
        { color: '#38f9d7' }
      ]
    },
    {
      dateDay: '5',
      dateMonth: 'may',
      time: '2:30 PM',
      title: 'Revisión de diseño',
      duration: '30 min',
      location: 'Sala de Conferencias',
      status: 'Cancelada',
      participants: [
        { color: '#f093fb' },
        { color: '#4facfe' }
      ]
    },
    {
      dateDay: '3',
      dateMonth: 'may',
      time: '10:00 AM',
      title: 'Actualización de clientes',
      duration: '75 min',
      location: 'Sala de Juntas',
      status: 'Completada',
      participants: [
        { color: '#fee140' },
        { color: '#fa709a' },
        { color: '#667eea' },
        { color: '#764ba2' }
      ]
    },
    {
      dateDay: '1',
      dateMonth: 'may',
      time: '3:00 PM',
      title: 'Mentoring equipo',
      duration: '50 min',
      location: 'Sala Zoom',
      status: 'Completada',
      participants: [
        { color: '#43e97b' },
        { color: '#38f9d7' }
      ]
    }
  ];

  recentMeetings = [
    {
      date: '22 may 2024',
      title: 'Estrategia Q2 - Revisión de resultados'
    },
    {
      date: '20 may 2024',
      title: 'Reunión de equipo semanal'
    },
    {
      date: '15 may 2024',
      title: 'Revisión de presupuesto'
    },
    {
      date: '12 may 2024',
      title: 'Kickoff de campaña'
    }
  ];

  get filteredMeetings() {
    switch (this.currentFilter) {
      case 'completadas':
        return this.meetings.filter(m => m.status === 'Completada');
      case 'canceladas':
        return this.meetings.filter(m => m.status === 'Cancelada');
      case 'este-mes':
        // Simular filtrado por mes actual (mayo)
        return this.meetings.filter(m => m.dateMonth === 'may');
      case 'ultimos-30':
        // Simular últimos 30 días (todos los datos son de mayo)
        return this.meetings;
      default:
        return this.meetings;
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  exportHistory(): void {
    // Create CSV content
    const headers = ['Fecha', 'Hora', 'Título', 'Duración', 'Ubicación', 'Estado', 'Participantes'];
    const csvContent = [
      headers.join(','),
      ...this.meetings.map(meeting => [
        `${meeting.dateDay} ${meeting.dateMonth}`,
        meeting.time,
        meeting.title,
        meeting.duration,
        meeting.location,
        meeting.status,
        meeting.participants.length
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_reuniones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
