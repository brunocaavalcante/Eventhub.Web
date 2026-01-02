import { Imagem } from "./imagem.model";

export interface Presente {
    id?: number;
    idEvento?: number;
    nome: string;
    descricao?: string;
    valor?: number;
    linkProduto?: string;
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

export interface UpdatePresenteDto {
    id: number;
    nome: string;
    descricao?: string;
    valor: number;
    linkProduto?: string;
    idCategoriaPresente: number;
    imagens?: Imagem[];
}

export interface CreatePresenteDto {
    nome: string;
    descricao?: string;
    valor: number;
    linkProduto?: string;
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
