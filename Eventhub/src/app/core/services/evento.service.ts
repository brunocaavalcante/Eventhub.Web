import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CadastroEventoDto, CancelarEventoDto, ComunicarAlteracoesEventoDto, EventoDto, EventoStatusDto, EventoUserDto, UpdateEventoDto } from "../models/evento.model";
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

    buscarEventoPorToken(token: string): Observable<RetornoAPI<EventoUserDto>> {
        return this.http.get<RetornoAPI<EventoUserDto>>(`${this.urlApi}/eventos/token/${token}`);
    }

    atualizar(evento: UpdateEventoDto): Observable<RetornoAPI<EventoDto>> {
        return this.http.put<RetornoAPI<EventoDto>>(`${this.urlApi}/eventos/${evento.id}`, evento);
    }

    atualizarStatus(idEvento: number, idStatus: number): Observable<RetornoAPI<EventoDto>> {
        return this.http.patch<RetornoAPI<EventoDto>>(`${this.urlApi}/eventos/${idEvento}/status`, { idStatus });
    }

    cancelarEvento(dto: CancelarEventoDto): Observable<RetornoAPI<null>> {
        return this.http.patch<RetornoAPI<null>>(`${this.urlApi}/eventos/${dto.id}/cancelar`, dto);
    }

    reativarEvento(idEvento: number): Observable<RetornoAPI<void>> {
        return this.http.patch<RetornoAPI<void>>(`${this.urlApi}/eventos/${idEvento}/reativar`, {});
    }
    //TODO: Avaliar se esse método deve ficar aqui ou em um serviço específico de notificações
    comunicarAlteracoesAosConvidados(dto: ComunicarAlteracoesEventoDto): Observable<RetornoAPI<null>> {
        return this.http.post<RetornoAPI<null>>(`${this.urlApi}/eventos/${dto.idEvento}/comunicar-alteracoes`, dto);
    }

    excluir(idEvento: number): Observable<RetornoAPI<null>> {
        return this.http.delete<RetornoAPI<null>>(`${this.urlApi}/eventos/${idEvento}`);
    }
}