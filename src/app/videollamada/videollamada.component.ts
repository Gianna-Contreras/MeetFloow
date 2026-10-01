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
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
    }
  }

  loadMeeting(): void {
    this.meeting = this.meetingService.getMeeting(this.meetingId) || null;
    if (this.meeting) {
      this.callId = this.generateCallIdFromMeetingId(this.meetingId);

      if (this.meeting.participantsList && this.meeting.participantsList.length > 0) {
        this.participants = this.meeting.participantsList.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar || this.getInitials(p.name),
          isMuted: false,
          isVideoOff: true
        }));
      } else if (this.meeting.participants && this.meeting.participants.length > 0) {
        this.participants = this.meeting.participants.map((name, index) => ({
          id: `participant-${index}`,
          name: name,
          avatar: this.getInitials(name),
          isMuted: false,
          isVideoOff: true
        }));
      }

      if (this.meeting.status !== 'En curso' && this.meeting.status !== 'Completada') {
        this.meetingService.startMeeting(this.meetingId);
      }
    }
  }

  createNewCall(): void {
    // This method should not be called anymore since we create meetings through the modal
    // If called, redirect to meetings page
    this.router.navigate(['/reuniones']);
  }

  initializeJitsi(): void {
    const domain = 'meet.jit.si';
    const cleanCallId = this.callId.replace(/\s/g, '');
    
    const options = {
      roomName: cleanCallId,
      width: '100%',
      height: '100%',
      parentNode: this.jitsiContainer?.nativeElement,
      userInfo: {
        displayName: this.meeting?.participants[0] || 'Usuario'
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: true,
        enableWelcomePage: false,
        disableDeepLinking: true,
        enableLipSync: true,
        enableRemb: true,
        enableTcc: true,
        useStunTurn: true
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
        DEFAULT_BACKGROUND: '#1a1a2e',
        // Improved design elements
        DEFAULT_LOGO_URL: '',
        DEFAULT_WELCOME_PAGE_LOGO_URL: '',
        PROVIDER_NAME: 'MeetFlow',
        NATIVE_APP_NAME: 'MeetFlow',
        // Improved video layout
        FILM_STRIP_ONLY: false,
        TILE_VIEW_ENABLED: true,
        INITIAL_TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'closedcaptions', 'chat'],
        // Disable unnecessary UI elements
        SHOW_DEEP_LINKING_IMAGE: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_CHROME_EXTENSION_BANNER: false
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
      screenSharingStatusChanged: this.handleScreenSharingStatusChanged.bind(this),
      tileViewChanged: this.handleTileViewChanged.bind(this),
      incomingMessage: this.handleIncomingMessage.bind(this),
      chatUpdated: this.handleChatUpdated.bind(this)
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
  };

  handleVideoConferenceLeft: () => void = () => {
    console.log('Local user left');
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

  handleTileViewChanged: (event: any) => void = (event) => {
    console.log('Tile view changed:', event);
  };

  handleIncomingMessage: (event: any) => void = (event) => {
    console.log('Incoming message:', event);
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: event.sender || 'Participante',
      message: event.message || '',
      timestamp: new Date(),
      isSystem: false
    };
    this.chatMessages.push(message);
  };

  handleChatUpdated: (event: any) => void = (event) => {
    console.log('Chat updated:', event);
    // Handle chat updates from Jitsi
    if (event.messages && Array.isArray(event.messages)) {
      event.messages.forEach((jitsiMessage: any) => {
        const existingMessage = this.chatMessages.find(m => m.id === `jitsi-${jitsiMessage.id}`);
        if (!existingMessage) {
          const message: ChatMessage = {
            id: `jitsi-${jitsiMessage.id}`,
            sender: jitsiMessage.sender?.name || 'Participante',
            message: jitsiMessage.message || '',
            timestamp: new Date(jitsiMessage.timestamp || Date.now()),
            isSystem: false
          };
          this.chatMessages.push(message);
        }
      });
    }
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
    this.saveParticipantsToBackend();
  }

  removeParticipant(participantId: string): void {
    const participant = this.participants.find(p => p.id === participantId);
    if (participant) {
      this.participants = this.participants.filter(p => p.id !== participantId);
      this.addSystemMessage(`${participant.name} ha abandonado la llamada`);
      this.saveParticipantsToBackend();
    }
  }

  saveParticipantsToBackend(): void {
    if (!this.meetingId || !this.meeting) return;

    const participantNames = this.participants.map(p => p.name);
    this.meetingService.updateMeeting(this.meetingId, {
      participants: participantNames,
      participantsCount: this.participants.length
    });
  }

  finishMeeting(): void {
    if (this.meetingId && this.meeting) {
      const participantNames = this.participants.map(p => p.name);
      this.meetingService.finishMeeting(this.meetingId, {
        participants: participantNames,
        participantsCount: participantNames.length
      });
    }
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
      this.jitsiApi.executeCommand('toggleVideo');
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
    this.finishMeeting();
    this.router.navigate(['/reuniones']);
  }

  copyCallId(): void {
    const cleanCallId = this.callId.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanCallId);
    this.addSystemMessage('ID de llamada copiado al portapapeles');
  }

  inviteParticipants(): void {
    const cleanCallId = this.callId.replace(/\s/g, '');
    const meetingUrl = `https://meet.jit.si/${cleanCallId}`;
    
    // Copy meeting URL to clipboard
    navigator.clipboard.writeText(meetingUrl);
    this.addSystemMessage('Enlace de reunión copiado al portapapeles');
    
    // Also show the meeting URL in a prompt for manual sharing
    const userResponse = prompt(
      'Enlace de reunión (copiado al portapapeles):',
      meetingUrl
    );
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
      // Send message through Jitsi API for real-time chat
      if (this.jitsiApi) {
        this.jitsiApi.executeCommand('sendTextMessage', this.newMessage);
      }
      
      // Also add to local chat for immediate feedback
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