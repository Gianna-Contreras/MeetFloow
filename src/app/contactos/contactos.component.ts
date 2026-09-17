import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contact {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  lastMeeting: string;
  category: 'team' | 'external' | 'favorites';
  meetings: Array<{
    title: string;
    date: string;
  }>;
  notes: string;
}

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent {
  selectedContact: Contact | null = null;
  activeFilter: string = 'todos';
  searchTerm: string = '';

  contacts: Contact[] = [
    {
      id: 1,
      name: 'Andrea López',
      title: 'Gerente de Marketing',
      email: 'andrea.lopez@acme.com',
      phone: '+54 11 1234-5678',
      company: 'Acme Corp.',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMeeting: '15 Sep 2024',
      category: 'external',
      meetings: [
        { title: 'Estrategia de marca Q2', date: '15 Sep 2024' },
        { title: 'Revisión de campaña', date: '10 Sep 2024' },
        { title: 'Presentación de resultados', date: '5 Sep 2024' }
      ],
      notes: 'Andrea es muy proactiva y siempre tiene ideas innovadoras para las campañas de marketing. Prefiere reuniones por la mañana.'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      title: 'Desarrollador Senior',
      email: 'carlos.rodriguez@company.com',
      phone: '+54 11 2345-6789',
      company: 'Tech Solutions',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMeeting: '12 Sep 2024',
      category: 'team',
      meetings: [
        { title: 'Revisión de código', date: '12 Sep 2024' },
        { title: 'Planificación sprint', date: '8 Sep 2024' }
      ],
      notes: 'Experto en frontend y especialista en Angular. Siempre disponible para ayudar al equipo.'
    },
    {
      id: 3,
      name: 'María González',
      title: 'Directora de Ventas',
      email: 'maria.gonzalez@sales.com',
      phone: '+54 11 3456-7890',
      company: 'Global Sales Inc.',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMeeting: '10 Sep 2024',
      category: 'external',
      meetings: [
        { title: 'Acuerdo comercial', date: '10 Sep 2024' },
        { title: 'Presentación de productos', date: '1 Sep 2024' }
      ],
      notes: 'Excelente negociadora. Tiene gran experiencia en el mercado latinoamericano.'
    },
    {
      id: 4,
      name: 'Juan Pérez',
      title: 'UX Designer',
      email: 'juan.perez@design.com',
      phone: '+54 11 4567-8901',
      company: 'Design Studio',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMeeting: '8 Sep 2024',
      category: 'favorites',
      meetings: [
        { title: 'Diseño de interfaz', date: '8 Sep 2024' },
        { title: 'Testing de usuario', date: '5 Sep 2024' }
      ],
      notes: 'Creativo y detallista. Gran capacidad para entender las necesidades del usuario.'
    },
    {
      id: 5,
      name: 'Ana Martínez',
      title: 'Product Manager',
      email: 'ana.martinez@product.com',
      phone: '+54 11 5678-9012',
      company: 'Product Co.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMeeting: '14 Sep 2024',
      category: 'team',
      meetings: [
        { title: 'Roadmap Q4', date: '14 Sep 2024' },
        { title: 'Review de features', date: '11 Sep 2024' }
      ],
      notes: 'Muy organizada y clara en la comunicación. Excelente gestión de prioridades.'
    }
  ];

  get filteredContacts(): Contact[] {
    let filtered = this.contacts;

    if (this.activeFilter !== 'todos') {
      filtered = filtered.filter(contact => contact.category === this.activeFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

  closeDetail(): void {
    this.selectedContact = null;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  sendMessage(contact: Contact): void {
    console.log('Enviando mensaje a:', contact.name);
  }

  scheduleMeeting(contact: Contact): void {
    console.log('Agendando reunión con:', contact.name);
  }

  editContact(contact: Contact): void {
    console.log('Editando contacto:', contact.name);
  }
}
