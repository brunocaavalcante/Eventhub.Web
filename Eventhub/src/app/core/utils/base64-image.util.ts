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
}
