export interface EnvioConvite {
    id?: string;
    idEvento: string;
    idConvidados?: string[];
    nome: string;
    nome2?: string;
    tipoEvento?: string;
    dataEnvio?: Date | string;
    dataEvento?: Date | string;
    horarioEvento?: string;
    localEvento?: string;
    endereco?: string;
    mensagemPersonalizada?: string;
    temaConvite?: string;
    fontStyle?: string;
    backgroundImage?: string;
}

export interface EnvioConviteDTO {
    id: number;
    idConvite: number;
    idParticipante: number;
    idEvento: number;
    dataEnvio: Date | string;
    status: string;
    mensagemResposta: string;
    qtdAcompanhantes: number;
}