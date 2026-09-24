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
  status: 'Programada' | 'En curso' | 'Completada' | 'Cancelada';
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
      }
    }
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
