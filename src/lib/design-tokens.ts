// L8: Design Tokens - Centralized Theme Values
// All design values should reference these tokens for consistency

export const colors = {
    // Primary brand colors
    primary: "#D4AF37",
    primaryHover: "#c5a028",
    primaryLight: "rgba(212, 175, 55, 0.1)",
    primaryGlow: "rgba(212, 175, 55, 0.3)",

    // Background colors
    background: "#050505",
    backgroundCard: "#0A0A0A",
    backgroundElevated: "#121212",
    backgroundHover: "rgba(255, 255, 255, 0.05)",

    // Text colors
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.4)",
    textDisabled: "rgba(255, 255, 255, 0.2)",

    // Border colors
    border: "rgba(255, 255, 255, 0.1)",
    borderHover: "rgba(255, 255, 255, 0.2)",
    borderFocus: "rgba(212, 175, 55, 0.5)",

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    // Appointment status colors
    statusPending: "#EAB308",
    statusConfirmed: "#3B82F6",
    statusCompleted: "#10B981",
    statusCancelled: "#EF4444",
    statusNoShow: "#6B7280",

    // Professional agenda colors
    agenda: {
        gold: "#D4AF37",
        purple: "#A855F7",
        pink: "#EC4899",
        blue: "#3B82F6",
        green: "#10B981",
        orange: "#F97316",
        cyan: "#06B6D4",
        red: "#EF4444",
    },
} as const;

export const spacing = {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
} as const;

export const borderRadius = {
    sm: "0.375rem",  // 6px
    md: "0.5rem",    // 8px
    lg: "0.75rem",   // 12px
    xl: "1rem",      // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
} as const;

export const shadows = {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    glow: "0 0 20px rgba(212, 175, 55, 0.3)",
    glowStrong: "0 0 40px rgba(212, 175, 55, 0.5)",
} as const;

export const transitions = {
    fast: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
    spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const zIndex = {
    dropdown: 50,
    sticky: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
    toast: 500,
} as const;

// CSS variable helper for runtime theming
export function cssVar(name: string): string {
    return `var(--${name})`;
}

// Type exports
export type ColorKey = keyof typeof colors;
export type AgendaColor = keyof typeof colors.agenda;
