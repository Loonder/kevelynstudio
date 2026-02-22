"use client";

import { useBooking } from "@/context/booking-context";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createAppointment } from "@/actions/booking-actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function StepClientForm() {
    const { state, prevStep } = useBooking();
    const router = useRouter();

    const [formData, setFormData] = useState({
        phone: state.clientData.phone || "",
        birthDate: "",
    });

    const [clientInfo, setClientInfo] = useState<{
        name: string;
        email: string;
        clientId: string;
    } | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadClientData() {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    alert("Por favor, faça login para continuar.");
                    router.push("/login");
                    return;
                }

                // Fetch client data from database
                const response = await fetch(`/api/client/${user.id}`);
                if (response.ok) {
                    const client = await response.json();
                    setClientInfo({
                        name: client.fullName,
                        email: client.email,
                        clientId: client.id
                    });
                    setFormData(prev => ({
                        ...prev,
                        phone: client.phone || prev.phone
                    }));
                }
            } catch (error) {
                console.error("Error loading client data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadClientData();
    }, [router]);

    const handleSubmit = async () => {
        if (!state.service || !state.professional || !state.date || !state.timeSlot) {
            alert("Sessão expirada. Reinicie o agendamento.");
            return;
        }

        if (!clientInfo) {
            alert("Erro ao carregar dados do cliente.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createAppointment({
                serviceId: state.service.id,
                professionalId: state.professional.id,
                date: state.date,
                timeSlot: state.timeSlot,
                clientId: clientInfo.clientId,
                phone: formData.phone,
            });

            if (result.success) {
                alert("✨ Agendamento Confirmado! Esperamos por você.");
                router.push("/my-appointments");
            } else {
                alert("Erro ao agendar: " + result.error);
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <GlassCard className="p-12">
                    <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
                    </div>
                    <p className="text-white/50 mt-4">Carregando seus dados...</p>
                </GlassCard>
            </div>
        );
    }

    const isValid = formData.phone && clientInfo;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-white text-center mb-2">Finalizar Agendamento</h2>
            <p className="text-white/50 text-center mb-10">Confirme seus dados para reservarmos sua experiência.</p>

            <GlassCard className="space-y-6 p-8">
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-primary mb-4">Dados Pessoais</h3>

                    {/* Read-only Name */}
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Nome Completo</label>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 cursor-not-allowed">
                            {clientInfo?.name || "Carregando..."}
                        </div>
                    </div>

                    {/* Read-only Email */}
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">E-mail</label>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 cursor-not-allowed">
                            {clientInfo?.email || "Carregando..."}
                        </div>
                    </div>

                    {/* Editable Phone */}
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Telefone / WhatsApp *</label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    {/* Optional Birth Date */}
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Data de Nascimento (opcional)</label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors [color-scheme:dark]"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-4">
                        💡 <span className="text-white/60">Dica:</span> Você pode gerenciar suas preferências de música e bebidas no seu perfil.
                    </p>
                </div>

                <div className="pt-4 flex justify-between items-center">
                    <button onClick={prevStep} className="text-white/50 hover:text-white px-4 transition-colors">
                        Voltar
                    </button>
                    <button
                        disabled={!isValid || isSubmitting}
                        onClick={handleSubmit}
                        className="bg-primary text-black px-8 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? "Confirmando..." : "Confirmar e Agendar"} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}





