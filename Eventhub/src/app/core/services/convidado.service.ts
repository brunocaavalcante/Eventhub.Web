import { Injectable } from "@angular/core";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Convidado } from "../models/convidado.model";

@Injectable({ providedIn: 'root' })
export class ConvidadoService extends BaseService {

    collection = collection(this.firestore, `convidados`);

    buscarConvidadosPorEvento(eventoId: string): Promise<Convidado[]> {
        const convidadosRef = collection(this.firestore, 'convidados');
        const q = query(convidadosRef, where('idEvento', '==', eventoId));
        return getDocs(q)
            .then(querySnapshot => {
                const convidados: Convidado[] = [];
                querySnapshot.forEach(doc => {
                    convidados.push({ id: doc.id, ...doc.data() } as Convidado);
                });
                return convidados;
            })
            .catch(err => this.handleError(err));
    }

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
