import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ReunionApiService } from './reunion-api.service';
import { Reunion, CreateReunionRequest, EstadoReunion, getEstadoLabel, getEstadoClass } from '../models/reunion.model';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  status: string;
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

  constructor(private reunionApiService: ReunionApiService) {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.reunionApiService.getReuniones().subscribe({
      next: (response) => {
        const meetings = response.items.map(r => this.mapReunionToMeeting(r));
        this.meetingsSubject.next(meetings);
      },
      error: (err) => {
        console.error('Error loading meetings:', err);
        this.meetingsSubject.next([]);
      }
    });
  }

  private mapReunionToMeeting(r: Reunion): Meeting {
    const fechaHora = new Date(r.fechaHora);
    const endTime = new Date(fechaHora.getTime() + r.duracionMinutos * 60000);

    return {
      id: r.id,
      title: r.titulo,
      description: r.descripcion,
      date: fechaHora.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: `${fechaHora.toTimeString().slice(0, 5)} - ${endTime.toTimeString().slice(0, 5)}`,
      duration: this.formatDuration(r.duracionMinutos),
      participants: [],
      status: getEstadoLabel(r.estado),
      statusClass: getEstadoClass(r.estado),
      location: r.ubicacion,
      participantsCount: 0,
      totalParticipants: 10,
      progress: 0,
      fullDate: fechaHora,
      createdAt: r.creationTime ? new Date(r.creationTime) : new Date()
    };
  }

  private formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  createMeeting(meetingData: {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: string;
    participants: string[];
    location: string;
    estado: EstadoReunion;
  }): Observable<Meeting> {
    const [startTime] = meetingData.time.split(' - ');
    const fechaHora = new Date(`${meetingData.date}T${startTime}`);

    const request: CreateReunionRequest = {
      titulo: meetingData.title,
      descripcion: meetingData.description,
      fechaHora: fechaHora.toISOString(),
      duracionMinutos: this.parseDuration(meetingData.duration),
      ubicacion: meetingData.location,
      estado: meetingData.estado
    };

    return this.reunionApiService.createReunion(request).pipe(
      map(r => {
        const meeting = this.mapReunionToMeeting(r);
        const currentMeetings = this.meetingsSubject.value;
        this.meetingsSubject.next([...currentMeetings, meeting]);
        return meeting;
      })
    );
  }

  private parseDuration(duration: string): number {
    const durationMap: { [key: string]: number } = {
      '30m': 30,
      '45m': 45,
      '1h': 60,
      '1h 30m': 90,
      '2h': 120
    };
    return durationMap[duration] || 60;
  }

  updateMeeting(id: string, updates: Partial<Meeting>): void {
    const currentMeetings = this.meetingsSubject.value;
    const meeting = currentMeetings.find(m => m.id === id);
    if (!meeting) return;

    const request: CreateReunionRequest = {
      titulo: updates.title ?? meeting.title,
      descripcion: updates.description ?? meeting.description,
      fechaHora: meeting.fullDate.toISOString(),
      duracionMinutos: this.parseDuration(meeting.duration),
      ubicacion: updates.location ?? meeting.location,
      estado: this.getEstadoFromLabel(updates.status ?? meeting.status)
    };

    this.reunionApiService.updateReunion(id, request).subscribe({
      next: (r) => {
        const updatedMeeting = this.mapReunionToMeeting(r);
        const updatedMeetings = currentMeetings.map(m => m.id === id ? updatedMeeting : m);
        this.meetingsSubject.next(updatedMeetings);
      },
      error: (err) => console.error('Error updating meeting:', err)
    });
  }

  private getEstadoFromLabel(label: string): EstadoReunion {
    switch (label) {
      case 'Pendiente': return EstadoReunion.Pendiente;
      case 'Programada': return EstadoReunion.Programada;
      case 'En curso': return EstadoReunion.EnCurso;
      case 'Completada': return EstadoReunion.Completada;
      case 'Cancelada': return EstadoReunion.Cancelada;
      default: return EstadoReunion.Pendiente;
    }
  }

  deleteMeeting(id: string): void {
    this.reunionApiService.deleteReunion(id).subscribe({
      next: () => {
        const currentMeetings = this.meetingsSubject.value;
        this.meetingsSubject.next(currentMeetings.filter(m => m.id !== id));
      },
      error: (err) => console.error('Error deleting meeting:', err)
    });
  }

  getMeeting(id: string): Meeting | undefined {
    return this.meetingsSubject.value.find(m => m.id === id);
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
