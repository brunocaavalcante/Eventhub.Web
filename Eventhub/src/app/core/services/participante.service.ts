import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CadastroConvidadoDto, ListarConvidadosDto, ParticipanteDto } from "../models/participante.model";
import { map, Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";
import { EnvioConviteDTO } from "../models/envio.convite.model";

@Injectable({ providedIn: 'root' })
export class ParticipanteService extends BaseService {

    buscarParticipantesConfirmados(idEvento: number): Observable<number> {
        return this.http.get<RetornoAPI<EnvioConviteDTO[]>>(`${this.urlApi}/participantes/evento/${idEvento}/confirmados`).pipe(
            map(response => {
                if (response && response.executouComSucesso && response.data) {
                    // Soma o participante (1) + seus acompanhantes para cada confirmado
                    return response.data.reduce((total, p) => {
                        if (p.status === "Confirmado") {
                            return total + (p.qtdAcompanhantes + 1);
                        }
                        return total;
                    }, 0);
                }
                return 0;
            })
        );
    }

    obterParticipantePorIdUsuario(idUsuario: number, idEvento: number): Observable<RetornoAPI<ParticipanteDto>> {
        return this.http.get<RetornoAPI<ParticipanteDto>>(`${this.urlApi}/participantes/evento/${idEvento}/usuario/${idUsuario}`);
    }

    obterConvidadosPorIdEvento(idEvento: number): Observable<RetornoAPI<ListarConvidadosDto[]>> {
        return this.http.get<RetornoAPI<ListarConvidadosDto[]>>(`${this.urlApi}/participantes/evento/${idEvento}/convidados`);
    }

    cadastroConvidado(convidado: CadastroConvidadoDto): Observable<RetornoAPI<ParticipanteDto>> {
        return this.http.post<RetornoAPI<ParticipanteDto>>(`${this.urlApi}/participantes/convidado`, convidado);
    }
}
