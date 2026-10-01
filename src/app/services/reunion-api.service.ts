import { Injectable } from '@angular/core';
import { Observable, defer, of, throwError } from 'rxjs';
import { Reunion, CreateReunionRequest, PagedResultDto, EstadoReunion } from '../models/reunion.model';

@Injectable({
  providedIn: 'root'
})
export class ReunionApiService {
  private readonly storageKey = 'meetfloow_reuniones';

  getReuniones(skipCount: number = 0, maxResultCount: number = 100): Observable<PagedResultDto<Reunion>> {
    return defer(() => {
      const items = this.readAll();
      return of({
        items: items.slice(skipCount, skipCount + maxResultCount),
        totalCount: items.length
      });
    });
  }

  getReunion(id: string): Observable<Reunion> {
    return defer(() => {
      const reunion = this.readAll().find(r => r.id === id);
      return reunion ? of(reunion) : throwError(() => new Error(`Reunión ${id} no encontrada`));
    });
  }

  createReunion(reunion: CreateReunionRequest): Observable<Reunion> {
    return defer(() => {
      const items = this.readAll();
      const nueva: Reunion = {
        ...reunion,
        id: this.generateId(),
        anfitrionId: 'local-user',
        participantes: reunion.participantes ?? [],
        creationTime: new Date().toISOString()
      };
      items.push(nueva);
      this.writeAll(items);
      return of(nueva);
    });
  }

  updateReunion(id: string, reunion: CreateReunionRequest): Observable<Reunion> {
    return defer(() => {
      const items = this.readAll();
      const index = items.findIndex(r => r.id === id);
      if (index === -1) {
        return throwError(() => new Error(`Reunión ${id} no encontrada`));
      }

      const cambios = Object.fromEntries(
        Object.entries(reunion).filter(([, value]) => value !== undefined)
      );
      const actualizada: Reunion = {
        ...items[index],
        ...cambios,
        participantes: reunion.participantes ?? items[index].participantes ?? []
      };
      items[index] = actualizada;
      this.writeAll(items);
      return of(actualizada);
    });
  }

  deleteReunion(id: string): Observable<void> {
    return defer(() => {
      this.writeAll(this.readAll().filter(r => r.id !== id));
      return of(undefined);
    });
  }

  finishReunion(id: string): Observable<Reunion> {
    return this.changeEstado(id, EstadoReunion.Completada, { horaFin: new Date().toISOString() });
  }

  startReunion(id: string): Observable<Reunion> {
    return this.changeEstado(id, EstadoReunion.EnCurso, { horaInicio: new Date().toISOString() });
  }

  private changeEstado(id: string, estado: EstadoReunion, extra: Partial<Reunion>): Observable<Reunion> {
    return defer(() => {
      const items = this.readAll();
      const index = items.findIndex(r => r.id === id);
      if (index === -1) {
        return throwError(() => new Error(`Reunión ${id} no encontrada`));
      }
      const actualizada: Reunion = { ...items[index], estado, ...extra };
      items[index] = actualizada;
      this.writeAll(items);
      return of(actualizada);
    });
  }

  private readAll(): Reunion[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  private writeAll(items: Reunion[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `reunion-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
