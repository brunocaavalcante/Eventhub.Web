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
    idStatusContribuicao: number;
    valor: number;
    formaPagamento: string;
    dataCadastro: Date;
}