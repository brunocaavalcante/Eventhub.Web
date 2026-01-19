import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CreatePixEventoDto, PixEventoDto } from "../models/pix-evento.model";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class PixEventoService extends BaseService {

    cadastro(pix: CreatePixEventoDto): Observable<RetornoAPI<PixEventoDto[]>> {
        return this.http.post<RetornoAPI<PixEventoDto[]>>(`${this.urlApi}/pixevento`, pix);
    }

    buscarPixEventoFinalidade(idEvento: number, finalidade: number): Observable<RetornoAPI<PixEventoDto>> {
        return this.http.get<RetornoAPI<PixEventoDto>>(`${this.urlApi}/pixevento/evento/${idEvento}/finalidade/${finalidade}`);
    }
}