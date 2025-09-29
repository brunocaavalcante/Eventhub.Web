import { Routes } from '@angular/router';
import { LandingPageComponent } from './views/pages/landing/landing-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./views/pages/gestao-usuarios/gestao-usuarios.route').then(m => m.routes)
    },
    {
        path: 'eventos',
        loadChildren: () => import('./views/pages/gestao-eventos/gestao-eventos.route').then(m => m.routes)
    }
];
