import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Perfil {
  nombreCompleto: string;
  correoElectronico: string;
  rol: string;
  fotoPerfil: string;
  idioma: string;
  zonaHoraria: string;
}

interface Notificaciones {
  emailEnabled: boolean;
  pushEnabled: boolean;
  appEnabled: boolean;
  newInvitation: boolean;
  meetingReminder: boolean;
  meetingCancelled: boolean;
  joinRequests: boolean;
  dailySummary: boolean;
  mentions: boolean;
  silenceStart: string;
  silenceEnd: string;
  frequency: string;
}

interface Preferencias {
  duracionPredeterminada: string;
  tiempoRecordatorio: string;
  salaEspera: boolean;
  silenciarMicrofono: boolean;
  camaraApagada: boolean;
  grabacionAutomatica: boolean;
  compartirPantalla: boolean;
  salaEsperaExternos: boolean;
  idiomaPredeterminado: string;
  zonaHoraria: string;
}

interface Integracion {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  conectado: boolean;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  selectedCategory: string = 'perfil';
  
  perfil: Perfil = {
    nombreCompleto: 'Gianna Contreras',
    correoElectronico: 'gianna.contreras@meetflow.com',
    rol: 'Gerente de Proyectos',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gianna&backgroundColor=b6e3f4',
    idioma: 'Español (Latinoamérica)',
    zonaHoraria: '(UTC-05:00) Bogotá, Lima, Quito'
  };

  notificaciones: Notificaciones = {
    emailEnabled: true,
    pushEnabled: true,
    appEnabled: true,
    newInvitation: true,
    meetingReminder: true,
    meetingCancelled: true,
    joinRequests: true,
    dailySummary: false,
    mentions: true,
    silenceStart: '22:00',
    silenceEnd: '07:00',
    frequency: 'Resumen diario'
  };

  preferencias: Preferencias = {
    duracionPredeterminada: '30 min',
    tiempoRecordatorio: '10 min',
    salaEspera: true,
    silenciarMicrofono: true,
    camaraApagada: true,
    grabacionAutomatica: false,
    compartirPantalla: true,
    salaEsperaExternos: true,
    idiomaPredeterminado: 'Español',
    zonaHoraria: 'Usar mi zona horaria'
  };

  integraciones: Integracion[] = [
    {
      id: 'google-calendar',
      nombre: 'Google Calendar',
      descripcion: 'Sincroniza eventos y disponibilidades en tiempo real',
      icon: '📅',
      conectado: true
    },
    {
      id: 'microsoft-outlook',
      nombre: 'Microsoft Outlook',
      descripcion: 'Sincroniza tu calendario y correo de Outlook',
      icon: '📧',
      conectado: true
    },
    {
      id: 'slack',
      nombre: 'Slack',
      descripcion: 'Recibe notificaciones y actualizaciones en tus canales',
      icon: '💬',
      conectado: true
    },
    {
      id: 'zoom',
      nombre: 'Zoom',
      descripcion: 'Crea y gestiona reuniones de Zoom desde MeetFlow',
      icon: '📹',
      conectado: false
    },
    {
      id: 'microsoft-teams',
      nombre: 'Microsoft Teams',
      descripcion: 'Programa y únete a reuniones de Teams sin salir de MeetFlow',
      icon: '👥',
      conectado: false
    },
    {
      id: 'notion',
      nombre: 'Notion',
      descripcion: 'Vincula páginas y bases de datos tus reuniones',
      icon: '📝',
      conectado: false
    },
    {
      id: 'google-drive',
      nombre: 'Google Drive',
      descripcion: 'Adjunta y guarda archivos de Drive en tus reuniones',
      icon: '📁',
      conectado: true
    },
    {
      id: 'asana',
      nombre: 'Asana',
      descripcion: 'Sincroniza tareas y proyectos con tus reuniones',
      icon: '✅',
      conectado: false
    }
  ];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.cargarPerfilGuardado();
    this.cargarNotificacionesGuardadas();
    this.cargarPreferenciasGuardadas();
    this.cargarIntegracionesGuardadas();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getCategoryTitle(category: string): string {
    const titles: { [key: string]: string } = {
      'perfil': 'Perfil',
      'notificaciones': 'Notificaciones',
      'preferencias': 'Preferencias de reunión',
      'integraciones': 'Integraciones',
      'privacidad': 'Privacidad y seguridad',
      'apariencia': 'Apariencia',
      'facturacion': 'Facturación'
    };
    return titles[category] || category;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.perfil.fotoPerfil = e.target.result as string;
          this.guardarPerfil();
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  eliminarFoto(): void {
    this.perfil.fotoPerfil = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gianna&backgroundColor=b6e3f4';
    this.guardarPerfil();
  }

  guardarCambios(): void {
    this.guardarPerfil();
    console.log('Cambios guardados:', this.perfil);
  }

  private guardarPerfil(): void {
    localStorage.setItem('perfil', JSON.stringify(this.perfil));
  }

  private cargarPerfilGuardado(): void {
    const perfilGuardado = localStorage.getItem('perfil');
    if (perfilGuardado) {
      try {
        const perfilParseado = JSON.parse(perfilGuardado);
        this.perfil = { ...this.perfil, ...perfilParseado };
      } catch (e) {
        console.error('Error al cargar perfil guardado:', e);
      }
    }
  }

  guardarNotificaciones(): void {
    this.guardarNotificacionesEnStorage();
    console.log('Notificaciones guardadas:', this.notificaciones);
  }

  private guardarNotificacionesEnStorage(): void {
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
  }

  private cargarNotificacionesGuardadas(): void {
    const notificacionesGuardadas = localStorage.getItem('notificaciones');
    if (notificacionesGuardadas) {
      try {
        const notificacionesParseadas = JSON.parse(notificacionesGuardadas);
        this.notificaciones = { ...this.notificaciones, ...notificacionesParseadas };
      } catch (e) {
        console.error('Error al cargar notificaciones guardadas:', e);
      }
    }
  }

  guardarPreferencias(): void {
    this.guardarPreferenciasEnStorage();
    console.log('Preferencias guardadas:', this.preferencias);
  }

  private guardarPreferenciasEnStorage(): void {
    localStorage.setItem('preferencias', JSON.stringify(this.preferencias));
  }

  private cargarPreferenciasGuardadas(): void {
    const preferenciasGuardadas = localStorage.getItem('preferencias');
    if (preferenciasGuardadas) {
      try {
        const preferenciasParseadas = JSON.parse(preferenciasGuardadas);
        this.preferencias = { ...this.preferencias, ...preferenciasParseadas };
      } catch (e) {
        console.error('Error al cargar preferencias guardadas:', e);
      }
    }
  }

  toggleIntegracion(integracion: Integracion): void {
    integracion.conectado = !integracion.conectado;
    this.guardarIntegraciones();
    console.log('Integración actualizada:', integracion.nombre, integracion.conectado ? 'conectada' : 'desconectada');
  }

  private guardarIntegraciones(): void {
    localStorage.setItem('integraciones', JSON.stringify(this.integraciones));
  }

  private cargarIntegracionesGuardadas(): void {
    const integracionesGuardadas = localStorage.getItem('integraciones');
    if (integracionesGuardadas) {
      try {
        const integracionesParseadas = JSON.parse(integracionesGuardadas);
        this.integraciones = integracionesParseadas;
      } catch (e) {
        console.error('Error al cargar integraciones guardadas:', e);
      }
    }
  }
}
