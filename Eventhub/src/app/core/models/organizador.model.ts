import { Imagem } from "./imagem.model";

export interface Participante {
    tipo: 'Pessoa Física' | 'Pessoa Jurídica';
    nome: string;
    email: string;
    telefone: string;
    mensagem?: string;
    id?: number;
    idPerfil?: number;
}
