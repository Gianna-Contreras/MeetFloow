import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService, Meeting } from '../services/meeting.service';
import { EstadoReunion } from '../models/reunion.model';

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
    location: 'Videollamada',
    estado: EstadoReunion.Pendiente as EstadoReunion
  };

  participantInput: string = '';
  isCreating = false;

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
      location: 'Videollamada',
      estado: EstadoReunion.Pendiente
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

    this.isCreating = true;

    this.meetingService.createMeeting({
      title: this.meetingData.title,
      description: this.meetingData.description,
      date: this.meetingData.date,
      time: this.meetingData.time,
      duration: this.meetingData.duration,
      participants: this.meetingData.participants,
      location: this.meetingData.location,
      estado: this.meetingData.estado
    }).subscribe({
      next: (newMeeting) => {
        this.isCreating = false;
        this.meetingCreated.emit(newMeeting);
        this.closeModal();
      },
      error: (err) => {
        this.isCreating = false;
        console.error('Error creating meeting:', err);
        alert('Error al crear la reunión: ' + (err?.error?.message || err?.message || 'Error de conexión'));
      }
    });
  }

  getDurationOptions(): string[] {
    return ['30m', '45m', '1h', '1h 30m', '2h'];
  }

  getEstadoOptions(): { value: EstadoReunion; label: string }[] {
    return [
      { value: EstadoReunion.Pendiente, label: 'Pendiente' },
      { value: EstadoReunion.Programada, label: 'Programada' }
    ];
  }
}
