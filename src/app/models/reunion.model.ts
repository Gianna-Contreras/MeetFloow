export enum EstadoReunion {
  Pendiente = 0,
  Programada = 1,
  EnCurso = 2,
  Completada = 3,
  Cancelada = 4
}

export interface Reunion {
  id: string;
  titulo: string;
  descripcion: string;
  fechaHora: string;
  duracionMinutos: number;
  ubicacion: string;
  estado: EstadoReunion;
  anfitrionId: string;
  anfitrionNombre?: string;
  creationTime?: string;
}

export interface CreateReunionRequest {
  titulo: string;
  descripcion: string;
  fechaHora: string;
  duracionMinutos: number;
  ubicacion: string;
  estado: EstadoReunion;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}

export function getEstadoLabel(estado: EstadoReunion): string {
  switch (estado) {
    case EstadoReunion.Pendiente: return 'Pendiente';
    case EstadoReunion.Programada: return 'Programada';
    case EstadoReunion.EnCurso: return 'En curso';
    case EstadoReunion.Completada: return 'Completada';
    case EstadoReunion.Cancelada: return 'Cancelada';
    default: return 'Desconocido';
  }
}

export function getEstadoClass(estado: EstadoReunion): string {
  switch (estado) {
    case EstadoReunion.Pendiente: return 'pending';
    case EstadoReunion.Programada: return 'scheduled';
    case EstadoReunion.EnCurso: return 'in-progress';
    case EstadoReunion.Completada: return 'completed';
    case EstadoReunion.Cancelada: return 'cancelled';
    default: return 'pending';
  }
}
