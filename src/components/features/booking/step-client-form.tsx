"use client";

import { useBooking } from "@/context/booking-context";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { createAppointment } from "@/actions/booking-actions";
import { useRouter } from "next/navigation";

export function StepClientForm() {
    const { state, setClientData, setSensory, prevStep } = useBooking();
    const router = useRouter();

    // Local state for form handling before submitting to context
    const [formData, setFormData] = useState({
        name: state.clientData.name,
        email: state.clientData.email,
        phone: state.clientData.phone,
        birthDate: "",
        music: state.sensory.musicGenre,
        drink: state.sensory.drink
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!state.service || !state.professional || !state.date || !state.timeSlot) {
            alert("Sessão expirada. Reinicie o agendamento.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createAppointment({
                serviceId: state.service.id,
                professionalId: state.professional.id,
                date: state.date,
                timeSlot: state.timeSlot,
                client: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                sensory: {
                    musicGenre: formData.music,
                    drink: formData.drink
                }
            });

            if (result.success) {
                alert("✨ Agendamento Confirmado! Esperamos por você.");
                router.push("/");
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

    const isValid = formData.name && formData.email && formData.phone;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-white text-center mb-2">Finalizar Agendamento</h2>
            <p className="text-white/50 text-center mb-10">Preencha seus dados para confirmarmos sua experiência.</p>

            <GlassCard className="space-y-6 p-8">
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-primary mb-4">Dados Pessoais</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            placeholder="Nome Completo"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <input
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            placeholder="Telefone / WhatsApp"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            placeholder="E-mail"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors [color-scheme:dark]"
                            placeholder="Data de Nascimento"
                            type="date"
                            value={formData.birthDate || ''}
                            onChange={(e) => handleChange('birthDate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-8">
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-primary mb-6">Qual será a trilha sonora do seu momento?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['Pop', 'Jazz', 'Bossa Nova', 'Classic', 'Nature', 'Lounge'].map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => handleChange('music', style)}
                                    className={cn(
                                        "p-3 rounded-xl border text-sm transition-all",
                                        formData.music === style
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                    )}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-primary mb-6">O que deseja beber ao chegar?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['Water', 'Coffee', 'Champagne', 'Tea', 'None'].map((drink) => (
                                <button
                                    key={drink}
                                    type="button"
                                    onClick={() => handleChange('drink', drink)}
                                    className={cn(
                                        "p-3 rounded-xl border text-sm transition-all",
                                        formData.drink === drink
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                    )}
                                >
                                    {drink === 'Water' ? 'Água' : drink === 'Coffee' ? 'Café' : drink === 'Champagne' ? 'Espumante' : drink === 'Tea' ? 'Chá' : 'Nenhuma'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-between items-center">
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
