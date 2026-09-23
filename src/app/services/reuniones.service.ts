import { Injectable } from '@angular/core';

export interface Meeting {
  id: string;
  status: string;
  statusClass: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  totalParticipants: number;
  progress: number;
  fullDate: Date;
}

export interface NuevaReunion {
  title: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  location: string;
  totalParticipants: number;
}

const STORAGE_KEY = 'meetfloow.reuniones';

const MEETINGS_INICIALES: Meeting[] = [
  {
    id: 'mfw-estrategia-q2',
    status: 'En curso',
    statusClass: 'in-progress',
    title: 'Estrategia de producto Q2',
    date: '16 Sep 2026',
    time: '10:00 AM - 11:30 AM',
    location: 'Sala de Juntas A',
    participants: 5,
    totalParticipants: 8,
    progress: 62,
    fullDate: new Date('2026-09-16')
  },
  {
    id: 'mfw-roadmap',
    status: 'Programada',
    statusClass: 'scheduled',
    title: 'Revisión de roadmap',
    date: '16 Sep 2026',
    time: '02:00 PM - 03:30 PM',
    location: 'Sala Zoom',
    participants: 4,
    totalParticipants: 7,
    progress: 57,
    fullDate: new Date('2026-09-16')
  },
  {
    id: 'mfw-marketing',
    status: 'Pendiente',
    statusClass: 'pending',
    title: 'Plan de marketing mensual',
    date: '17 Sep 2026',
    time: '09:30 AM - 10:30 AM',
    location: 'Sala de Juntas B',
    participants: 4,
    totalParticipants: 5,
    progress: 80,
    fullDate: new Date('2026-09-17')
  },
  {
    id: 'mfw-retro-sprint',
    status: 'Completada',
    statusClass: 'completed',
    title: 'Retrospectiva de sprint',
    date: '15 Sep 2026',
    time: '11:00 AM - 12:00 PM',
    location: 'Sala de Juntas A',
    participants: 3,
    totalParticipants: 6,
    progress: 50,
    fullDate: new Date('2026-09-15')
  },
  {
    id: 'mfw-stakeholders',
    status: 'Programada',
    statusClass: 'scheduled',
    title: 'Presentación a stakeholders',
    date: '18 Sep 2026',
    time: '03:00 PM - 04:30 PM',
    location: 'Sala Zoom',
    participants: 4,
    totalParticipants: 8,
    progress: 50,
    fullDate: new Date('2026-09-18')
  },
  {
    id: 'mfw-presupuesto',
    status: 'Cancelada',
    statusClass: 'cancelled',
    title: 'Revisión de presupuesto',
    date: '14 Sep 2026',
    time: '04:00 PM - 05:00 PM',
    location: 'Sala de Juntas A',
    participants: 3,
    totalParticipants: 5,
    progress: 0,
    fullDate: new Date('2026-09-14')
  },
  {
    id: 'mfw-kickoff',
    status: 'Programada',
    statusClass: 'scheduled',
    title: 'Kickoff de proyecto',
    date: '20 Sep 2026',
    time: '10:00 AM - 11:00 AM',
    location: 'Sala de Conferencias',
    participants: 6,
    totalParticipants: 10,
    progress: 30,
    fullDate: new Date('2026-09-20')
  }
];

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Injectable({ providedIn: 'root' })
export class ReunionesService {
  private meetings: Meeting[] = this.cargar();

  getMeetings(): Meeting[] {
    return this.meetings;
  }

  getMeeting(id: string): Meeting | undefined {
    return this.meetings.find(meeting => meeting.id === id);
  }

  crearReunion(datos: NuevaReunion): Meeting {
    const fecha = this.parsearFecha(datos.fecha);
    const meeting: Meeting = {
      id: this.generarId(datos.title),
      status: 'Programada',
      statusClass: 'scheduled',
      title: datos.title.trim(),
      date: this.formatearFecha(fecha),
      time: `${this.formatearHora(datos.horaInicio)} - ${this.formatearHora(datos.horaFin)}`,
      location: datos.location.trim() || 'Sala virtual MeetFloow',
      participants: 0,
      totalParticipants: datos.totalParticipants,
      progress: 0,
      fullDate: fecha
    };

    this.meetings = [meeting, ...this.meetings];
    this.guardar();
    return meeting;
  }

  enlaceDeReunion(id: string): string {
    return `${window.location.origin}/reunion/${id}`;
  }

  private generarId(title: string): string {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24);
    const sufijo = Math.random().toString(36).slice(2, 8);
    return `${slug || 'reunion'}-${sufijo}`;
  }

  private parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  private formatearFecha(fecha: Date): string {
    return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
  }

  private formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    const sufijo = horas >= 12 ? 'PM' : 'AM';
    const hora12 = horas % 12 === 0 ? 12 : horas % 12;
    return `${hora12.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} ${sufijo}`;
  }

  private cargar(): Meeting[] {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) {
      return [...MEETINGS_INICIALES];
    }

    try {
      const datos = JSON.parse(guardado) as Meeting[];
      return datos.map(meeting => ({ ...meeting, fullDate: new Date(meeting.fullDate) }));
    } catch {
      return [...MEETINGS_INICIALES];
    }
  }

  private guardar(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.meetings));
  }
}
