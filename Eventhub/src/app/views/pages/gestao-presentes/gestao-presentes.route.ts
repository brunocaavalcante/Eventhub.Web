import { authGuard } from "../../../core/utils/guards/auth.guard";
import { CadastrarPresentesComponent } from "./cadastrar-presentes/cadastrar-presentes.component";
import { ConsultarPresentesComponent } from "./consultar-presentes/consultar-presentes.component";
import { DetalharPresenteComponent } from "./detalhar-presente/detalhar-presente.component";
import { EditarPresentesComponent } from "./editar-presentes/editar-presentes.component";
import { PagamentoPresenteComponent } from "./pagamento-presente/pagamento-presente.component";

export const routes = [
    { path: ':idEvento', component: ConsultarPresentesComponent, canActivate: [authGuard] },
    { path: 'cadastrar/:idEvento', component: CadastrarPresentesComponent, canActivate: [authGuard] },
    { path: 'detalhes/:idEvento/:id', component: DetalharPresenteComponent, canActivate: [authGuard] },
    { path: 'pagar/:idEvento/:id', component: PagamentoPresenteComponent, canActivate: [authGuard] },
    { path: 'editar/:idEvento/:id', component: EditarPresentesComponent, canActivate: [authGuard] }
];