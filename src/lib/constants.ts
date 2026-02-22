// L3: Application constants
// Extracted from magic numbers throughout the codebase

export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
} as const;

export const BUSINESS_HOURS = {
    START: 8,
    END: 20,
} as const;

export const HOMEPAGE_MAX_PROFESSIONALS = 4;
export const DEFAULT_APPOINTMENT_DURATION = 60; // minutes

export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];





