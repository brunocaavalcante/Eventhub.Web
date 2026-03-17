import { Routes } from '@angular/router';
import { LandingPageComponent } from './views/pages/landing/landing-page.component';
import { AcessoNegadoComponent } from './views/base/navegacao/acesso-negado/acesso-negado.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'acesso-negado',
        component: AcessoNegadoComponent
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./views/pages/gestao-usuarios/gestao-usuarios.route').then(m => m.routes)
    },
    {
        path: 'eventos',
        loadChildren: () => import('./views/pages/gestao-eventos/gestao-eventos.route').then(m => m.routes)
    },
    {
        path: 'convidados',
        loadChildren: () => import('./views/pages/gestao-convidados/gestao-convidados.route').then(m => m.routes)
    },
    {
        path: 'presentes',
        loadChildren: () => import('./views/pages/gestao-presentes/gestao-presentes.route').then(m => m.routes)
    },
    {
        path: 'participar-evento',
        loadChildren: () => import('./views/pages/confirmacao-convite/confirmacao-convite.route').then(m => m.routes)
    },
    {
        path: 'notificacoes',
        loadComponent: () => import('./views/pages/notificacoes/notificacoes.component').then(m => m.NotificacoesComponent)
    }
];
