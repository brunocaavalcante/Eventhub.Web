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
}
