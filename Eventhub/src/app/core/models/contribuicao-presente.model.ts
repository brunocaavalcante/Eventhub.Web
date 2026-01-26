import { Imagem } from "./imagem.model";

export interface CreateContribuicaoPresenteDto {
    idPresente: number;
    idParticipante: number;
    valor: number;
    formaPagamento: string;
    comprovante: Imagem;
}

export interface ContribuicaoPresenteDto {
    id: number;
    idPresente: number;
    idParticipante: number;
    valor: number;
    dataCadastro: Date | string;
    status: string;
}

export interface CancelarContribuicaoPresenteDto {
    idContribuicao: number;
    justificativa: string;
}