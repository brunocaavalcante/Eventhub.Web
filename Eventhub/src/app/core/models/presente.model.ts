import { ContribuicaoPresenteDto, StatusContribuicaoPresenteDto } from "./contribuicao-presente.model";
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
    contribuicoes?: ContribuicaoPresenteDto[];
    imagens?: Imagem[];
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

export interface PresenteDetalhesDto {
    id: number;
    idEvento: number;
    nome: string;
    descricao?: string;
    valor: number;
    linkProduto?: string;
    status: StatusPresenteDto;
    categoria: CategoriaPresenteDto;
    contribuicoes: ContribuicaoDetalhesDto[];
    imagens?: Imagem[];
}

export interface ContribuicaoDetalhesDto {
    id: number;
    valor: number;
    dataCadastro: Date | string;
    status: StatusContribuicaoPresenteDto;
    participante: ParticipanteContribuicaoDto;
    comprovante?: Imagem;
    justificativa?: string;
}

export interface ParticipanteContribuicaoDto {
    id: number;
    nome: string;
    email?: string;
    foto?: string;
}
