import { authGuard } from "../../../core/utils/guards/auth.guard";
import { ConsultarProgramacaoComponent } from "./consultar-programacao/consultar-programacao.component";
import { CadastrarProgramacaoComponent } from "./cadastrar-programacao/cadastrar-programacao.component";
import { EditarProgramacaoComponent } from "./editar-programacao/editar-programacao.component";

export const routes = [
    { path: ':idEvento', component: ConsultarProgramacaoComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastrarProgramacaoComponent, canActivate: [authGuard] },
    { path: 'editar/:idEvento/:id', component: EditarProgramacaoComponent, canActivate: [authGuard] }
];
