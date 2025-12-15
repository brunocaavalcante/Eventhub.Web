import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CadastroEventoDto, EventoDto, EventoStatusDto, EventoUserDto } from "../models/evento.model";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class EventoService extends BaseService {

    cadastro(evento: CadastroEventoDto): Observable<RetornoAPI<CadastroEventoDto[]>> {
        return this.http.post<RetornoAPI<CadastroEventoDto[]>>(`${this.urlApi}/eventos`, evento);
    }

    buscarMeusEventos(idUser: number): Observable<RetornoAPI<EventoUserDto[]>> {
        return this.http.get<RetornoAPI<EventoUserDto[]>>(`${this.urlApi}/eventos/usuario/${idUser}`);
    }

    buscarEventoPorId(idEvento: number): Observable<RetornoAPI<EventoDto>> {
        return this.http.get<RetornoAPI<EventoDto>>(`${this.urlApi}/eventos/${idEvento}`);
    }

    buscarStatusEventos(): Observable<RetornoAPI<EventoStatusDto[]>> {
        return this.http.get<RetornoAPI<EventoStatusDto[]>>(`${this.urlApi}/eventos/status`);
    }
}