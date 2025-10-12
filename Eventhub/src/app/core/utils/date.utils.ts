export class DateUtils {
    /**
     * Converte Firestore Timestamp, Date ou string para Date.
     */
    static toDate(data: any): Date | null {
        if (!data) return null;
        // Firestore Timestamp
        if (data.seconds) {
            return new Date(data.seconds * 1000);
        }
        // Date
        if (data instanceof Date) {
            return data;
        }
        // String
        if (typeof data === 'string') {
            return new Date(data);
        }
        return null;
    }

    /**
  * Formata uma data para o formato '12 de Outubro de 2025'.
  */
    static formatarDataExtenso(data: any): string {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const d = DateUtils.toDate(data);
        if (!d) return '';
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = meses[d.getMonth()];
        const ano = d.getFullYear();
        return `${dia} de ${mes} de ${ano}`;
    }

    static formatarHora(data: any): string {
        const d = DateUtils.toDate(data);
        if (!d) return '';
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
}
