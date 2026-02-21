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
  idStatusContribuicao?: number;
  valor: number;
  dataCadastro: Date | string;
}

export interface CancelarContribuicaoPresenteDto {
  idContribuicao: number;
  justificativa: string;
}

export interface ConfirmarContribuicaoPresenteDto {
  idContribuicao: number;
  idPresente: number;
}

export interface UpdateContribuicaoPresenteDto {
  id: number;
  valor: number;
  status?: StatusContribuicaoPresenteDto;
  justificativa?: string;
}

export interface StatusContribuicaoPresenteDto {
  id: number;
  descricao: string;
}
