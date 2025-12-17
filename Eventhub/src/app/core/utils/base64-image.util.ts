export class Base64ImageUtil {
  /**
   * Remove o prefixo data:image/...;base64, de uma string base64, se existir.
   * @param dataUrl string base64 ou data URL
   * @returns apenas o base64 puro
   */
  static extractBase64(dataUrl: string): string {
    if (!dataUrl) return '';
    const idx = dataUrl.indexOf('base64,');
    return idx !== -1 ? dataUrl.substring(idx + 7) : dataUrl;
  }

  /**
   * Adiciona o prefixo data:image/jpeg;base64, ao base64 puro (ou outro mime type se informado)
   * @param base64 base64 puro
   * @param mimeType tipo mime, padrão image/jpeg
   * @returns data URL
   */
  static toDataUrl(base64: string, mimeType = 'image/jpeg'): string {
    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * Retorna uma URL pronta para uso em CSS/HTML a partir de uma string base64, data URL ou URL remota.
   */
  static resolveImageSource(imageSrc: string | null | undefined, mimeType = 'image/jpeg'): string {
    if (!imageSrc) {
      return '';
    }

    const trimmed = imageSrc.trim();
    if (!trimmed) {
      return '';
    }

    if (trimmed.startsWith('data:')) {
      return trimmed;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    if (trimmed.startsWith('assets/')) {
      return trimmed;
    }

    return this.toDataUrl(trimmed, mimeType);
  }

  /**
   * Converte uma URL de imagem (HTTP(S) ou data URL) para base64 puro.
   * @param imageSrc URL da imagem
   * @returns base64 puro
   */
  static async getBackgroundBase64(imageSrc: string | null | undefined): Promise<string> {
    if (!imageSrc) {
      return '';
    }

    if (imageSrc.startsWith('data:')) {
      return this.extractBase64(imageSrc);
    }

    try {
      const response = await fetch(imageSrc);
      if (!response.ok) {
        throw new Error(`Falha ao baixar imagem (${response.status})`);
      }
      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);
      return this.extractBase64(dataUrl);
    } catch (error) {
      console.error('Erro ao converter imagem do convite para base64:', error);
      return '';
    }
  }

  private static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}
