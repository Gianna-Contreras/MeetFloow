import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingService, Meeting } from '../services/meeting.service';

declare var JitsiMeetExternalAPI: any;

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
export class VideollamadaComponent implements OnInit, OnDestroy, AfterViewInit {
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
  private jitsiApi: any = null;
  private timerInterval: any;
  meetingTime: string = '00:00';
  elapsedSeconds: number = 0;
  
  @ViewChild('jitsiContainer', { static: false }) jitsiContainer!: ElementRef;

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

  ngAfterViewInit(): void {
    // Initialize Jitsi Meet after view is ready
    setTimeout(() => {
      this.initializeJitsi();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.meetingCheckInterval) {
      clearInterval(this.meetingCheckInterval);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
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
      this.startTimer();
    }
  }

  createNewCall(): void {
    // This method should not be called anymore since we create meetings through the modal
    // If called, redirect to meetings page
    this.router.navigate(['/reuniones']);
  }

  initializeJitsi(): void {
    const domain = 'meet.jit.si';
    const options = {
      roomName: this.callId.replace(/\s/g, ''),
      width: '100%',
      height: '100%',
      parentNode: this.jitsiContainer?.nativeElement,
      userInfo: {
        displayName: 'Usuario'
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        prejoinPageEnabled: false
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1a1a2e',
        // Remove default Jitsi UI elements to use custom controls
        SHOW_PROMOTIONAL_CLOSE_PAGE: false
      },
      onload: this.onJitsiLoad.bind(this)
    };

    this.jitsiApi = new JitsiMeetExternalAPI(domain, options);

    // Listen to Jitsi events
    this.jitsiApi.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft.bind(this),
      participantJoined: this.handleParticipantJoined.bind(this),
      videoConferenceJoined: this.handleVideoConferenceJoined.bind(this),
      videoConferenceLeft: this.handleVideoConferenceLeft.bind(this),
      videoMuteStatusChanged: this.handleVideoStatusChanged.bind(this),
      audioMuteStatusChanged: this.handleAudioStatusChanged.bind(this),
      screenSharingStatusChanged: this.handleScreenSharingStatusChanged.bind(this)
    });
  }

  onJitsiLoad(): void {
    console.log('Jitsi Meet loaded');
  }

  handleClose(): void {
    console.log('Jitsi Meet closed');
  }

  handleParticipantLeft: (participant: any) => void = (participant) => {
    console.log('Participant left:', participant);
    this.removeParticipant(participant.id);
  };

  handleParticipantJoined: (participant: any) => void = (participant) => {
    console.log('Participant joined:', participant);
    this.addJitsiParticipant(participant);
  };

  handleVideoConferenceJoined: (participant: any) => void = (participant) => {
    console.log('Local user joined:', participant);
    this.startTimer();
  };

  handleVideoConferenceLeft: () => void = () => {
    console.log('Local user left');
    this.stopTimer();
  };

  handleVideoStatusChanged: (event: any) => void = (event) => {
    console.log('Video status changed:', event);
    this.isCameraOn = !event.muted;
  };

  handleAudioStatusChanged: (event: any) => void = (event) => {
    console.log('Audio status changed:', event);
    this.isMicrophoneOn = !event.muted;
  };

  handleScreenSharingStatusChanged: (event: any) => void = (event) => {
    console.log('Screen sharing status changed:', event);
    this.isScreenSharing = event.on;
  };

  addJitsiParticipant(participant: any): void {
    const newParticipant: Participant = {
      id: participant.id,
      name: participant.displayName || 'Usuario',
      avatar: this.getInitials(participant.displayName || 'Usuario'),
      isMuted: false,
      isVideoOff: true
    };
    this.participants.push(newParticipant);
    this.addSystemMessage(`${newParticipant.name} se ha unido a la llamada`);
  }

  removeParticipant(participantId: string): void {
    const participant = this.participants.find(p => p.id === participantId);
    if (participant) {
      this.participants = this.participants.filter(p => p.id !== participantId);
      this.addSystemMessage(`${participant.name} ha abandonado la llamada`);
    }
  }

  startTimer(): void {
    this.elapsedSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.meetingTime = this.formatTime(this.elapsedSeconds);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatMessageTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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
    if (this.jitsiApi) {
      if (this.isCameraOn) {
        this.jitsiApi.executeCommand('toggleVideo');
      } else {
        this.jitsiApi.executeCommand('toggleVideo');
      }
    }
  }

  toggleMicrophone(): void {
    if (this.jitsiApi) {
      this.jitsiApi.executeCommand('toggleAudio');
    }
  }

  toggleScreenShare(): void {
    if (this.jitsiApi) {
      this.jitsiApi.executeCommand('toggleShareScreen');
    }
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
    if (this.jitsiApi) {
      this.jitsiApi.executeCommand('hangup');
    }
    
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
}