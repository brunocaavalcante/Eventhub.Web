import { Injectable } from "@angular/core";
import { Usuario } from "../models/usuario.model";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, setDoc, collection, getDoc, getDocs, deleteDoc, addDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseService {

    userCollection = collection(this.firestore, `usuarios`);

    /**
     * Cadastra um usuário no Firebase Authentication usando email e senha.
     * Salva o perfil no Firestore com o mesmo UID do Auth.
     */
    cadastro(usuario: Usuario): Promise<any> {
        if (!usuario || !usuario.email || !usuario.senha) {
            return Promise.reject(new Error('Email e senha são obrigatórios'));
        }
        return createUserWithEmailAndPassword(this.auth, usuario.email, usuario.senha)
            .then(async (userCredential) => {
                try {
                    const user = userCredential.user;
                    const now = new Date().toISOString();

                    const payload: Omit<Usuario, 'senha'> = {
                        uid: user.uid,
                        nome: usuario.nome || '',
                        email: user.email || usuario.email,
                        fotoUrl: usuario.fotoUrl || '',
                        telefone: usuario.telefone || '',
                        dataCriacao: now
                    } as any;

                    const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
                    await setDoc(userDocRef, payload);

                    return { user, payload };
                } catch (err) {
                    this.handleError(err, 'Erro ao salvar dados do usuário.');
                }
            })
            .catch(err => this.handleError(err));
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

    async login(email: string, senha: string): Promise<{ user: any, perfil: Usuario | null } | void> {
        if (!email || !senha) return Promise.reject(new Error('Email e senha são obrigatórios'));
        try {
            const cred = await signInWithEmailAndPassword(this.auth, email, senha);
            const perfil = await this.obterPorId(cred.user.uid);
            return { user: cred.user, perfil };
        } catch (err) {
            this.handleError(err);
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (err) {
            this.handleError(err, 'Erro ao fazer logout.');
        }
    }

    async obterUsuarioLogado(): Promise<Usuario | null> {
        const user = this.auth.currentUser;
        if (!user) return null;
        return this.obterPorId(user.uid);
    }
}