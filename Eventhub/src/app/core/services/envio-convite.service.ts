import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CadastroConviteDTO, ConviteDTO } from "../models/envio.convite.model";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class EnvioConviteService extends BaseService {

    buscarConvitePorEvento(idEvento: number): Observable<RetornoAPI<ConviteDTO>> {
        return this.http.get<RetornoAPI<ConviteDTO>>(`${this.urlApi}/convite/evento/${idEvento}`);
    }

    criarConvite(convite: CadastroConviteDTO): Observable<RetornoAPI<ConviteDTO>> {
        return this.http.post<RetornoAPI<ConviteDTO>>(`${this.urlApi}/convite`, convite);
    }
}
