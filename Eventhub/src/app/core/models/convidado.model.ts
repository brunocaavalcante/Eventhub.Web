export interface Convidado {
    id?: string;
    nome: string;
    email?: string;
    telefone?: string;
    confirmado?: boolean;
    acompanhante?: number;
    observacao?: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
    idEvento?: string;
}
