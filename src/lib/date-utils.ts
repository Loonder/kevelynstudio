export class DateUtils {
    static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    static isSameDay(d1: Date, d2: Date): boolean {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    static setTime(date: Date, hours: number, minutes: number): Date {
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }

    static formatTime(date: Date): string {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    // Check if two ranges overlap
    static isOverlapping(
        start1: Date, end1: Date,
        start2: Date, end2: Date
    ): boolean {
        return start1 < end2 && start2 < end1;
    }
}
