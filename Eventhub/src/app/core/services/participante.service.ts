import { Injectable } from "@angular/core";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Convidado, ParticipanteDto } from "../models/participante.model";
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

    obterParticipantesPorIdEvento(idEvento: number): Observable<RetornoAPI<ParticipanteDto[]>> {
        return this.http.get<RetornoAPI<ParticipanteDto[]>>(`${this.urlApi}/participantes/evento/${idEvento}`);
    }

    collection = collection(this.firestore, `convidados`);

    cadastro(convidado: Convidado): Promise<any> {
        if (!convidado || !convidado.nome || !convidado.idEvento) {
            return Promise.reject(new Error('Nome e idEvento são obrigatórios'));
        }
        return addDoc(this.collection, convidado)
            .then(docRef => {
                return { id: docRef.id, ...convidado };
            })
            .catch(err => this.handleError(err));
    }

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
