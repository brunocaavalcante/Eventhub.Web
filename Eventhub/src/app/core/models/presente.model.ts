import { Imagem } from "./imagem.model";

export interface Presente {
    id?: string;
    nome: string;
    descricao?: string;
    valor?: number;
    contribuicoes?: ContribuicaoPresente[];
    status?: 'disponivel' | 'parcial' | 'completo';
    eventoId?: string;
}

export interface ContribuicaoPresente {
    convidadoId: string;
    valor: number;
    dataContribuicao?: Date | string;
}

export interface CreatePresenteDto {
    nome: string;
    descricao?: string;
    valor: number;
    idEvento: number;
    idCategoria: number;
    imagens?: Imagem[];
}

export interface CategoriaPresenteDto{
    id: number;
    nome: string;
}
