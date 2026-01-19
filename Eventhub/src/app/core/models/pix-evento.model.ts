import { FinalidadePix } from "../utils/enums/finalidade-pix.enum";

export interface PixEventoDto {
    id: number;
    idEvento: number;
    finalidade: FinalidadePix;
    finalidadeDescricao: string;
    nomeBeneficiario: string;
    qrCodePix: string;
    dataCadastro: Date;
}

export interface CreatePixEventoDto {
    idEvento: number;
    finalidade: FinalidadePix;
    nomeBeneficiario: string;
    qrCodePix: string;
}

export interface UpdatePixEventoDto {
    id: number;
    nomeBeneficiario: string;
    qrCodePix: string;
}
