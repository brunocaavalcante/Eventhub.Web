import { Imagem } from "./imagem.model";

export interface Presente {
    id?: number;
    eventoId?: number;
    nome: string;
    descricao?: string;
    valor?: number;
    status?: StatusPresenteDto;
    categoria?: CategoriaPresenteDto;
    contribuicoes?: ContribuicaoPresente[];
    imagens?: Imagem[];
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

export interface CategoriaPresenteDto {
    id: number;
    nome: string;
}

export interface StatusPresenteDto {
    id: number;
    descricao: string;
}
