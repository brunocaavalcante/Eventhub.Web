import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";
import { BaseService } from "./base.service";
import { PerfilDto } from "../models/perfil.model";

@Injectable({ providedIn: 'root' })
export class PerfilService extends BaseService {

    obterPerfis(): Observable<RetornoAPI<PerfilDto[]>> {
        return this.http.get<RetornoAPI<PerfilDto[]>>(`${this.urlApi}/perfis/ativos`);
    }
}