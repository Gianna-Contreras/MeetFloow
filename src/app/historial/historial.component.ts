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
      case 'ultimos-30':
        return this.meetings; // Simplificado para demo
      default:
        return this.meetings;
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
  }
}
