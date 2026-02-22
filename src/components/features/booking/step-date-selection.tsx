"use client";

import { useBooking } from "@/context/booking-context";
import { PROFESSIONALS } from "@/lib/data-professionals";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function StepDateSelection() {
    const { state, setDate, setTimeSlot, nextStep, prevStep } = useBooking();
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Generate dates dynamically (Next 14 days)
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    // Fetch slots when date/pro changes
    useEffect(() => {
        if (state.date && state.professional && state.service) {
            setLoadingSlots(true);
            // MOCK API CALL - Replace with real endpoint later
            // Simulating network delay
            const timer = setTimeout(() => {
                const mockSlots = [
                    { time: "09:00", available: true },
                    { time: "10:00", available: true },
                    { time: "11:30", available: true },
                    { time: "14:00", available: true },
                    { time: "15:30", available: false }, // Mock busy
                    { time: "16:00", available: true },
                    { time: "18:00", available: true },
                ];
                setAvailableSlots(mockSlots.filter(s => s.available).map(s => s.time));
                setLoadingSlots(false);
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [state.date, state.professional, state.service]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-serif text-white mb-2">Para quando agendamos?</h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mt-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-white/60 uppercase tracking-widest">
                        Profissional: <span className="text-white font-bold">{state.professional?.name}</span>
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Date Selection */}
                <section>
                    <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Selecione o Dia
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                        {dates.map(date => {
                            const isSelected = state.date?.getDate() === date.getDate();
                            const isToday = new Date().getDate() === date.getDate();
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                            return (
                                <button
                                    key={date.toISOString()}
                                    disabled={isWeekend} // Mock rule
                                    onClick={() => setDate(date)}
                                    className={cn(
                                        "p-3 rounded-2xl border flex flex-col items-center justify-center transition-all relative overflow-hidden group",
                                        isSelected
                                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            : "bg-white/5 border-white/10 text-white hover:border-white/30",
                                        isWeekend && "opacity-30 cursor-not-allowed grayscale"
                                    )}
                                >
                                    {isToday && !isSelected && (
                                        <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                                    )}
                                    <span className="text-[10px] uppercase opacity-60 mb-1">
                                        {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                                    </span>
                                    <span className={cn(
                                        "text-xl font-bold font-serif",
                                        isSelected ? "text-black" : "text-white"
                                    )}>
                                        {date.getDate()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Time Slots */}
                <GlassCard className="h-fit">
                    <div className="flex items-center gap-2 mb-6 text-white/50 border-b border-white/10 pb-4">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm uppercase tracking-widest">Horários Disponíveis</span>
                    </div>

                    {!state.date ? (
                        <div className="py-12 flex flex-col items-center justify-center text-white/20 text-center">
                            <CalendarIcon className="w-10 h-10 mb-4 opacity-20" />
                            <p className="text-sm">Selecione uma data no calendário<br />para ver os horários.</p>
                        </div>
                    ) : loadingSlots ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-primary text-xs tracking-widest uppercase">Buscando agenda...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.length > 0 ? availableSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setTimeSlot(time)}
                                    className={cn(
                                        "py-3 rounded-lg text-sm transition-all border relative",
                                        state.timeSlot === time
                                            ? "bg-primary text-black border-primary font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                            : "bg-white/5 text-white border-white/10 hover:border-primary/50 hover:bg-white/10"
                                    )}
                                >
                                    {time}
                                </button>
                            )) : (
                                <p className="col-span-3 text-center text-white/40 py-10 italic">
                                    Sem horários livres nesta data.
                                </p>
                            )}
                        </div>
                    )}
                </GlassCard>
            </div>

            <div className="mt-12 flex justify-between items-center">
                <button onClick={prevStep} className="text-white/50 hover:text-white px-4 transition-colors">
                    Voltar
                </button>
                <div className="h-px flex-1 bg-white/10 mx-6" />
                <button
                    disabled={!state.timeSlot}
                    onClick={nextStep}
                    className="bg-white text-black px-8 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    Continuar <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}






