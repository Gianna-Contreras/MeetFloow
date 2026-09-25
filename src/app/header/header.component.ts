import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService, Perfil } from '../services/perfil.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm = '';
  userName = 'Gianna Contreras';
  userPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gianna&backgroundColor=b6e3f4';

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.perfilService.perfil$.subscribe((perfil: Perfil) => {
      this.userName = perfil.nombreCompleto;
      this.userPhoto = perfil.fotoPerfil;
    });
  }

  ngOnDestroy(): void {}
}
