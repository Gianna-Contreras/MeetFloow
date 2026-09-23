import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Meeting, ReunionesService } from '../services/reuniones.service';

@Component({
  selector: 'app-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reuniones.component.html',
  styleUrl: './reuniones.component.css'
})
export class ReunionesComponent {
  activeTab = 'Todas';
  tabs = ['Todas', 'Hoy', 'Próximas', 'Pasadas', 'Canceladas'];

  modalAbierto = false;
  reunionCreada?: Meeting;
  enlaceCreado = '';
  enlaceCopiado = false;
  errorFormulario = '';

  formulario = this.formularioVacio();

  quickSummary = {
    meetingsThisWeek: 7,
    totalParticipants: 32
  };

  recentActivities = [
    {
      icon: '📅',
      description: 'Nueva reunión creada: "Estrategia de producto Q2"',
      time: 'Hace 2 horas',
      status: 'Completado'
    },
    {
      icon: '👥',
      description: 'Gianna Contreras se unió a "Revisión de roadmap"',
      time: 'Hace 3 horas',
      status: 'Completado'
    },
    {
      icon: '✅',
      description: 'Retrospectiva de sprint finalizada',
      time: 'Hace 5 horas',
      status: 'Completado'
    },
    {
      icon: '📝',
      description: 'Notas actualizadas en "Plan de marketing"',
      time: 'Hace 1 día',
      status: 'Completado'
    }
  ];

  constructor(private reunionesService: ReunionesService, private router: Router) {}

  get meetings(): Meeting[] {
    return this.reunionesService.getMeetings();
  }

  get filteredMeetings(): Meeting[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.activeTab) {
      case 'Hoy':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() === today.getTime();
        });
      case 'Próximas':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() > today.getTime() && meeting.status !== 'Completada';
        });
      case 'Pasadas':
        return this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.fullDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() < today.getTime() || meeting.status === 'Completada';
        });
      case 'Canceladas':
        return this.meetings.filter(meeting => meeting.status === 'Cancelada');
      case 'Todas':
      default:
        return this.meetings;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  abrirModal(): void {
    this.formulario = this.formularioVacio();
    this.reunionCreada = undefined;
    this.enlaceCreado = '';
    this.errorFormulario = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  crearReunion(): void {
    if (!this.formulario.title.trim()) {
      this.errorFormulario = 'Escribe un título para la reunión.';
      return;
    }
    if (!this.formulario.fecha || !this.formulario.horaInicio || !this.formulario.horaFin) {
      this.errorFormulario = 'Completa la fecha y el horario de la reunión.';
      return;
    }

    this.errorFormulario = '';
    this.reunionCreada = this.reunionesService.crearReunion(this.formulario);
    this.enlaceCreado = this.reunionesService.enlaceDeReunion(this.reunionCreada.id);
  }

  copiarEnlace(): void {
    navigator.clipboard?.writeText(this.enlaceCreado);
    this.enlaceCopiado = true;
    setTimeout(() => (this.enlaceCopiado = false), 2000);
  }

  entrarALlamada(id: string): void {
    this.modalAbierto = false;
    this.router.navigate(['/reunion', id]);
  }

  enlaceDe(id: string): string {
    return this.reunionesService.enlaceDeReunion(id);
  }

  private formularioVacio() {
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    return {
      title: '',
      fecha,
      horaInicio: '09:00',
      horaFin: '10:00',
      location: '',
      totalParticipants: 2
    };
  }
}
