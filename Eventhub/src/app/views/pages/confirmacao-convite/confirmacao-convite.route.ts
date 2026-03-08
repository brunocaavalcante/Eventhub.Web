import { Routes } from '@angular/router';
import { VisualizarConviteComponent } from './visualizar-convite/visualizar-convite.component';
import { ResponderConviteComponent } from './responder-convite/responder-convite.component';

// IMPORTANTE: Rotas PÚBLICAS - SEM GUARDS de autenticação!
export const routes: Routes = [
  {
    path: ':id',
    component: VisualizarConviteComponent
  },
  {
    path: ':id/responder',
    component: ResponderConviteComponent
  }
];
