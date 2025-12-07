export enum PerfilParticipante {
    Administrador = 'Administrador',
    Musico = 'Músico',
    Cerimonialista = 'Cerimonialista',
    FotografoFilmagem = 'Fotógrafo / Filmagem',
    Seguranca = 'Segurança',
    BuffetCozinha = 'Buffet / Cozinha',
    Coordenador = 'Coordenador',
    Ajudante = 'Ajudante',
    Outro = 'Outro'
}

export interface PerfilDto {
    id: number;
    descricao: string;
    status: string;
    icon: string;
}