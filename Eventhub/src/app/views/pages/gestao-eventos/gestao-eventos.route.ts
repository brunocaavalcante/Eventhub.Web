import { pendingChangesGuard } from "../../../core/utils/guards/pending-changes.guard";
import { authGuard } from '../../../core/utils/guards/auth.guard';
import { CadastrarEventoComponent } from "./cadastro/cadastrar-evento/cadastrar-evento.component";
import { TipoEventoComponent } from "./cadastro/tipo-evento/tipo-evento.component";
import { HomeEventoComponent } from "./home-evento/home-evento.component";
import { MeusEventosComponent } from "./meus-eventos/meus-eventos.component";

export const routes = [
    { path: 'meus-eventos', component: MeusEventosComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:tipo', component: CadastrarEventoComponent, canDeactivate: [pendingChangesGuard], canActivate: [authGuard] },
    { path: 'tipo-evento', component: TipoEventoComponent, canActivate: [authGuard] },
    { path: 'home/:id', component: HomeEventoComponent, canActivate: [authGuard] },
];