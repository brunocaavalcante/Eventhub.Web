export interface Presente {
    id?: string;
    nome: string;
    descricao?: string;
    valor?: number;
    contribuicoes?: ContribuicaoPresente[];
    status?: 'disponivel' | 'parcial' | 'completo';
    eventoId?: string;
}

export interface ContribuicaoPresente {
    convidadoId: string;
    valor: number;
    dataContribuicao?: Date | string;
}
