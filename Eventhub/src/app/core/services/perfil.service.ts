import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";
import { BaseService } from "./base.service";
import { PerfilDto } from "../models/perfil.model";
import { ModuloDto } from "../models/sistema.model";

@Injectable({ providedIn: 'root' })
export class PerfilService extends BaseService {

    obterPerfis(): Observable<RetornoAPI<PerfilDto[]>> {
        return this.http.get<RetornoAPI<PerfilDto[]>>(`${this.urlApi}/perfis/ativos`);
    }
    
    obterModulosPerfil(idEvento: number, idPerfil: number): Observable<RetornoAPI<ModuloDto[]>> {
        return this.http.get<RetornoAPI<ModuloDto[]>>(`${this.urlApi}/perfis/${idEvento}/${idPerfil}/modulos`);
    }
}