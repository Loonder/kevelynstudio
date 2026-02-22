"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Service } from "@/lib/data";
import { Professional } from "@/lib/data-professionals";

type BookingState = {
    step: number;
    service: Service | null;
    professional: Professional | null;
    date: Date | null;
    timeSlot: string | null;
    clientData: {
        name: string;
        email: string;
        phone: string;
    };
    sensory: {
        musicGenre: string;
        drink: string;
    };
};

type BookingContextType = {
    state: BookingState;
    setService: (service: Service) => void;
    setProfessional: (pro: Professional) => void;
    setDate: (date: Date) => void;
    setTimeSlot: (time: string) => void;
    setClientData: (data: BookingState["clientData"]) => void;
    setSensory: (data: BookingState["sensory"]) => void;
    nextStep: () => void;
    prevStep: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BookingState>({
        step: 1,
        service: null,
        professional: null,
        date: null,
        timeSlot: null,
        clientData: { name: "", email: "", phone: "" },
        sensory: { musicGenre: "", drink: "" },
    });

    const nextStep = () => setState(s => ({ ...s, step: s.step + 1 }));
    const prevStep = () => setState(s => ({ ...s, step: Math.max(1, s.step - 1) }));

    return (
        <BookingContext.Provider value={{
            state,
            setService: (service) => setState(s => ({ ...s, service })),
            setProfessional: (professional) => setState(s => ({ ...s, professional })),
            setDate: (date) => setState(s => ({ ...s, date })),
            setTimeSlot: (timeSlot) => setState(s => ({ ...s, timeSlot })),
            setClientData: (clientData) => setState(s => ({ ...s, clientData })),
            setSensory: (sensory) => setState(s => ({ ...s, sensory })),
            nextStep,
            prevStep
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error("useBooking must be used within BookingProvider");
    return context;
};





