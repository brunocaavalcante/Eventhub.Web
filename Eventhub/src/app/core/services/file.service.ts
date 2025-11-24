import { Injectable, inject } from "@angular/core";
import { BaseService } from "./base.service";
import { getDownloadURL, ref, uploadBytes, deleteObject, Storage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FileService extends BaseService {

    private readonly storage: Storage = inject(Storage);

    /**
     * Faz upload de um arquivo (imagem) para o Firebase Storage.
     * @param file Arquivo a ser enviado
     * @param path Caminho/prefixo da pasta (ex: 'eventos/123')
     * @returns URL pública de download
     */
    async uploadImage(file: File, path: string): Promise<string> {
        if (!file) return Promise.reject(new Error('Arquivo inválido'));
        if (!path) return Promise.reject(new Error('Caminho inválido'));

        try {
            const fileName = `${Date.now()}-${file.name}`.replace(/\s+/g, '-');
            const storageRef = ref(this.storage, `${path}/${fileName}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        } catch (err) {
            this.handleError(err, 'Erro ao fazer upload da imagem.');
        }
    }

    /**
     * Exclui um arquivo do Firebase Storage a partir da URL ou do caminho.
     * @param storagePath Caminho no storage (ex: 'eventos/123/arquivo.png'). Se for URL completa, extrai o path.
     */
    async deleteFile(storagePath: string): Promise<void> {
        if (!storagePath) return Promise.reject(new Error('Caminho inválido'));
        try {
            let path = storagePath;
            // Se receber URL completa, tentar extrair o path (formato padrão do Firebase URLs)
            if (storagePath.startsWith('http')) {
                // URL tem '/o/<bucketPath>?'
                const match = decodeURIComponent(storagePath).match(/\/o\/(.*?)\?/);
                if (match && match[1]) {
                    path = match[1];
                }
            }
            const storageRef = ref(this.storage, path);
            await deleteObject(storageRef);
        } catch (err) {
            this.handleError(err, 'Erro ao excluir arquivo.');
        }
    }
}