
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Brain,
    Save,
    MessageCircle,
    User,
    MapPin,
    CreditCard,
    HelpCircle,
    Plus,
    Trash2,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface BotConfig {
    bot: { name: string; tone: string };
    professional: {
        name: string;
        title: string;
        address: string;
        pixKey: string;
        pixName: string;
        pixCity: string;
    };
    faq: Array<{ question: string; answer: string }>;
}

export function BotConfigEditor() {
    const [config, setConfig] = useState<BotConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const BOT_URL = "http://localhost:7778";

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${BOT_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch (err) {
                toast.error("Erro ao carregar configurações da IA.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${BOT_URL}/api/settings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            if (res.ok) {
                toast.success("Inteligência atualizada com sucesso!");
            } else {
                toast.error("Erro ao salvar configurações.");
            }
        } catch (err) {
            toast.error("Falha na comunicação com o servidor do Bot.");
        } finally {
            setIsSaving(false);
        }
    };

    const addFAQ = () => {
        if (!config) return;
        setConfig({
            ...config,
            faq: [...config.faq, { question: "", answer: "" }]
        });
    };

    const removeFAQ = (index: number) => {
        if (!config) return;
        const newFaq = [...config.faq];
        newFaq.splice(index, 1);
        setConfig({ ...config, faq: newFaq });
    };

    const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
        if (!config) return;
        const newFaq = [...config.faq];
        newFaq[index][field] = value;
        setConfig({ ...config, faq: newFaq });
    };

    if (isLoading) return (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    if (!config) return null;

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Brain className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-white">Base de Conhecimento</h2>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Configure o cérebro da sua secretária IA</p>
                    </div>
                </div>
                <LuxuryButton
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="bg-primary text-black hover:bg-primary/90"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Tudo
                </LuxuryButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bot Personality */}
                <GlassCard className="p-8 border-white/5 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-serif text-lg">Personalidade</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Nome da IA</label>
                            <Input
                                value={config.bot.name}
                                onChange={(e) => setConfig({ ...config, bot: { ...config.bot, name: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Tom de Voz</label>
                            <Input
                                value={config.bot.tone}
                                onChange={(e) => setConfig({ ...config, bot: { ...config.bot, tone: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                                placeholder="Ex: Elegante, Amigável, Profissional"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Professional Info */}
                <GlassCard className="p-8 border-white/5 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-serif text-lg">Perfil do Estúdio</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Nome Principal</label>
                            <Input
                                value={config.professional.name}
                                onChange={(e) => setConfig({ ...config, professional: { ...config.professional, name: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Cargo/Título</label>
                            <Input
                                value={config.professional.title}
                                onChange={(e) => setConfig({ ...config, professional: { ...config.professional, title: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Endereço Completo</label>
                        <Input
                            value={config.professional.address}
                            onChange={(e) => setConfig({ ...config, professional: { ...config.professional, address: e.target.value } })}
                            className="bg-white/5 border-white/10 text-white focus:border-primary"
                        />
                    </div>
                </GlassCard>

                {/* PIX Settings */}
                <GlassCard className="p-8 border-white/5 space-y-6 lg:col-span-2">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-serif text-lg">Dados Financeiros (PIX)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Chave PIX</label>
                            <Input
                                value={config.professional.pixKey}
                                onChange={(e) => setConfig({ ...config, professional: { ...config.professional, pixKey: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Nome do Beneficiário</label>
                            <Input
                                value={config.professional.pixName}
                                onChange={(e) => setConfig({ ...config, professional: { ...config.professional, pixName: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Cidade</label>
                            <Input
                                value={config.professional.pixCity}
                                onChange={(e) => setConfig({ ...config, professional: { ...config.professional, pixCity: e.target.value } })}
                                className="bg-white/5 border-white/10 text-white focus:border-primary"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* FAQ / Knowledge Base */}
                <GlassCard className="p-8 border-white/5 space-y-8 lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <h3 className="text-white font-serif text-lg">Perguntas Frequentes (FAQ)</h3>
                        </div>
                        <button
                            onClick={addFAQ}
                            className="text-[10px] uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-3 h-3" /> Adicionar Pergunta
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.faq.map((item, index) => (
                            <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 relative group">
                                <button
                                    onClick={() => removeFAQ(index)}
                                    className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/20">Pergunta</label>
                                    <Input
                                        value={item.question}
                                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                        className="bg-transparent border-white/10 text-white text-sm focus:border-primary"
                                        placeholder="Ex: Qual o valor do frete?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/20">Resposta da IA</label>
                                    <Textarea
                                        value={item.answer}
                                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                        className="bg-transparent border-white/10 text-white text-sm focus:border-primary min-h-[100px]"
                                        placeholder="Resposta detalhada que o robô deve dar..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}





