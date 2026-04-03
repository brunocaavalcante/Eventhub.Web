import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CadastroConvidadoDto, ListarConvidadosDto, ParticipanteDto } from "../models/participante.model";
import { map, Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";
import { ConfirmarPresencaDTO, RecusarConviteDto } from "../models/confirmar-presenca.model";

@Injectable({ providedIn: 'root' })
export class ParticipanteService extends BaseService {

    buscarParticipantesConfirmados(idEvento: number): Observable<number> {
        return this.http.get<RetornoAPI<ListarConvidadosDto[]>>(`${this.urlApi}/participantes/evento/${idEvento}/confirmados`).pipe(
            map(response => {
                if (response && response.executouComSucesso && response.data) {
                    // Soma o participante (1) + seus acompanhantes para cada confirmado
                    return response.data.reduce((total, p) => {
                        if (p.statusConfirmacao === "Confirmado") {
                            return total + (p.quantidadeAcompanhantes + 1);
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

    cadastrarConvidado(convidado: CadastroConvidadoDto): Observable<RetornoAPI<ParticipanteDto>> {
        return this.http.post<RetornoAPI<ParticipanteDto>>(`${this.urlApi}/participantes/convidado`, convidado);
    }

    confirmarPresenca(dto: ConfirmarPresencaDTO): Observable<RetornoAPI<void>> {
        return this.http.post<RetornoAPI<void>>(`${this.urlApi}/participantes/confirmar-presenca`, dto);
    }

    recusarConvite(dto: RecusarConviteDto): Observable<RetornoAPI<void>> {
        return this.http.post<RetornoAPI<void>>(`${this.urlApi}/participantes/recusar-convite`, dto);
    }

    enviarConviteWhatsApp(convidado: ListarConvidadosDto, eventoId: number): void {
        const linkEvento = `${window.location.origin}/convite/${eventoId}`;
        
        const mensagem = `Olá ${convidado.nome}! 🎉\n\n` +
            `Você está convidado(a) para nosso evento especial!\n\n` +
            `Confirme sua presença através do link:\n\n` +
            `${linkEvento}\n\n` +
            `Nos vemos lá! 💕`;
        
        // Remove caracteres não numéricos do telefone
        const telefone = convidado.telefone.replace(/\D/g, '');
        
        // Formato: https://wa.me/5511999999999?text=mensagem
        const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        
        // Abre WhatsApp em nova aba
        window.open(whatsappUrl, '_blank');
    }
}
