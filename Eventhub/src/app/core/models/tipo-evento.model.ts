export enum TipoEventoEnum {
    CHÁ_DE_CASA_NOVA = 1,
    CASAMENTO = 2,
    CHÁ_DE_BEBÊ = 3,
    ANIVERSARIO = 4,
    OUTROS = 5
}

export const TipoEventoDescricaoImagem: Record<number, { descricao: string; imagem: string }> = {
    [TipoEventoEnum.CHÁ_DE_CASA_NOVA]: {
        descricao: 'Chá de Casa Nova',
        imagem: 'assets/imagens/casa-nova.png'
    },
    [TipoEventoEnum.CASAMENTO]: {
        descricao: 'Casamento',
        imagem: 'assets/imagens/carrosel.png'
    },
    [TipoEventoEnum.CHÁ_DE_BEBÊ]: {
        descricao: 'Chá de Bebê',
        imagem: 'assets/imagens/cha-bebe.png'
    },
    [TipoEventoEnum.ANIVERSARIO]: {
        descricao: 'Aniversário',
        imagem: 'assets/imagens/aniversario.png'
    }
};

export function getTipoEventoInfo(tipo: number): { descricao: string; imagem: string } {
    return TipoEventoDescricaoImagem[tipo] || { descricao: 'Evento', imagem: 'assets/imagens/casa-nova.png' };
}