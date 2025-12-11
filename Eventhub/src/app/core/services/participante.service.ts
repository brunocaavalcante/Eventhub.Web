import { Injectable } from "@angular/core";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { CadastroConvidadoDto, Convidado, ListarConvidadosDto, ParticipanteDto } from "../models/participante.model";
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

    collection = collection(this.firestore, `convidados`);

    atualizar(id: string, convidado: Partial<Convidado>): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const convidadoDoc = doc(this.firestore, 'convidados', id);
        return updateDoc(convidadoDoc, { ...convidado })
            .catch(err => this.handleError(err));
    }

    remover(id: string): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const convidadoDoc = doc(this.firestore, 'convidados', id);
        return deleteDoc(convidadoDoc)
            .catch(err => this.handleError(err));
    }

    buscarPorId(id: string): Promise<Convidado | null> {
        const convidadosRef = collection(this.firestore, 'convidados');
        const q = query(convidadosRef, where('__name__', '==', id));
        return getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    return { id: docSnap.id, ...docSnap.data() } as Convidado;
                }
                return null;
            })
            .catch(err => this.handleError(err));
    }
}
