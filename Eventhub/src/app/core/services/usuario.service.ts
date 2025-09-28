import { Injectable } from "@angular/core";
import { Usuario } from "../models/usuario.model";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, setDoc, collection, getDoc, getDocs, deleteDoc } from '@angular/fire/firestore';
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService extends BaseService {

    /**
     * Cadastra um usuário no Firebase Authentication usando email e senha.
     * Retorna a promise do createUserWithEmailAndPassword para o chamador tratar erros.
     */
    cadastro(usuario: Usuario): Promise<any> {
        if (!usuario || !usuario.email || !usuario.senha) {
            return Promise.reject(new Error('Email e senha são obrigatórios'));
        }
        return createUserWithEmailAndPassword(this.auth, usuario.email, usuario.senha)
            .then(async (userCredential) => {
                try {
                    const user = userCredential.user;
                    const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
                    const now = new Date().toISOString();
                    const payload: Usuario = {
                        uid: user.uid,
                        nome: usuario.nome || '',
                        email: user.email || usuario.email,
                        fotoUrl: usuario.fotoUrl || '',
                        telefone: usuario.telefone || '',
                        dataCriacao: now
                    };

                    // Salva o documento no Firestore sem a senha
                    await setDoc(userDocRef, payload);
                    return { user, payload };
                } catch (err) {
                    this.handleError(err, 'Erro ao salvar dados do usuário.');
                }
            })
            .catch(err => {
                // Erro vindo do createUserWithEmailAndPassword
                this.handleError(err);
            });
    }

    /**
     * Atualiza (faz merge) dos campos informados para o usuário especificado.
     * Usa setDoc com merge para não sobrescrever todo o documento.
     */
    async atualizar(uid: string, dados: Partial<Usuario>): Promise<void> {
        if (!uid) {
            return Promise.reject(new Error('UID é obrigatório para atualizar o usuário'));
        }

        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            // setDoc com { merge: true } atualiza somente os campos fornecidos
            await setDoc(userDocRef, dados as any, { merge: true });
        } catch (err) {
            this.handleError(err, 'Erro ao atualizar usuário.');
        }
    }

    /**
     * Remove o documento do usuário no Firestore.
     */
    async deletar(uid: string): Promise<void> {
        if (!uid) {
            return Promise.reject(new Error('UID é obrigatório para deletar o usuário'));
        }

        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            await deleteDoc(userDocRef);
        } catch (err) {
            this.handleError(err, 'Erro ao deletar usuário.');
        }
    }

    /**
     * Obtém um usuário pelo ID (uid). Retorna null se não existir.
     */
    async obterPorId(uid: string): Promise<Usuario | null> {
        if (!uid) {
            return Promise.reject(new Error('UID é obrigatório para obter o usuário'));
        }

        try {
            const userDocRef = doc(this.firestore, `usuarios/${uid}`);
            const snap = await getDoc(userDocRef);
            if (!snap.exists()) {
                return null;
            }

            const data = snap.data() as Usuario;
            // Garantir que o uid esteja presente no objeto retornado
            return { ...(data as any), uid: snap.id } as Usuario;
        } catch (err) {
            this.handleError(err, 'Erro ao buscar usuário por ID.');
        }
    }

    /**
     * Retorna todos os usuários da coleção `usuarios`.
     */
    async obterTodos(): Promise<Usuario[]> {
        try {
            const colRef = collection(this.firestore, 'usuarios');
            const snapshot = await getDocs(colRef);
            const usuarios: Usuario[] = snapshot.docs.map(d => ({ ...(d.data() as any), uid: d.id } as Usuario));
            return usuarios;
        } catch (err) {
            this.handleError(err, 'Erro ao listar usuários.');
        }
    }

    /**
     * Realiza login via email e senha. Retorna o userCredential do Auth e o perfil salvo no Firestore (se existir).
     */
    async login(email: string, senha: string): Promise<{ user: any, perfil: Usuario | null } | void> {
        if (!email || !senha) {
            return Promise.reject(new Error('Email e senha são obrigatórios'));
        }

        try {
            const cred = await signInWithEmailAndPassword(this.auth, email, senha);
            const user = cred.user;

            // Tentar carregar perfil do Firestore
            try {
                const perfil = await this.obterPorId(user.uid);
                return { user, perfil };
            } catch (err) {
                // se houver problema ao obter o perfil, notifique mas retorne o usuário autenticado
                this.handleError(err, 'Usuário autenticado, mas ocorreu um erro ao carregar o perfil.');
            }
        } catch (err) {
            this.handleError(err);
        }
    }

    /**
     * Desloga o usuário autenticado.
     */
    async logout(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (err) {
            this.handleError(err, 'Erro ao fazer logout.');
        }
    }
}