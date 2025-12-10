import { Injectable } from "@angular/core";
import { collection, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { CadastroEventoDto, Evento, EventoDto, EventoStatusDto, EventoUserDto } from "../models/evento.model";
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

    buscarEventoPorId(idEvento: number): Observable<RetornoAPI<EventoDto>> {
        return this.http.get<RetornoAPI<EventoDto>>(`${this.urlApi}/eventos/${idEvento}`);
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
}