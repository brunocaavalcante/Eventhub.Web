import { Injectable } from "@angular/core";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { CadastroEventoDto, Evento, EventoStatusDto, EventoUserDto } from "../models/evento.model";
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

    buscarStatusEventos(): Observable<RetornoAPI<EventoStatusDto[]>> {
        return this.http.get<RetornoAPI<EventoStatusDto[]>>(`${this.urlApi}/eventos/status`);
    }

    collection = collection(this.firestore, `eventos`);

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