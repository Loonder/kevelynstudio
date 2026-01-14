"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/cn";
import { format } from "date-fns";
import { useState } from "react";
import { Check, X, Clock, CheckCircle } from "lucide-react";
import { updateAppointmentStatus } from "@/actions/booking-actions";

interface AppointmentCardProps {
    appointment: {
        id: string;
        startTime: Date;
        endTime: Date;
        status: "pending" | "confirmed" | "completed" | "cancelled" | null;
        clientName: string;
        serviceTitle: string;
    };
    style: React.CSSProperties;
    className?: string;
}

export function AppointmentCard({ appointment, style, className }: AppointmentCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusUpdate = async (status: "confirmed" | "completed" | "cancelled") => {
        setIsLoading(true);
        await updateAppointmentStatus(appointment.id, status);
        setIsLoading(false);
        setIsOpen(false);
    };

    return (
        <>
            <GlassCard
                className={cn(className, "relative z-10")}
                style={style}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <p className="text-[10px] font-bold text-white/90 truncate">{appointment.clientName}</p>
                    <p className="text-[9px] text-white/50 truncate">{appointment.serviceTitle}</p>
                    <p className="text-[8px] text-white/30 uppercase mt-1">
                        {format(appointment.startTime, 'HH:mm')} - {format(appointment.endTime, 'HH:mm')}
                    </p>
                </div>
            </GlassCard>

            {/* Quick Action Popover (Simple implementation) */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div
                        className="absolute z-30 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        style={{
                            top: `${parseInt(style.top as string) + 10}px`,
                            left: "100%",
                            marginLeft: "10px"
                        }}
                    >
                        <div className="p-1 border-b border-white/5 text-[9px] text-center text-white/30 uppercase tracking-widest">
                            Ações
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={() => handleStatusUpdate('confirmed')}
                            className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/10 flex items-center gap-2"
                        >
                            <Check className="w-3 h-3 text-green-500" /> Confirmar
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => handleStatusUpdate('completed')}
                            className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/10 flex items-center gap-2"
                        >
                            <CheckCircle className="w-3 h-3 text-blue-500" /> Finalizar
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => handleStatusUpdate('cancelled')}
                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/10 flex items-center gap-2"
                        >
                            <X className="w-3 h-3" /> Cancelar
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
