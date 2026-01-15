// L5: Structured Logging Utility
// Provides consistent, contextual logging across the application

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    module: string;
    message: string;
    context?: LogContext;
}

// Environment check
const isDev = process.env.NODE_ENV === "development";
const isServer = typeof window === "undefined";

/**
 * Creates a logger instance for a specific module
 * @param module - Module name for context (e.g., "EditAppointmentModal", "calendar-actions")
 */
export function createLogger(module: string) {
    const formatLog = (level: LogLevel, message: string, context?: LogContext): LogEntry => ({
        timestamp: new Date().toISOString(),
        level,
        module,
        message,
        context,
    });

    const output = (entry: LogEntry) => {
        const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}]`;
        const msg = `${prefix} ${entry.message}`;

        // In development, use pretty console output
        if (isDev) {
            const styles = {
                debug: "color: #8B8B8B",
                info: "color: #3B82F6",
                warn: "color: #F59E0B",
                error: "color: #EF4444; font-weight: bold",
            };

            if (!isServer) {
                console.log(`%c${msg}`, styles[entry.level], entry.context || "");
            } else {
                console[entry.level](msg, entry.context || "");
            }
        } else {
            // In production, use structured JSON logs for log aggregators
            console[entry.level](JSON.stringify(entry));
        }
    };

    return {
        debug: (message: string, context?: LogContext) => {
            if (isDev) {
                output(formatLog("debug", message, context));
            }
        },

        info: (message: string, context?: LogContext) => {
            output(formatLog("info", message, context));
        },

        warn: (message: string, context?: LogContext) => {
            output(formatLog("warn", message, context));
        },

        error: (message: string, context?: LogContext) => {
            output(formatLog("error", message, context));
        },

        // Special method for tracking user actions
        action: (action: string, details?: LogContext) => {
            output(formatLog("info", `USER_ACTION: ${action}`, details));
        },

        // Special method for API/DB operations
        operation: (operation: string, success: boolean, details?: LogContext) => {
            const level = success ? "info" : "error";
            output(formatLog(level, `OPERATION: ${operation} - ${success ? "SUCCESS" : "FAILED"}`, details));
        },
    };
}

// Pre-configured loggers for common modules
export const loggers = {
    calendar: createLogger("Calendar"),
    appointments: createLogger("Appointments"),
    auth: createLogger("Auth"),
    professionals: createLogger("Professionals"),
    api: createLogger("API"),
} as const;

// Usage example:
// import { loggers } from "@/lib/logger";
// loggers.appointments.info("Appointment created", { appointmentId: "123" });
// loggers.appointments.error("Failed to create", { error: err.message });
