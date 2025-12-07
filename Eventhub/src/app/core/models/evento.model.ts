import { Convidado } from "./convidado.model";
import { Imagem } from "./imagem.model";
import { Participante } from "./organizador.model";
import { Presente } from "./presente.model";

export enum StatusEvento {
    Ativo = 1,
    Rascunho = 2,
    Finalizado = 3,
    Cancelado = 4
}

export function getNomeStatusEvento(status: StatusEvento | number): string {
    switch (status) {
        case StatusEvento.Ativo:
            return 'Ativo';
        case StatusEvento.Rascunho:
            return 'Rascunho';
        case StatusEvento.Finalizado:
            return 'Finalizado';
        case StatusEvento.Cancelado:
            return 'Cancelado';
        default:
            return 'Desconhecido';
    }
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

export interface EnderecoEventoDto{
    cep: string;
    logradouro: string;
    cidade: string;
    numero: string;
    pontoReferencia?: string;
}