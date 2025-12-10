import { ConsultarConvidadosComponent } from "./consultar-convidados/consultar-convidados.component";
import { authGuard } from "../../../core/utils/guards/auth.guard";
import { CadastroConvidadoComponent } from "./cadastro-convidado/cadastro-convidado.component";

export const routes = [
    { path: ':idEvento', component: ConsultarConvidadosComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastroConvidadoComponent, canActivate: [authGuard] }
];