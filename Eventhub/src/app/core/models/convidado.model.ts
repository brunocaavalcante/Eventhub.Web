export interface Convidado {
    id?: string;
    nome: string;
    email?: string;
    telefone?: string;
    statusConfirmacao?: "Pendente" | "Confirmado" | "Recusado";
    acompanhante?: number;
    observacao?: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
    idEvento?: string;
    foto?: string;
}
