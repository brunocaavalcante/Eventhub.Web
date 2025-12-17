export enum TipoEventoEnum {
    CHA_DE_CASA_NOVA = 1,
    CASAMENTO = 2,
    ANIVERSARIO = 3,
    CHA_DE_BEBE = 4,
    FORMATURA = 5,
    NETWORKING = 6,
    COORPORATIVO = 7,
    OUTROS = 8
}

export const TipoEventoDescricaoImagem: Record<number, { descricao: string; imagem: string }> = {
    [TipoEventoEnum.CHA_DE_CASA_NOVA]: {
        descricao: 'Chá de Casa Nova',
        imagem: 'assets/imagens/casa-nova.png'
    },
    [TipoEventoEnum.CASAMENTO]: {
        descricao: 'Casamento',
        imagem: 'assets/imagens/carrosel.png'
    },
    [TipoEventoEnum.CHA_DE_BEBE]: {
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