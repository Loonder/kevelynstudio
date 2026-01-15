"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Phone, Mail, Calendar, Clock, Music, Coffee, Thermometer, Volume2, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type AppointmentDetailModalProps = {
    appointment: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AppointmentDetailModal({ appointment, open, onOpenChange }: AppointmentDetailModalProps) {
    if (!appointment) return null;

    // Helper function to safely parse dates
    const safeDate = (dateValue: any) => {
        if (!dateValue) return null;
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? null : date;
    };

    const startDate = safeDate(appointment.startTime);
    const endDate = safeDate(appointment.endTime);

    const statusColors = {
        pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        completed: "bg-green-500/20 text-green-300 border-green-500/30",
        cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
        no_show: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };

    const statusLabels = {
        pending: "Pendente",
        confirmed: "Confirmado",
        completed: "Concluído",
        cancelled: "Cancelado",
        no_show: "Falta",
    };

    const preferences = appointment?.client?.sensoryPreferences;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0A0A0A] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="font-serif text-2xl text-white">Detalhes do Agendamento</DialogTitle>
                        <DialogDescription className="sr-only">
                            Detalhes completos do agendamento, incluindo serviço, profissional e cliente.
                        </DialogDescription>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                            {statusLabels[appointment.status as keyof typeof statusLabels]}
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* Client Info */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Informações do Cliente
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-white/40" />
                                <span className="text-white font-medium">{appointment.client?.fullName || "Nome não disponível"}</span>
                            </div>
                            {appointment.client?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-white/40" />
                                    <span className="text-white/70">{appointment.client.phone}</span>
                                </div>
                            )}
                            {appointment.client?.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-white/40" />
                                    <span className="text-white/70 text-sm">{appointment.client.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service & Professional */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Serviço</h3>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white font-medium mb-1">{appointment.service?.title || "Serviço"}</p>
                                <p className="text-white/40 text-xs">{appointment.service?.durationMinutes || 0} minutos</p>
                                {appointment.service?.category && (
                                    <p className="text-primary text-xs mt-2">{appointment.service.category}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Profissional</h3>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white font-medium mb-1">{appointment.professional?.name || "Profissional"}</p>
                                <p className="text-white/40 text-xs">{appointment.professional?.role || ""}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Data e Horário
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-white/40 text-xs mb-1">Data</p>
                                <p className="text-white font-medium">
                                    {startDate ? format(startDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Data não disponível"}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/40 text-xs mb-1">Horário</p>
                                <div className="flex items-center gap-2 text-white font-medium">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {startDate && endDate
                                        ? `${format(startDate, "HH:mm")} → ${format(endDate, "HH:mm")}`
                                        : "Horário não disponível"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Preferences */}
                    {preferences && (preferences.favoriteMusic || preferences.drinkPreference || preferences.temperature || preferences.musicVolume) && (
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                Preferências do Cliente
                            </h3>
                            <div className="bg-white/5 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                                {preferences.favoriteMusic && (
                                    <div className="flex items-start gap-2">
                                        <Music className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 text-xs">Música</p>
                                            <p className="text-white text-sm">{preferences.favoriteMusic}</p>
                                        </div>
                                    </div>
                                )}
                                {preferences.drinkPreference && preferences.drinkPreference !== "None" && (
                                    <div className="flex items-start gap-2">
                                        <Coffee className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 text-xs">Bebida</p>
                                            <p className="text-white text-sm">
                                                {preferences.drinkPreference === "Water" ? "Água" :
                                                    preferences.drinkPreference === "Coffee" ? "Café" :
                                                        preferences.drinkPreference === "Champagne" ? "Espumante" :
                                                            preferences.drinkPreference === "Tea" ? "Chá" : preferences.drinkPreference}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {preferences.temperature && (
                                    <div className="flex items-start gap-2">
                                        <Thermometer className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 text-xs">Temperatura</p>
                                            <p className="text-white text-sm">
                                                {preferences.temperature === "Warm" ? "Quente" :
                                                    preferences.temperature === "Cool" ? "Frio" : "Neutro"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {preferences.musicVolume && (
                                    <div className="flex items-start gap-2">
                                        <Volume2 className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 text-xs">Volume</p>
                                            <p className="text-white text-sm">
                                                {preferences.musicVolume === "Soft" ? "Suave" :
                                                    preferences.musicVolume === "Medium" ? "Médio" : "Alto"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2 text-white/60 hover:text-white transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={() => {
                            onOpenChange(false);
                            // Parent component should handle opening edit modal
                            if ((window as any).openEditAppointmentModal) {
                                (window as any).openEditAppointmentModal(appointment);
                            }
                        }}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold transition-all"
                    >
                        Editar
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
