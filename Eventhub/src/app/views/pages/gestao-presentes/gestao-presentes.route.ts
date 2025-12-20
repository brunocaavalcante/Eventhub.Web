import { authGuard } from "../../../core/utils/guards/auth.guard";
import { CadastrarPresentesComponent } from "./cadastrar-presentes/cadastrar-presentes.component";
import { ConsultarPresentesComponent } from "./consultar-presentes/consultar-presentes.component";

export const routes = [
    { path: ':idEvento', component: ConsultarPresentesComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastrarPresentesComponent, canActivate: [authGuard] },
];