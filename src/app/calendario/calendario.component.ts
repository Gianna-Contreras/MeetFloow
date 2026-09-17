import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  currentMonth = 'Septiembre 2025';
  currentView = 'Mes';
  views = ['Mes', 'Semana', 'Día'];

  get displayTitle() {
    switch (this.currentView) {
      case 'Semana':
        return 'Semana del 8-14 de Septiembre';
      case 'Día':
        return '10 de Septiembre 2025';
      default:
        return this.currentMonth;
    }
  }
  
  searchQuery = '';
  
  calendarDays = [
    { day: 1, events: [{ title: 'Reunión de equipo', color: '#4a9eff' }, { title: 'Planificación proyecto', color: '#9b59b6' }] },
    { day: 2, events: [{ title: 'Revisión de diseño', color: '#2ecc71' }] },
    { day: 3, events: [] },
    { day: 4, events: [] },
    { day: 5, events: [] },
    { day: 6, events: [] },
    { day: 7, events: [] },
    { day: 8, events: [{ title: 'Kickoff proyecto', color: '#e74c3c' }, { title: 'Revisión presupuesto', color: '#3498db' }] },
    { day: 9, events: [{ title: 'Meeting cliente', color: '#9b59b6' }] },
    { day: 10, events: [{ title: 'Reunión de equipo', color: '#2ecc71' }, { title: 'Discusión de roadmap', color: '#e67e22' }], isToday: true },
    { day: 11, events: [{ title: 'Presentación quarterly', color: '#4a9eff' }] },
    { day: 12, events: [] },
    { day: 13, events: [{ title: 'Retrospectiva sprint', color: '#2ecc71' }] },
    { day: 14, events: [{ title: 'Planning next sprint', color: '#9b59b6' }] },
    { day: 15, events: [] },
    { day: 16, events: [] },
    { day: 17, events: [] },
    { day: 18, events: [] },
    { day: 19, events: [] },
    { day: 20, events: [] },
    { day: 21, events: [] },
    { day: 22, events: [] },
    { day: 23, events: [] },
    { day: 24, events: [] },
    { day: 25, events: [] },
    { day: 26, events: [] },
    { day: 27, events: [] },
    { day: 28, events: [] },
    { day: 29, events: [] },
    { day: 30, events: [] }
  ];
  
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  todayMeetings = [
    {
      time: '10:00',
      title: 'Reunión de equipo',
      location: 'Sala Horizon',
      status: 'En curso',
      statusClass: 'in-progress',
      participants: 4,
      visibleAvatars: 2
    },
    {
      time: '11:30',
      title: 'Discusión de roadmap',
      location: 'Sala Atlas',
      status: 'Programada',
      statusClass: 'scheduled',
      participants: 6,
      visibleAvatars: 3
    },
    {
      time: '15:00',
      title: 'Revisión de diseño',
      location: 'Sala Nebula',
      status: 'Pendiente',
      statusClass: 'pending',
      participants: 4,
      visibleAvatars: 3
    }
  ];
  
  setView(view: string) {
    this.currentView = view;
  }

  get filteredCalendarDays() {
    if (this.currentView === 'Semana') {
      // Mostrar solo los días de la semana actual (días 8-14)
      return this.calendarDays.slice(7, 14);
    } else if (this.currentView === 'Día') {
      // Mostrar solo el día de hoy (día 10)
      return this.calendarDays.filter(day => day.isToday);
    }
    // Vista Mes: mostrar todos los días
    return this.calendarDays;
  }

  get filteredTodayMeetings() {
    if (this.currentView === 'Día') {
      // En vista día, mostrar más detalles de las reuniones de hoy
      return this.todayMeetings;
    }
    return this.todayMeetings;
  }
  
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }
}
