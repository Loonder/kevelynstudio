
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Users, MessageSquare, CreditCard, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface DashboardProps {
    initialStats: {
        activeClients: number;
        recentLeads: Array<{
            name: string;
            phone: string;
            status: string;
            created_at: string;
        }>;
        revenue: string;
        conversionRate: string;
    }
}

interface BotStatus {
    connected: boolean;
    uptime: string;
    messagesProcessed: number;
    lastMessageAgo: string;
    version: string;
}

export default function DashboardClient({ initialStats }: DashboardProps) {
    const [status, setStatus] = useState<BotStatus | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("http://localhost:7778/api/status");
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                } else {
                    setStatus({ connected: false, uptime: 'Offline', messagesProcessed: 0, lastMessageAgo: '-', version: '-' });
                }
            } catch {
                setStatus({ connected: false, uptime: 'Offline', messagesProcessed: 0, lastMessageAgo: '-', version: '-' });
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: "Clientes Ativos", value: initialStats.activeClients.toLocaleString(), icon: Users, color: "text-blue-400" },
        { label: "Mensagens (Bot)", value: status?.messagesProcessed ? status.messagesProcessed.toLocaleString() : "0", icon: MessageSquare, color: "text-primary" },
        { label: "Taxa de Conversão", value: initialStats.conversionRate, icon: Zap, color: "text-amber-400" },
        { label: "Receita (Mês)", value: initialStats.revenue, icon: CreditCard, color: "text-emerald-400" },
    ];

    return (
        <div className="p-8 space-y-12 bg-black min-h-full">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-serif text-white mb-2"
                    >
                        Centro de <span className="text-primary italic">Comando</span>
                    </motion.h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Operações Kevelyn Company</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${status?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] uppercase tracking-widest text-white/60">
                        {status?.connected ? 'Sistema Ativo' : 'Sistema Offline'}
                    </span>
                    <span className="text-[10px] text-white/20 border-l border-white/10 pl-4">
                        v{status?.version || '2.0.1'}
                    </span>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <stat.icon className={`w-5 h-5 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                <span className="text-[10px] text-white/20 uppercase tracking-widest">Ao Vivo</span>
                            </div>
                            <div className="text-3xl font-serif text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Middle Section: Activity & Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bot Health & Activity */}
                <GlassCard className="lg:col-span-2 p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-5 h-5 text-primary" />
                        <h2 className="font-serif text-xl text-white">Atividade da Secretária</h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-sm text-white/60">Uptime do Servidor</span>
                            <span className="text-sm text-white font-mono">{status?.uptime || '---'}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-sm text-white/60">Última Mensagem</span>
                            <span className="text-sm text-white/80">{status?.lastMessageAgo || 'Nenhuma'}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-sm text-white/60">Integridade Supabase</span>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-medium">Sincronizado</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-8">
                        <Sparkles className="w-20 h-20 text-primary opacity-[0.03] rotate-12" />
                    </div>
                </GlassCard>

                {/* Recent Leads Pipeline */}
                <GlassCard className="p-8 border-white/5 bg-white/5 relative flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h2 className="font-serif text-xl text-white">Novos Leads</h2>
                        </div>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest">Tempo Real</span>
                    </div>

                    <div className="space-y-4 flex-1 overflow-auto max-h-[400px] scrollbar-hide">
                        {initialStats.recentLeads.length > 0 ? (
                            initialStats.recentLeads.map((lead, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
                                    title="Clique para iniciar conversa no WhatsApp"
                                    className="flex items-center gap-4 p-3 border border-white/5 bg-white/5 rounded-lg hover:border-primary/30 transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-lg">
                                        {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium truncate group-hover:text-primary transition-colors">
                                            {lead.name || lead.phone}
                                        </div>
                                        <div className="text-[10px] text-white/30 uppercase tracking-wider">
                                            {lead.status} • {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-white/20 text-xs uppercase tracking-widest mb-2">Monitorando tráfego...</div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: [-100, 200] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-8">
                <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 bg-primary/10 border border-primary/20 text-primary flex items-center justify-between group hover:bg-primary/20 transition-all rounded-xl shadow-xl hover:shadow-primary/20 text-left"
                >
                    <div className="space-y-1">
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold block opacity-60 font-sans">Marketing</span>
                        <span className="text-lg font-serif">Lançar Campanha</span>
                    </div>
                    <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                </motion.button>

                <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 bg-white/5 border border-white/10 text-white flex items-center justify-between group hover:border-primary/50 transition-all rounded-xl text-left"
                >
                    <div className="space-y-1">
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold block opacity-40 font-sans">Financeiro</span>
                        <span className="text-lg font-serif">Fluxo de Caixa</span>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 bg-white/5 border border-white/10 text-white flex items-center justify-between group hover:border-primary/50 transition-all rounded-xl text-left"
                >
                    <div className="space-y-1">
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold block opacity-40 font-sans">Sistema</span>
                        <span className="text-lg font-serif">Ajustes da IA</span>
                    </div>
                </motion.button>
            </div>
        </div>
    );
}





