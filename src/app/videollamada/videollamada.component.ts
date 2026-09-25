import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingService, Meeting } from '../services/meeting.service';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

@Component({
  selector: 'app-videollamada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videollamada.component.html',
  styleUrl: './videollamada.component.css'
})
export class VideollamadaComponent implements OnInit, OnDestroy {
  meetingId: string = '';
  meeting: Meeting | null = null;
  callId: string = '';
  isCameraOn: boolean = false;
  isMicrophoneOn: boolean = false;
  isScreenSharing: boolean = false;
  showParticipants: boolean = true;
  showChat: boolean = true;
  showReactions: boolean = false;
  
  participants: Participant[] = [];
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  
  private meetingCheckInterval: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'] || '';
      if (this.meetingId) {
        this.loadMeeting();
      } else {
        this.createNewCall();
      }
    });

    // Check periodically for meeting updates
    this.meetingCheckInterval = setInterval(() => {
      if (this.meetingId) {
        this.loadMeeting();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.meetingCheckInterval) {
      clearInterval(this.meetingCheckInterval);
    }
  }

  loadMeeting(): void {
    this.meeting = this.meetingService.getMeeting(this.meetingId) || null;
    if (this.meeting) {
      // Generate a consistent call ID based on meeting ID
      this.callId = this.generateCallIdFromMeetingId(this.meetingId);
      // Initialize participants from meeting
      this.participants = this.meeting.participants.map((name, index) => ({
        id: `participant-${index}`,
        name: name,
        avatar: this.getInitials(name),
        isMuted: false,
        isVideoOff: true
      }));
    }
  }

  createNewCall(): void {
    // This method should not be called anymore since we create meetings through the modal
    // If called, redirect to meetings page
    this.router.navigate(['/reuniones']);
  }

  generateCallId(): string {
    const segment1 = Math.floor(100000 + Math.random() * 900000);
    const segment2 = Math.floor(100000 + Math.random() * 900000);
    return `${segment1} ${segment2}`;
  }

  generateCallIdFromMeetingId(meetingId: string): string {
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  toggleCamera(): void {
    this.isCameraOn = !this.isCameraOn;
  }

  toggleMicrophone(): void {
    this.isMicrophoneOn = !this.isMicrophoneOn;
  }

  toggleScreenShare(): void {
    this.isScreenSharing = !this.isScreenSharing;
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  toggleReactions(): void {
    this.showReactions = !this.showReactions;
  }

  leaveCall(): void {
    if (this.meetingId && this.meeting) {
      // Update meeting status to completed
      this.meetingService.updateMeeting(this.meetingId, {
        status: 'Completada',
        statusClass: 'completed',
        progress: 100
      });
    }
    this.router.navigate(['/reuniones']);
  }

  copyCallId(): void {
    navigator.clipboard.writeText(this.callId.replace(' ', ''));
    this.addSystemMessage('ID de llamada copiado al portapapeles');
  }

  addParticipant(): void {
    const name = prompt('Nombre del participante:');
    if (name) {
      const newParticipant: Participant = {
        id: `participant-${Date.now()}`,
        name: name,
        avatar: this.getInitials(name),
        isMuted: false,
        isVideoOff: true
      };
      this.participants.push(newParticipant);
      
      // Update meeting participants
      if (this.meeting) {
        const updatedParticipants = [...this.meeting.participants, name];
        this.meetingService.updateMeeting(this.meetingId, {
          participants: updatedParticipants,
          participantsCount: updatedParticipants.length
        });
      }
      
      this.addSystemMessage(`${name} se ha unido a la llamada`);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'Tú',
        message: this.newMessage,
        timestamp: new Date()
      };
      this.chatMessages.push(message);
      this.newMessage = '';
    }
  }

  addSystemMessage(message: string): void {
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      sender: 'Sistema',
      message: message,
      timestamp: new Date(),
      isSystem: true
    };
    this.chatMessages.push(systemMessage);
  }

  sendReaction(reaction: string): void {
    this.addSystemMessage(`Reacción: ${reaction}`);
    this.showReactions = false;
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}