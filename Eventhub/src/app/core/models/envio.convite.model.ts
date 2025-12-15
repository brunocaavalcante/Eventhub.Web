import { Imagem } from "./imagem.model";

export interface EnvioConviteDTO {
    id: number;
    idConvite: number;
    idParticipante: number;
    idEvento: number;
    dataEnvio: Date | string;
    status: string;
    mensagemResposta: string;
    qtdAcompanhantes: number;
}

export interface CadastroConviteDTO {
    idEvento: number;
    nome: string;
    nome2: string;
    mensagem: string;
    temaConvite: string;
    dataInicio: Date | string;
    dataFim: Date | string;
    foto: Imagem;
}

export interface UpdateConviteDTO {
    id: number;
    nome: string;
    nome2: string;
    mensagem: string;
    temaConvite: string;
    dataInicio: Date | string;
    dataFim: Date | string;
    foto: Imagem;
}

export interface ConviteDTO {
    id: number;
    idEvento: number;
    nome: string;
    nome2: string;
    mensagem: string;
    temaConvite: string;
    foto: Imagem;
}