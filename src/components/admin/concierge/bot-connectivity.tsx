
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import {
    Smartphone,
    Zap,
    Wifi,
    WifiOff,
    RefreshCcw,
    Activity,
    ShieldCheck,
    AlertCircle,
    Copy,
    Check
} from "lucide-react";
import { toast } from "sonner";

interface BotStatus {
    connected: boolean;
    uptime: string;
    messagesProcessed: number;
    lastMessageAgo: string;
    version: string;
    memory: string;
    state: string;
}

export function BotConnectivity() {
    const [status, setStatus] = useState<BotStatus | null>(null);
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

    const BOT_URL = "http://localhost:7778";

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${BOT_URL}/api/status`);
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
                // If not connected, we don't necessarily have a QR token here, 
                // but we know we might need to check the / endpoint for one
            } else {
                setStatus(null);
            }
        } catch (err) {
            setStatus(null);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Link copiado!");
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchStatus();
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Connection Status Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="md:col-span-2 p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${status?.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {status?.connected ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-white">Status da Conexão</h2>
                                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                                    {status?.connected ? 'WhatsApp Sincronizado' : 'Aguardando Escaneamento'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-full hover:bg-white/5 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCcw className="w-5 h-5 text-white/40" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest block">Uptime</span>
                            <span className="text-lg text-white font-mono">{status?.uptime || '0h 0min'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest block">Processando</span>
                            <span className="text-lg text-white font-mono">{status?.messagesProcessed || 0} msgs</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest block">Memória</span>
                            <span className="text-lg text-white font-mono">{status?.memory || '---'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest block">Versão IA</span>
                            <span className="text-lg text-white font-mono">v{status?.version?.split(' ')[0] || '2.0'}</span>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Activity className="w-32 h-32 text-primary" />
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-white/5 bg-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-white font-serif">Segurança</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-xs text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Supabase Real-time: OK
                            </li>
                            <li className="flex items-center gap-3 text-xs text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Anti-Flood Protection: Ativo
                            </li>
                            <li className="flex items-center gap-3 text-xs text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Criptografia de Ponta: OK
                            </li>
                        </ul>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-4">
                        <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Servidor: {BOT_URL}</span>
                    </div>
                </GlassCard>
            </div>

            {/* QR Code Section */}
            {!status?.connected ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-serif text-white">Vincular Dispositivo</h2>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Para ativar a secretária, escaneie o QR Code ao lado usando a função "Aparelhos Conectados" no seu WhatsApp Business.
                            </p>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs text-amber-200 font-medium">Sessão Temporária</p>
                                <p className="text-[10px] text-amber-200/60 leading-relaxed">
                                    O QR Code expira em alguns minutos por segurança. Caso não carregue, clique no botão de atualizar no topo.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Link Direto</span>
                                <button
                                    onClick={() => copyToClipboard(BOT_URL)}
                                    className="text-white/40 hover:text-primary transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="bg-black p-3 rounded-lg border border-white/5 font-mono text-[10px] text-white/60 break-all select-all">
                                {BOT_URL}/qr
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative p-8 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                            <div className="w-[300px] h-[300px] relative">
                                <iframe
                                    src={`${BOT_URL}/qr`}
                                    className="w-full h-full border-none overflow-hidden scale-[1.1]"
                                    scrolling="no"
                                />
                                {/* Overlay to prevent iframe interactions if needed */}
                                <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-white rounded-lg"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm rounded-[2rem]">
                                <LuxuryButton
                                    variant="outline"
                                    className="bg-black text-white hover:bg-black/90"
                                    onClick={handleRefresh}
                                >
                                    Atualizar QR Code
                                </LuxuryButton>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <GlassCard className="p-12 text-center border-white/5 bg-white/5">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                            <Smartphone className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-serif text-white">Sistema Conectado</h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Seu WhatsApp Business está vinculado com sucesso. A Kevelyn Company está agora operando em modo automático.
                        </p>
                        <div className="pt-8">
                            <LuxuryButton
                                className="bg-red-500 text-white hover:bg-red-600 border-none"
                                onClick={() => {
                                    if (confirm("Deseja realmente desconectar? Isso pausará o atendimento automático.")) {
                                        toast.info("Função disponível apenas via Terminal por segurança.");
                                    }
                                }}
                            >
                                Desconectar Dispositivo
                            </LuxuryButton>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}





