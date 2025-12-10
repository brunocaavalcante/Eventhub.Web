import { Convidado } from "./participante.model";
import { Imagem } from "./imagem.model";
import { Participante } from "./organizador.model";
import { Presente } from "./presente.model";

export enum StatusEvento {
    Ativo = 1,
    Rascunho = 2,
    Finalizado = 3,
    Cancelado = 4
}

export interface Evento {
    id?: string;
    nome: string;
    descricao?: string;
    quantidadeParticipantes?: number;
    tipoData: 'unica' | 'periodo';
    tipoEvento?: number;
    dataInicio?: Date | null;
    dataFim?: Date | null;
    cep?: string;
    rua?: string;
    cidade?: string;
    numero?: string;
    pontoReferencia?: string;
    imagens?: string[];
    organizadores?: Participante[];
    convidados?: Convidado[];
    presentes?: Presente[];
    status?: StatusEvento | number;
    criadoEm?: Date;
    atualizadoEm?: Date;
    IdUsuario?: number;
}

export interface EventoDto{
    id: number;
    idTipoEvento: number;
    nome: string;
    descricao?: string;
    dataInicio?: Date | null;
    dataFim?: Date | null;
    maxConvidado?: number;
    tipoData: 'unica' | 'periodo';
    endereco?: EnderecoEventoDto;
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
}

export interface TipoEvento {
    id: number;
    nome: string;
    icon: string;
    descricao?: string;
    idFoto?: string;
}

export interface EnderecoEventoDto {
    cep: string;
    logradouro: string;
    cidade: string;
    numero: string;
    pontoReferencia?: string;
}