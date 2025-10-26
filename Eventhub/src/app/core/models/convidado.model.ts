export interface Convidado {
    id?: string;
    nome: string;
    email?: string;
    telefone?: string;
    statusConfirmacao?: "Pendente" | "Confirmado" | "Recusado" | "Pendente envio convite";
    acompanhante?: number;
    observacao?: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
    idEvento?: string;
    foto?: string;
}
