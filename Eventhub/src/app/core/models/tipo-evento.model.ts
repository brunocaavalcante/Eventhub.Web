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
    },
    [TipoEventoEnum.FORMATURA]: {
        descricao: 'Formatura',
        imagem: 'assets/imagens/formatura.png'
    },
    [TipoEventoEnum.NETWORKING]: {
        descricao: 'Networking',
        imagem: 'assets/imagens/networking.png'
    },
    [TipoEventoEnum.COORPORATIVO]: {
        descricao: 'Corporativo',
        imagem: 'assets/imagens/corporativo.png'
    },
    [TipoEventoEnum.OUTROS]: {
        descricao: 'Outros',
        imagem: 'assets/imagens/cp_evento_outros.png'
    }
};

export function getTipoEventoInfo(tipo: number): { descricao: string; imagem: string } {
    return TipoEventoDescricaoImagem[tipo] || { descricao: 'Evento', imagem: 'assets/imagens/cp_evento_outros.png' };
}