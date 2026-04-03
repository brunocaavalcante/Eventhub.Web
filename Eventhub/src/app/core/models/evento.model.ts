import { Imagem } from "./imagem.model";
import { Participante } from "./organizador.model";

export enum StatusEvento {
    Ativo = 1,
    Rascunho = 2,
    Finalizado = 3,
    Cancelado = 4
}

export interface EventoDto {
    id: number;
    idTipoEvento: number;
    status?: EventoStatusDto;
    nome: string;
    tokenConvite: string;
    descricao?: string;
    dataInicio?: Date | null;
    dataFim?: Date | null;
    maxConvidado?: number;
    tipoData: 'unica' | 'periodo';
    endereco?: EnderecoEventoDto;
    fotoCapaBase64?: string;
}

export interface EventoStatusDto {
    id: number;
    descricao: string;
}

export interface EventoUserDto {
    id: number;
    idStatus: number;
    status: string;
    nome: string;
    descricao: string;
    maxConvidado: number;
    idTipoEvento: number;
    tipoEvento: string;
    dataInicio: Date;
    dataFim: Date;
    fotoCapaBase64: string;
    endereco?: EnderecoEventoDto;
    tipoData: 'unica' | 'periodo';
}

export interface CadastroEventoDto {
    nome: string;
    descricao?: string;
    idTipoEvento: number;
    idUsuarioCriador: number;
    maxConvidado: number;
    dataInicio: Date;
    dataFim: Date | null;
    endereco: EnderecoEventoDto;
    imagens: Imagem[];
    participantes: Participante[];
    configuracaoVisibilidade?: ConfiguracaoVisibilidadeDto;
}

export interface ConfiguracaoVisibilidadeDto {
    galeriaFotos: boolean;
    chatConvidados: boolean;
    listaPresentes: boolean;
    listaConvidados: boolean;
    agendaEvento: boolean;
}

export interface TipoEvento {
    id: number;
    nome: string;
    icon: string;
    descricao?: string;
    idFoto?: string;
}

export interface UpdateEventoDto {
    id: number;
    nome: string;
    descricao?: string;
    idTipoEvento: number;
    maxConvidado?: number;
    dataInicio: Date;
    dataFim: Date | null;
    tipoData: 'unica' | 'periodo';
    endereco: EnderecoEventoDto;
    fotoCapaBase64?: string;
}

export interface CancelarEventoDto {
    id: number;
    justificativa: string;
}

export interface ComunicarAlteracoesEventoDto {
    idEvento: number;
    mensagem: string;
}

export interface EnderecoEventoDto {
    cep: string;
    logradouro: string;
    cidade: string;
    numero: string;
    pontoReferencia?: string;
    nomeLocal?: string;
}