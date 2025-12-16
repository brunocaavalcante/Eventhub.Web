import { ConsultarConvidadosComponent } from "./consultar-convidados/consultar-convidados.component";
import { authGuard } from "../../../core/utils/guards/auth.guard";
import { CadastroConvidadoComponent } from "./cadastro-convidado/cadastro-convidado.component";
import { TemplateConviteComponent } from "./template-convite/template-convite.component";

export const routes = [
    { path: 'consultar/:idEvento', component: ConsultarConvidadosComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastroConvidadoComponent, canActivate: [authGuard] },
    { path: 'template-convite', component: TemplateConviteComponent },
];