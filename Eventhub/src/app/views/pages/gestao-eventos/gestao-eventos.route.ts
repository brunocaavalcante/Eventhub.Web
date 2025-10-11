import { pendingChangesGuard } from "../../../core/utils/guards/pending-changes.guard";
import { LayoutComponent } from "../../base/layout/layout.component";
import { CadastrarEventoComponent } from "./cadastro/cadastrar-evento/cadastrar-evento.component";
import { TipoEventoComponent } from "./cadastro/tipo-evento/tipo-evento.component";
import { HomeEventoComponent } from "./home-evento/home-evento.component";
import { MeusEventosComponent } from "./meus-eventos/meus-eventos.component";

export const routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'meus-eventos', component: MeusEventosComponent },
            { path: 'cadastrar/:tipo', component: CadastrarEventoComponent, canDeactivate: [pendingChangesGuard] },
            { path: 'tipo-evento', component: TipoEventoComponent },
            { path: 'home/:id', component: HomeEventoComponent }
        ]
    }
];