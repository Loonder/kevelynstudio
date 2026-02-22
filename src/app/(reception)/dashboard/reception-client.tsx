"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Play, CheckCircle, Clock, Music, Coffee, Thermometer, FileText, User } from "lucide-react";
import { ExperienceService } from "@/services/experience-service";
import { WelcomeOverlay } from "@/components/reception/welcome-overlay";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

export interface Appointment {
    id: string;
    startTime: string | Date;
    status: "pending" | "confirmed" | "completed" | "cancelled" | null;
    client: {
        id: string;
        fullName: string;
        sensoryPreferences: any;
        technicalNotes: string | null;
    };
    service: {
        title: string;
    };
    professional: {
        name: string;
    };
}

export function ReceptionClient({ appointments }: { appointments: Appointment[] }) {
    const [welcomeClient, setWelcomeClient] = useState<Appointment | null>(null);
    const [selectedClient, setSelectedClient] = useState<Appointment | null>(null);

    const handleCheckIn = async (appt: Appointment) => {
        // Trigger the Experience
        await ExperienceService.welcomeClient(
            {
                name: appt.client.fullName,
                sensoryPreferences: appt.client.sensoryPreferences
            },
            () => setWelcomeClient(appt) // Show overlay
        );

        // Auto-hide overlay after 10 seconds
        setTimeout(() => {
            setWelcomeClient(null);
        }, 10000);
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <WelcomeOverlay
                isVisible={!!welcomeClient}
                clientName={welcomeClient?.client.fullName || ""}
                sensoryPrefs={welcomeClient?.client.sensoryPreferences}
                onClose={() => setWelcomeClient(null)}
            />

            {/* Main Area: Daily Schedule */}
            <main className="flex-1 overflow-y-auto px-8 py-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-2">Kevelyn Studio | Concierge</h1>
                        <p className="text-white/40 tracking-widest uppercase text-xs font-light">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl text-primary font-serif">
                            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {appointments.length === 0 ? (
                        <div className="py-20 text-center border border-white/5 rounded-3xl">
                            <p className="text-white/20 font-serif italic text-2xl">Nenhum agendamento para hoje.</p>
                        </div>
                    ) : (
                        appointments.map(appt => (
                            <GlassCard
                                key={appt.id}
                                className={cn(
                                    "group flex items-center justify-between p-8 transition-all duration-500 cursor-pointer border-l-4",
                                    selectedClient?.id === appt.id ? "border-l-primary bg-white/[0.05]" : "border-l-transparent hover:border-l-primary/30",
                                    appt.status === 'completed' && "opacity-50 grayscale"
                                )}
                                onClick={() => setSelectedClient(appt)}
                            >
                                <div className="flex items-center gap-10">
                                    <div className="text-center w-20">
                                        <span className="block text-2xl font-bold text-white leading-none mb-1">
                                            {new Date(appt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-tighter text-white/30">Horário</span>
                                    </div>

                                    <div className="h-12 w-[1px] bg-white/10" />

                                    <div>
                                        <h3 className="text-3xl text-white font-serif mb-1 group-hover:text-primary transition-colors">{appt.client.fullName}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-primary text-[10px] uppercase tracking-[0.2em]">{appt.service.title}</p>
                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">{appt.professional.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {appt.status !== 'completed' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCheckIn(appt); }}
                                            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-serif text-lg hover:bg-primary transition-all transform active:scale-95 shadow-xl"
                                        >
                                            <Play className="w-4 h-4 fill-black" /> Check-in
                                        </button>
                                    )}
                                    {appt.status === 'completed' && (
                                        <div className="flex items-center gap-2 text-primary/60 italic font-serif">
                                            <CheckCircle className="w-5 h-5" /> Finalizado
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>
            </main>

            {/* Side Panel: Memory Lane */}
            <AnimatePresence mode="wait">
                {selectedClient ? (
                    <motion.aside
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className="w-[450px] bg-[#050505] border-l border-white/5 p-10 overflow-y-auto"
                    >
                        <div className="mb-12">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2 block">Memory Lane</span>
                            <h2 className="text-4xl text-white font-serif">{selectedClient.client.fullName}</h2>
                        </div>

                        {/* Sensory Preferences */}
                        <section className="mb-12">
                            <h3 className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <User className="w-3 h-3" /> Preferências Sensoriais
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <PreferenceItem
                                    icon={<Music className="w-5 h-5" />}
                                    label="Playlist"
                                    value={selectedClient.client.sensoryPreferences?.favoriteMusic || "Não definido"}
                                />
                                <PreferenceItem
                                    icon={<Coffee className="w-5 h-5" />}
                                    label="Bebida"
                                    value={selectedClient.client.sensoryPreferences?.drinkPreference || "Não definido"}
                                />
                                <PreferenceItem
                                    icon={<Thermometer className="w-5 h-5" />}
                                    label="Clima"
                                    value={selectedClient.client.sensoryPreferences?.temperature || "Padrão"}
                                />
                                <PreferenceItem
                                    icon={<Clock className="w-5 h-5" />}
                                    label="Volume"
                                    value={selectedClient.client.sensoryPreferences?.musicVolume || "Suave"}
                                />
                            </div>
                        </section>

                        {/* Technical Notes */}
                        <section>
                            <h3 className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Histórico Técnico
                            </h3>
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                                <p className="text-white/70 leading-relaxed font-serif italic whitespace-pre-wrap">
                                    {selectedClient.client.technicalNotes || "Sem registros anteriores para este procedimento."}
                                </p>
                            </div>
                        </section>
                    </motion.aside>
                ) : (
                    <aside className="w-[450px] bg-[#050505] border-l border-white/5 flex items-center justify-center p-12 text-center">
                        <div>
                            <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mx-auto mb-6 text-white/10">
                                <User className="w-8 h-8" />
                            </div>
                            <p className="text-white/20 font-serif italic text-xl">Selecione uma cliente para ver a Memory Lane.</p>
                        </div>
                    </aside>
                )}
            </AnimatePresence>
        </div>
    );
}

function PreferenceItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-primary mb-2 opacity-60">{icon}</div>
            <p className="text-[10px] uppercase text-white/30 mb-1">{label}</p>
            <p className="text-white font-serif">{value}</p>
        </div>
    );
}





