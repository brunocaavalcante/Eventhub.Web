import { Organizador } from "./organizador.model";

export interface Evento {
    id?: string;
    nome: string;
    descricao?: string;
    tipoData: 'unica' | 'periodo';
    dataInicio?: Date | null;
    dataFim?: Date | null;
    cep?: string;
    rua?: string;
    cidade?: string;
    numero?: string;
    pontoReferencia?: string;
    imagens?: string[];
    organizadores?: Organizador[];
    status?: 'rascunho' | 'ativo' | 'cancelado' | 'publicado' | 'encerrado';
    criadoEm?: Date;
    atualizadoEm?: Date;
    IdUsuario?: string;
}
