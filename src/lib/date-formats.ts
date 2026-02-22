// L7: Centralized Date Formatting Utilities
// All date formatting in the app should use these helpers for consistency

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Standard date formats used throughout the application
 */
export const DATE_FORMATS = {
    // Time only: "14:30"
    time: "HH:mm",
    // Short date: "15 Jan"
    dateShort: "d MMM",
    // Medium date: "15/01/2026"
    dateMedium: "dd/MM/yyyy",
    // Long date: "15 de janeiro de 2026"
    dateLong: "d 'de' MMMM 'de' yyyy",
    // Full date with weekday: "quarta-feira, 15 de janeiro"
    dateFull: "EEEE, d 'de' MMMM",
    // DateTime: "15/01/2026 14:30"
    dateTime: "dd/MM/yyyy HH:mm",
    // ISO format for inputs: "2026-01-15"
    dateInput: "yyyy-MM-dd",
} as const;

/**
 * Format a date to time only (HH:mm)
 */
export function formatTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.time);
}

/**
 * Format a date to short format (15 Jan)
 */
export function formatDateShort(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.dateShort, { locale: ptBR });
}

/**
 * Format a date to medium format (15/01/2026)
 */
export function formatDateMedium(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.dateMedium);
}

/**
 * Format a date to long format (15 de janeiro de 2026)
 */
export function formatDateLong(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.dateLong, { locale: ptBR });
}

/**
 * Format a date to full format with weekday (quarta-feira, 15 de janeiro)
 */
export function formatDateFull(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.dateFull, { locale: ptBR });
}

/**
 * Format a date range (14:30 → 15:30)
 */
export function formatTimeRange(start: Date | string, end: Date | string): string {
    return `${formatTime(start)} → ${formatTime(end)}`;
}

/**
 * Format for HTML date input (yyyy-MM-dd)
 */
export function formatDateInput(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, DATE_FORMATS.dateInput);
}





