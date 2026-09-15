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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.cargarPerfilGuardado();
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
}
