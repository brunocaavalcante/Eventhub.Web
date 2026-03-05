import { ConsultarConvidadosComponent } from "./consultar-convidados/consultar-convidados.component";
import { authGuard } from "../../../core/utils/guards/auth.guard";

export const routes = [
    { path: 'consultar/:idEvento', component: ConsultarConvidadosComponent, canActivate: [authGuard] }
];