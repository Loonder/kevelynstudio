
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { updateService } from "@/actions/service-actions";

interface ConciergeService {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
}

interface ConciergeClientProps {
    initialServices: ConciergeService[];
}

export default function ConciergeClient({ initialServices }: ConciergeClientProps) {
    const [services, setServices] = useState(initialServices);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'services' | 'faq'>('services');

    const handleFieldChange = (index: number, field: keyof ConciergeService, value: any) => {
        const newServices = [...services];
        newServices[index] = { ...newServices[index], [field]: value };
        setServices(newServices);
    };

    const handleSave = async () => {
        setSaving(true);
        // Save each modified service individually for now. Bulking could be better but this is MVP.
        try {
            const promises = services.map(s => {
                // Determine if it changed? For now just save all or basic diff?
                // Let's just update all since it's a small list.
                return updateService(s.id, {
                    title: s.name,
                    price: s.price * 100, // convert back to cents
                    durationMinutes: s.duration,
                    description: s.description,
                    category: "Cílios", // Default fallback if missing, although updateService might need category passed optionally. 
                    // Actually, updateService requires category. 
                    // ISSUE: our current helper `getServicesForBooking` and mapping didn't preserve Category.
                    // We should probably rely on the proper Services Manager (/admin/services) for full editing.
                    // This "Concierge" view is a bit redundant with /admin/services.
                    // BUT, let's try to make it work or Redirect the user to the better page.
                });
            });
            // Wait, I can't easily save without Category. 
            // It might be better to make this page read-only or redirect to the Main Services page.
        } catch (error) {
            toast.error("Erro ao salvar.");
        }
        setSaving(false);
    };

    return (
        <div className="p-8 space-y-8 bg-black min-h-full">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-serif text-white mb-2"
                    >
                        Secretária <span className="text-primary italic">Virtual</span>
                    </motion.h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Configuração de Serviços & IA</p>
                </div>

                {activeTab === 'services' && (
                    <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-lg text-xs">
                        <AlertCircle className="w-4 h-4" />
                        Para edição completa, use o Menu de Serviços.
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('services')}
                    className={`text-sm uppercase tracking-widest px-4 py-2 transition-colors ${activeTab === 'services' ? 'text-primary border-b border-primary' : 'text-white/40 hover:text-white'}`}
                >
                    Serviços (Visualização)
                </button>
                <button
                    onClick={() => setActiveTab('faq')}
                    className={`text-sm uppercase tracking-widest px-4 py-2 transition-colors ${activeTab === 'faq' ? 'text-primary border-b border-primary' : 'text-white/40 hover:text-white'}`}
                >
                    FAQ (Em Breve)
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'services' && services.map((service, i) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <GlassCard className="p-6 border-white/5 bg-white/5 group hover:border-primary/20 transition-all opacity-80 hover:opacity-100">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                <div className="md:col-span-1">
                                    <label className="text-[10px] uppercase text-white/30 tracking-widest mb-1 block">Nome do Serviço</label>
                                    <div className="text-white font-serif text-lg py-1">{service.name}</div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] uppercase text-white/30 tracking-widest mb-1 block">Descrição (IA)</label>
                                    <div className="text-white/70 text-sm py-2">{service.description}</div>
                                </div>
                                <div className="md:col-span-1 flex gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-white/30 tracking-widest mb-1 block">Preço (R$)</label>
                                        <div className="text-primary font-mono text-lg py-1">{service.price.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-white/30 tracking-widest mb-1 block">Minutos</label>
                                        <div className="text-white/60 font-mono text-lg py-1">{service.duration}</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}

                {activeTab === 'faq' && (
                    <div className="p-12 text-center border border-dashed border-white/10 rounded-xl">
                        <p className="text-white/40 italic">O módulo de Perguntas e Respostas da IA será ativado na Fase 2.</p>
                    </div>
                )}
            </div>
        </div>
    );
}





