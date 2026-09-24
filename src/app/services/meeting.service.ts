import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  status: 'Programada' | 'En curso' | 'Completada' | 'Cancelada' | 'Pendiente';
  statusClass: string;
  location: string;
  participantsCount: number;
  totalParticipants: number;
  progress: number;
  fullDate: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private meetingsSubject = new BehaviorSubject<Meeting[]>([]);
  meetings$ = this.meetingsSubject.asObservable();

  constructor() {
    this.loadMeetings();
  }

  private loadMeetings(): void {
    const stored = localStorage.getItem('meetings');
    if (stored) {
      try {
        const meetings = JSON.parse(stored);
        this.meetingsSubject.next(meetings);
      } catch (e) {
        console.error('Error loading meetings:', e);
        this.loadSampleMeetings();
      }
    } else {
      this.loadSampleMeetings();
    }
  }

  private loadSampleMeetings(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5);

    const sampleMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Estrategia de producto Q2',
        description: 'Revisión de estrategia del producto para el segundo trimestre',
        date: '22 May 2024',
        time: '10:00 AM - 11:30 AM',
        duration: '1h 30m',
        participants: ['Gianna Contreras', 'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'],
        status: 'En curso',
        statusClass: 'in-progress',
        location: 'Sala de Juntas A',
        participantsCount: 5,
        totalParticipants: 8,
        progress: 62,
        fullDate: today,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Revisión de roadmap',
        description: 'Revisión del roadmap de desarrollo',
        date: '23 May. 2024',
        time: '02:00 PM - 03:30 PM',
        duration: '1h 30m',
        participants: ['Gianna Contreras', 'Pedro Sánchez', 'Laura Rodríguez', 'Miguel Ángel'],
        status: 'Programada',
        statusClass: 'scheduled',
        location: 'Sala Zoom',
        participantsCount: 4,
        totalParticipants: 7,
        progress: 57,
        fullDate: tomorrow,
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Plan de marketing mensual',
        description: 'Planificación de actividades de marketing',
        date: '24 May. 2024',
        time: '09:30 AM - 10:30 AM',
        duration: '1h',
        participants: ['Gianna Contreras', 'Sofía Ramírez', 'Diego Torres', 'Elena Fernández'],
        status: 'Pendiente',
        statusClass: 'pending',
        location: 'Sala de Juntas B',
        participantsCount: 4,
        totalParticipants: 5,
        progress: 80,
        fullDate: new Date(tomorrow.getTime() + 86400000),
        createdAt: new Date()
      },
      {
        id: '4',
        title: 'Retrospectiva de sprint',
        description: 'Retrospectiva del sprint anterior',
        date: '20 May. 2024',
        time: '11:00 AM - 12:00 PM',
        duration: '1h',
        participants: ['Gianna Contreras', 'Roberto Díaz', 'Carmen Vega'],
        status: 'Completada',
        statusClass: 'completed',
        location: 'Sala de Juntas A',
        participantsCount: 3,
        totalParticipants: 6,
        progress: 50,
        fullDate: yesterday,
        createdAt: new Date()
      },
      {
        id: '5',
        title: 'Presentación a stakeholders',
        description: 'Presentación de resultados a stakeholders',
        date: '27 May. 2024',
        time: '03:00 PM - 04:30 PM',
        duration: '1h 30m',
        participants: ['Gianna Contreras', 'Fernando Ruiz', 'Isabel Morales', 'Javier Castro'],
        status: 'Programada',
        statusClass: 'scheduled',
        location: 'Sala Zoom',
        participantsCount: 4,
        totalParticipants: 8,
        progress: 50,
        fullDate: nextWeek,
        createdAt: new Date()
      },
      {
        id: '6',
        title: 'Revisión de presupuesto',
        description: 'Revisión del presupuesto anual',
        date: '19 May. 2024',
        time: '04:00 PM - 05:00 PM',
        duration: '1h',
        participants: ['Gianna Contreras', 'Luis Herrera', 'Patricia Jiménez'],
        status: 'Cancelada',
        statusClass: 'cancelled',
        location: 'Sala de Juntas A',
        participantsCount: 3,
        totalParticipants: 5,
        progress: 0,
        fullDate: new Date(yesterday.getTime() - 86400000),
        createdAt: new Date()
      },
      {
        id: '7',
        title: 'Kickoff de proyecto',
        description: 'Inicio del nuevo proyecto',
        date: '28 May. 2024',
        time: '10:00 AM - 11:00 AM',
        duration: '1h',
        participants: ['Gianna Contreras', 'Ricardo Flores', 'Adriana Silva', 'Gabriel Ortiz', 'Victoria Reyes', 'Daniel Mendoza'],
        status: 'Programada',
        statusClass: 'scheduled',
        location: 'Sala de Conferencias',
        participantsCount: 6,
        totalParticipants: 10,
        progress: 30,
        fullDate: new Date(nextWeek.getTime() + 86400000),
        createdAt: new Date()
      }
    ];

    this.meetingsSubject.next(sampleMeetings);
    this.saveMeetings();
  }

  private saveMeetings(): void {
    localStorage.setItem('meetings', JSON.stringify(this.meetingsSubject.value));
  }

  createMeeting(meeting: Omit<Meeting, 'id' | 'status' | 'statusClass' | 'progress' | 'createdAt'>): Meeting {
    const newMeeting: Meeting = {
      ...meeting,
      id: this.generateId(),
      status: 'Programada',
      statusClass: 'scheduled',
      progress: 0,
      createdAt: new Date()
    };

    const currentMeetings = this.meetingsSubject.value;
    this.meetingsSubject.next([...currentMeetings, newMeeting]);
    this.saveMeetings();

    return newMeeting;
  }

  updateMeeting(id: string, updates: Partial<Meeting>): void {
    const currentMeetings = this.meetingsSubject.value;
    const updatedMeetings = currentMeetings.map(meeting =>
      meeting.id === id ? { ...meeting, ...updates } : meeting
    );
    this.meetingsSubject.next(updatedMeetings);
    this.saveMeetings();
  }

  deleteMeeting(id: string): void {
    const currentMeetings = this.meetingsSubject.value;
    const filteredMeetings = currentMeetings.filter(meeting => meeting.id !== id);
    this.meetingsSubject.next(filteredMeetings);
    this.saveMeetings();
  }

  getMeeting(id: string): Meeting | undefined {
    return this.meetingsSubject.value.find(meeting => meeting.id === id);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  getTodayMeetings(): Meeting[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.meetingsSubject.value.filter(meeting => {
      const meetingDate = new Date(meeting.fullDate);
      meetingDate.setHours(0, 0, 0, 0);
      return meetingDate.getTime() === today.getTime();
    });
  }
}
