import { LayoutComponent } from "../../base/layout/layout.component";
import { CadastrarEventoComponent } from "./cadastro/cadastrar-evento/cadastrar-evento.component";
import { TipoEventoComponent } from "./cadastro/tipo-evento/tipo-evento.component";
import { MeusEventosComponent } from "./meus-eventos/meus-eventos.component";

export const routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'meus-eventos', component: MeusEventosComponent },
            { path: 'cadastrar/:tipo', component: CadastrarEventoComponent },
            { path: 'tipo-evento', component: TipoEventoComponent }
        ]
    }
];