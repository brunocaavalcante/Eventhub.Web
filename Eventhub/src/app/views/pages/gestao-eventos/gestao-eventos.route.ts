import { LayoutComponent } from "../../base/layout/layout.component";
import { MeusEventosComponent } from "./meus-eventos/meus-eventos.component";

export const routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'meus-eventos', component: MeusEventosComponent },
        ]
    }
];