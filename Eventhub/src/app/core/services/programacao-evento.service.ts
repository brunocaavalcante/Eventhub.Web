import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { RetornoAPI } from '../models/retorno-api.model';
import { 
    ProgramacaoEventoResponseDto, 
    ProgramacaoEventoCreateDto, 
    ProgramacaoEventoUpdateDto 
} from '../models/programacao-evento.model';

@Injectable({ providedIn: 'root' })
export class ProgramacaoEventoService extends BaseService {

    buscarPorEvento(idEvento: number): Observable<RetornoAPI<ProgramacaoEventoResponseDto[]>> {
        return this.http.get<RetornoAPI<ProgramacaoEventoResponseDto[]>>(
            `${this.urlApi}/programacaoevento/evento/${idEvento}`
        );
    }

    buscarPorId(id: number): Observable<RetornoAPI<ProgramacaoEventoResponseDto>> {
        return this.http.get<RetornoAPI<ProgramacaoEventoResponseDto>>(
            `${this.urlApi}/programacaoevento/${id}`
        );
    }

    criar(dto: ProgramacaoEventoCreateDto): Observable<RetornoAPI<ProgramacaoEventoResponseDto>> {
        return this.http.post<RetornoAPI<ProgramacaoEventoResponseDto>>(
            `${this.urlApi}/programacaoevento`,
            dto
        );
    }

    atualizar(id: number, dto: ProgramacaoEventoUpdateDto): Observable<RetornoAPI<ProgramacaoEventoResponseDto>> {
        return this.http.put<RetornoAPI<ProgramacaoEventoResponseDto>>(
            `${this.urlApi}/programacaoevento/${id}`,
            dto
        );
    }

    remover(id: number): Observable<RetornoAPI<any>> {
        return this.http.delete<RetornoAPI<any>>(
            `${this.urlApi}/programacaoevento/${id}`
        );
    }
}
