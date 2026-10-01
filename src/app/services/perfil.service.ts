import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReunionApiService } from './reunion-api.service';

export interface Perfil {
  nombreCompleto: string;
  correoElectronico: string;
  rol: string;
  fotoPerfil: string;
  idioma: string;
  zonaHoraria: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private perfilSubject = new BehaviorSubject<Perfil>({
    nombreCompleto: 'Gianna Contreras',
    correoElectronico: 'gianna.contreras@meetflow.com',
    rol: 'Gerente de Proyectos',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gianna&backgroundColor=b6e3f4',
    idioma: 'Español (Latinoamérica)',
    zonaHoraria: '(UTC-05:00) Bogotá, Lima, Quito'
  });

  perfil$ = this.perfilSubject.asObservable();

  constructor(private reunionApiService: ReunionApiService) {
    this.cargarPerfilGuardado();
  }

  actualizarPerfil(perfil: Perfil): void {
    this.perfilSubject.next(perfil);
    localStorage.setItem('perfil', JSON.stringify(perfil));
    this.reunionApiService.updateFotoPerfil(perfil.fotoPerfil).subscribe({
      error: (err) => console.error('Error guardando foto en BD:', err)
    });
  }

  private cargarPerfilGuardado(): void {
    const perfilGuardado = localStorage.getItem('perfil');
    if (perfilGuardado) {
      try {
        const perfil = JSON.parse(perfilGuardado);
        this.perfilSubject.next(perfil);
      } catch (e) {
        console.error('Error al cargar perfil guardado:', e);
      }
    }

    this.reunionApiService.getPerfil().subscribe({
      next: (perfil) => {
        if (perfil) {
          this.perfilSubject.next({
            ...this.perfilSubject.value,
            fotoPerfil: perfil.fotoPerfil || this.perfilSubject.value.fotoPerfil,
            nombreCompleto: perfil.nombreCompleto || this.perfilSubject.value.nombreCompleto,
            correoElectronico: perfil.correoElectronico || this.perfilSubject.value.correoElectronico
          });
        }
      },
      error: (err) => console.error('Error cargando perfil desde BD:', err)
    });
  }
}
