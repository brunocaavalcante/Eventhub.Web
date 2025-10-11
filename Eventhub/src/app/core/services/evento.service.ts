import { Injectable } from "@angular/core";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Evento } from "../models/evento.model";

@Injectable({ providedIn: 'root' })
export class EventoService extends BaseService {

    collection = collection(this.firestore, `eventos`);

    buscarMeusEventos(idUser: string): Promise<Evento[]> {
        const eventosRef = collection(this.firestore, 'eventos');
        const q = query(eventosRef, where('IdUsuario', '==', idUser));
        return getDocs(q)
            .then(querySnapshot => {
                const eventos: Evento[] = [];
                querySnapshot.forEach(doc => {
                    eventos.push({ id: doc.id, ...doc.data() } as Evento);
                });
                return eventos;
            })
            .catch(err => this.handleError(err));
    }

    cadastro(evento: Evento): Promise<any> {
        if (!evento || !evento.nome) {
            return Promise.reject(new Error('Nome e data são obrigatórios'));
        }

        return addDoc(this.collection, evento)
            .then(docRef => {
                console.log('Evento cadastrado com ID:', docRef.id);
                return { id: docRef.id, ...evento };
            })
            .catch(err => this.handleError(err));
    }

    atualizar(id: string, evento: Partial<Evento>): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const eventoDoc = doc(this.firestore, 'eventos', id);
        return updateDoc(eventoDoc, { ...evento })
            .catch(err => this.handleError(err));
    }

    remover(id: string): Promise<void> {
        if (!id) {
            return Promise.reject(new Error('ID é obrigatório'));
        }
        const eventoDoc = doc(this.firestore, 'eventos', id);
        return deleteDoc(eventoDoc)
            .catch(err => this.handleError(err));
    }

    buscarPorId(id: string): Promise<Evento | null> {
        const eventosRef = collection(this.firestore, 'eventos');
        const q = query(eventosRef, where('__name__', '==', id));
        return getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    return { id: docSnap.id, ...docSnap.data() } as Evento;
                }
                return null;
            })
            .catch(err => this.handleError(err));
    }
}