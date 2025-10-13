import { Injectable } from "@angular/core";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Presente } from "../models/presente.model";

@Injectable({ providedIn: 'root' })
export class PresenteService extends BaseService {

    collection = collection(this.firestore, `presentes`);

    buscarPresentesPorEvento(eventoId: string): Promise<Presente[]> {
        const presentesRef = collection(this.firestore, 'presentes');
        const q = query(presentesRef, where('eventoId', '==', eventoId));
        return getDocs(q)
            .then(querySnapshot => {
                const presentes: Presente[] = [];
                querySnapshot.forEach(doc => {
                    presentes.push({ id: doc.id, ...doc.data() } as Presente);
                });
                return presentes;
            })
            .catch(err => this.handleError(err));
    }

    cadastro(presente: Presente): Promise<any> {
        if (!presente || !presente.nome || !presente.eventoId) {
            return Promise.reject(new Error('Nome e eventoId são obrigatórios'));
        }
        return addDoc(this.collection, presente)
            .then(docRef => {
                return { id: docRef.id, ...presente };
            })
            .catch(err => this.handleError(err));
    }

    atualizar(id: string, presente: Partial<Presente>): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const presenteDoc = doc(this.firestore, 'presentes', id);
        return updateDoc(presenteDoc, { ...presente })
            .catch(err => this.handleError(err));
    }

    remover(id: string): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const presenteDoc = doc(this.firestore, 'presentes', id);
        return deleteDoc(presenteDoc)
            .catch(err => this.handleError(err));
    }

    buscarPorId(id: string): Promise<Presente | null> {
        const presentesRef = collection(this.firestore, 'presentes');
        const q = query(presentesRef, where('__name__', '==', id));
        return getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    return { id: docSnap.id, ...docSnap.data() } as Presente;
                }
                return null;
            })
            .catch(err => this.handleError(err));
    }
}
