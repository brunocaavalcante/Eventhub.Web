import { ConsultarConvidadosComponent } from "./consultar-convidados/consultar-convidados.component";
import { CadastrarConvidadoComponent } from "./cadastrar-convidado/cadastrar-convidado.component";
import { authGuard } from "../../../core/utils/guards/auth.guard";

export const routes = [
    { path: 'consultar/:idEvento', component: ConsultarConvidadosComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastrarConvidadoComponent, canActivate: [authGuard] }
];