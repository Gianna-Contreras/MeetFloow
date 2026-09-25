import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService, Meeting } from '../services/meeting.service';

@Component({
  selector: 'app-crear-reunion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-reunion-modal.component.html',
  styleUrl: './crear-reunion-modal.component.css'
})
export class CrearReunionModalComponent implements OnChanges {
  @Input() show: boolean = false;
  @Output() meetingCreated = new EventEmitter<Meeting>();
  @Output() modalClosed = new EventEmitter<void>();
  
  meetingData = {
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '1h',
    participants: [] as string[],
    location: 'Videollamada'
  };

  participantInput: string = '';

  constructor(private meetingService: MeetingService) {}

  ngOnChanges(): void {
    if (this.show) {
      this.resetForm();
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
  }

  resetForm(): void {
    this.meetingData = {
      title: '',
      description: '',
      date: this.getTodayDate(),
      time: this.getCurrentTime(),
      duration: '1h',
      participants: [],
      location: 'Videollamada'
    };
    this.participantInput = '';
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }

  addParticipant(): void {
    if (this.participantInput.trim()) {
      this.meetingData.participants.push(this.participantInput.trim());
      this.participantInput = '';
    }
  }

  removeParticipant(index: number): void {
    this.meetingData.participants.splice(index, 1);
  }

  createMeeting(): void {
    if (!this.meetingData.title.trim()) {
      alert('Por favor ingresa un título para la reunión');
      return;
    }

    if (!this.meetingData.date || !this.meetingData.time) {
      alert('Por favor selecciona fecha y hora para la reunión');
      return;
    }

    const meetingDate = new Date(`${this.meetingData.date}T${this.meetingData.time}`);
    const endTime = new Date(meetingDate.getTime() + this.getDurationInMs(this.meetingData.duration));
    
    const timeRange = `${this.meetingData.time} - ${endTime.toTimeString().slice(0, 5)}`;

    const newMeeting = this.meetingService.createMeeting({
      title: this.meetingData.title,
      description: this.meetingData.description,
      date: meetingDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: timeRange,
      duration: this.meetingData.duration,
      participants: this.meetingData.participants,
      location: this.meetingData.location,
      participantsCount: this.meetingData.participants.length,
      totalParticipants: 10,
      fullDate: meetingDate
    });

    // Update meeting status to in progress for immediate video call
    this.meetingService.updateMeeting(newMeeting.id, {
      status: 'En curso',
      statusClass: 'in-progress'
    });

    this.meetingCreated.emit(newMeeting);
    this.closeModal();
  }

  getDurationInMs(duration: string): number {
    const durationMap: { [key: string]: number } = {
      '30m': 30 * 60 * 1000,
      '45m': 45 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1h 30m': 90 * 60 * 1000,
      '2h': 120 * 60 * 1000
    };
    return durationMap[duration] || 60 * 60 * 1000;
  }

  getDurationOptions(): string[] {
    return ['30m', '45m', '1h', '1h 30m', '2h'];
  }

  generateMeetingLink(meetingId: string): string {
    // Generate a consistent 6-digit code from meeting ID
    let hash = 0;
    for (let i = 0; i < meetingId.length; i++) {
      const char = meetingId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const segment1 = Math.abs(hash % 900000) + 100000;
    const segment2 = Math.abs((hash * 7) % 900000) + 100000;
    return `${segment1} ${segment2}`;
  }
}