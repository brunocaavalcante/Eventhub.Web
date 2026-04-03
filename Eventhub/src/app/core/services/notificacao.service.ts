import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { RetornoAPI } from '../models/retorno-api.model';
import { NotificacaoResponseDto } from '../models/notificacao.model';

@Injectable({ providedIn: 'root' })
export class NotificacaoService extends BaseService {

    buscarPorUsuario(idUsuario: number): Observable<RetornoAPI<NotificacaoResponseDto[]>> {
        return this.http.get<RetornoAPI<NotificacaoResponseDto[]>>(
            `${this.urlApi}/notificacoes/usuario/${idUsuario}`
        );
    }

    buscarNaoLidas(idUsuario: number): Observable<RetornoAPI<NotificacaoResponseDto[]>> {
        return this.http.get<RetornoAPI<NotificacaoResponseDto[]>>(
            `${this.urlApi}/notificacoes/usuario/${idUsuario}/nao-lidas`
        );
    }

    buscarPorId(id: number): Observable<RetornoAPI<NotificacaoResponseDto>> {
        return this.http.get<RetornoAPI<NotificacaoResponseDto>>(
            `${this.urlApi}/notificacoes/${id}`
        );
    }

    marcarComoLida(id: number): Observable<RetornoAPI<NotificacaoResponseDto>> {
        return this.http.patch<RetornoAPI<NotificacaoResponseDto>>(
            `${this.urlApi}/notificacoes/${id}/marcar-lida`,
            {}
        );
    }

    marcarTodasComoLidas(idUsuario: number): Observable<RetornoAPI<{ mensagem: string }>> {
        return this.http.patch<RetornoAPI<{ mensagem: string }>>(
            `${this.urlApi}/notificacoes/usuario/${idUsuario}/marcar-todas-lidas`,
            {}
        );
    }

    remover(id: number): Observable<RetornoAPI<{ mensagem: string }>> {
        return this.http.delete<RetornoAPI<{ mensagem: string }>>(
            `${this.urlApi}/notificacoes/${id}`
        );
    }
}
