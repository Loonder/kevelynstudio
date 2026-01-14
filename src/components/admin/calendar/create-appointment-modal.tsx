"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Calendar, Clock, User, Scissors, CheckCircle2 } from "lucide-react";
import { createAppointment } from "@/actions/calendar-actions";
import { Professional } from "./smart-calendar";
import { addMinutes, format } from "date-fns";
import { toast } from "sonner";

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedDate?: Date | null;
    professionals: Professional[];
    services: any[];
    clients: any[];
    onSuccess?: () => void;
}

export function CreateAppointmentModal({
    isOpen,
    onClose,
    preselectedDate,
    professionals,
    services,
    clients,
    onSuccess
}: CreateAppointmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState("");
    const [professionalId, setProfessionalId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [time, setTime] = useState(preselectedDate ? format(preselectedDate, "HH:mm") : "09:00");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!preselectedDate) return;

            const service = services.find(s => s.id === serviceId);
            if (!service) return;

            const [hours, minutes] = time.split(':').map(Number);
            const start = new Date(preselectedDate);
            start.setHours(hours, minutes, 0, 0);

            const end = addMinutes(start, service.durationMinutes || 60);

            const res = await createAppointment({
                clientId,
                professionalId,
                serviceId,
                startTime: start,
                endTime: end
            });

            if (res.success) {
                toast.success("Agendamento criado com sucesso!");
                onSuccess?.();
                onClose();
            } else {
                toast.error(res.error || "Erro ao criar agendamento");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado ao criar agendamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Novo Agendamento"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Display */}
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-xs text-primary/60 uppercase font-bold">Data Selecionada</p>
                        <p className="text-primary font-medium">
                            {preselectedDate ? format(preselectedDate, "dd 'de' MMMM 'de' yyyy") : "Selecione uma data"}
                        </p>
                    </div>
                </div>

                {/* Client Select */}
                <div>
                    <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block ml-1">Cliente</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            required
                            value={clientId}
                            onChange={e => setClientId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="" className="bg-[#121212] text-white/50">Selecione o Cliente</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id} className="bg-[#121212]">{c.fullName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Service Select */}
                <div>
                    <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block ml-1">Serviço</label>
                    <div className="relative">
                        <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            required
                            value={serviceId}
                            onChange={e => setServiceId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="" className="bg-[#121212] text-white/50">Selecione o Serviço</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id} className="bg-[#121212]">{s.title} ({s.durationMinutes}m)</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Professional Select */}
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block ml-1">Profissional</label>
                        <select
                            required
                            value={professionalId}
                            onChange={e => setProfessionalId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="" className="bg-[#121212] text-white/50">Quem atende?</option>
                            {professionals.map(p => (
                                <option key={p.id} value={p.id} className="bg-[#121212]">{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Input */}
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block ml-1">Horário</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-transparent text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? "Agendando..." : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Confirmar
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
