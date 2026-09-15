import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Inicio', icon: '🏠', path: '/inicio' },
    { label: 'Reuniones', icon: '📅', path: '/reuniones' },
    { label: 'Calendario', icon: '📆', path: '/calendario' },
    { label: 'Historial', icon: '📋', path: '/historial' },
    { label: 'Contactos', icon: '👥', path: '/contactos' },
    { label: 'Configuración', icon: '⚙️', path: '/configuracion' }
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
