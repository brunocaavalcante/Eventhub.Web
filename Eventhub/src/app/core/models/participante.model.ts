import { PerfilDto } from "./perfil.model";

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

export interface ParticipanteDto {
    id: number;
    idEvento: number;
    perfil: PerfilDto;
    status: string;
}
