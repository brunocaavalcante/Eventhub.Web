import { Injectable } from "@angular/core";
import { collection, addDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Evento } from "../models/evento.model";

@Injectable({ providedIn: 'root' })
export class EventoService extends BaseService {

    collection = collection(this.firestore, `eventos`);

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
}