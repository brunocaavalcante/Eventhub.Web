import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { TipoEvento } from "../models/evento.model";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class TipoEventoService extends BaseService {

    obterTiposEvento(): Observable<RetornoAPI<TipoEvento[]>> {
        return this.http.get<RetornoAPI<TipoEvento[]>>(`${this.urlApi}/tipo-eventos`);
    }
}