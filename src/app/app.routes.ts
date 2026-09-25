import { Routes } from '@angular/router';
import { ReunionesComponent } from './reuniones/reuniones.component';
import { InicioComponent } from './inicio/inicio.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { HistorialComponent } from './historial/historial.component';
import { ContactosComponent } from './contactos/contactos.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VideollamadaComponent } from './videollamada/videollamada.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'reuniones', component: ReunionesComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'videollamada/:id', component: VideollamadaComponent }
];
