import { Injectable } from "@angular/core";
import { CreateUsuarioDTO, Usuario, UsuarioInfoDTO } from "../models/usuario.model";
import { doc, setDoc, collection, getDoc, getDocs, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseService {

    userCollection = collection(this.firestore, `usuarios`);

    cadastro(usuario: CreateUsuarioDTO): Observable<RetornoAPI<void>> {
        if (!usuario || !usuario.email || !usuario.password) {
            throw new Error('Email e senha são obrigatórios para cadastro');
        }

        return this.http.post<RetornoAPI<void>>(`${this.urlApi}/usuarios`, usuario);
    }

    async atualizar(uid: string, dados: Partial<Usuario>): Promise<void> {
        if (!uid) return Promise.reject(new Error('UID é obrigatório para atualizar o usuário'));
        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            await setDoc(userDocRef, dados as any, { merge: true });
        } catch (err) {
            this.handleError(err, 'Erro ao atualizar usuário.');
        }
    }

    async deletar(uid: string): Promise<void> {
        if (!uid) return Promise.reject(new Error('UID é obrigatório para deletar o usuário'));
        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            await deleteDoc(userDocRef);
        } catch (err) {
            this.handleError(err, 'Erro ao deletar usuário.');
        }
    }

    async obterPorId(uid: string): Promise<Usuario | null> {
        if (!uid) return Promise.reject(new Error('UID é obrigatório para obter o usuário'));
        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            const snap = await getDoc(userDocRef);
            if (!snap.exists()) return null;
            return { ...(snap.data() as any), uid: snap.id } as Usuario;
        } catch (err) {
            this.handleError(err, 'Erro ao buscar usuário por ID.');
        }
    }

    async obterTodos(): Promise<Usuario[]> {
        try {
            const colRef = collection(this.firestore, 'usuarios'); // coleção criada quando necessário
            const snapshot = await getDocs(colRef);
            return snapshot.docs.map(d => ({ ...(d.data() as any), uid: d.id } as Usuario));
        } catch (err) {
            this.handleError(err, 'Erro ao listar usuários.');
        }
    }
    
    obterUsuarioLogado(): UsuarioInfoDTO | null {
        return sessionStorage.getItem('usuarioLogado') ?
            JSON.parse(sessionStorage.getItem('usuarioLogado') as string)?.usuario as UsuarioInfoDTO : null;
    }
}