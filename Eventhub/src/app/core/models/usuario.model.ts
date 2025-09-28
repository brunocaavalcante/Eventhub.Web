export interface Usuario {
    uid?: string;
    nome?: string;
    email: string;
    senha?: string;
    fotoUrl?: string;
    telefone?: string;
    dataCriacao?: Date | string;
}