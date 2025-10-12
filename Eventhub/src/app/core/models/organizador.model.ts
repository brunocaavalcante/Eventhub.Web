export interface Organizador {
    tipo: 'Pessoa Física' | 'Pessoa Jurídica';
    nome: string;
    foto?: string | null;
    mensagem?: string;
    email: string;
    telefone: string;
    id?: number;
    eventoId?: number;
    usuarioId?: number;
}
