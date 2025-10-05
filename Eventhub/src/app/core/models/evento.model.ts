import { Organizador } from "./organizador.model";

export interface Evento {
    id?: string;
    nome: string;
    descricao?: string;
    tipoData: 'unica' | 'periodo';
    data?: Date | null;
    periodo?: {
        start: Date | null;
        end: Date | null;
    };
    cep?: string;
    rua?: string;
    cidade?: string;
    numero?: string;
    pontoReferencia?: string;
    imagens?: string[];
    organizadores?: Organizador[];
    status?: 'rascunho' | 'publicado' | 'finalizado';
    criadoEm?: Date;
    atualizadoEm?: Date;
}
