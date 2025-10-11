import { Convidado } from "./convidado.model";
import { Organizador } from "./organizador.model";
import { Presente } from "./presente.model";

export interface Evento {
    id?: string;
    nome: string;
    descricao?: string;
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
    organizadores?: Organizador[];
    convidados?: Convidado[];
    presentes?: Presente[];
    status?: 'Rascunho' | 'Ativo' | 'Cancelado' | 'Publicado' | 'Encerrado';
    criadoEm?: Date;
    atualizadoEm?: Date;
    IdUsuario?: string;
}
