"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpRight, Sparkles, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Slot {
    start: string;
    location: string;
}

const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            console.warn("Received non-JSON response from:", url);
            return { slots: [] }; // Fallback
        }
    } catch (err) {
        console.warn("Fetch error:", err);
        return { slots: [] }; // Fallback
    }
};

export default function BookingWidget() {
    const { data, error, isLoading } = useSWR<{ slots: Slot[] }>(
        "http://localhost:7778/api/public/slots",
        fetcher
    );

    const handleBook = (slot: Slot) => {
        const date = new Date(slot.start);
        const dateStr = format(date, "dd/MM", { locale: ptBR });
        const timeStr = format(date, "HH:mm");
        const message = `Olá, desejo reservar o horário VIP de ${timeStr} no dia ${dateStr} em ${slot.location}.`;
        const whatsappUrl = `https://wa.me/5511967422133?text=${encodeURIComponent(
            message
        )}`;
        window.open(whatsappUrl, "_blank");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    const LoadingSkeleton = () => (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide opacity-40">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[180px] h-[160px] rounded-xl border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                        <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full relative">
            {/* Ambient Lighting Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 z-0"></div>

            <div className="relative z-10 p-8 md:p-12 rounded-3xl overflow-hidden glass border border-white/10 shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-white/10 pb-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] tracking-editorial uppercase">
                                <Sparkles className="w-3 h-3" />
                                <span>VIP Concierge</span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-title">
                                Agende Sua Experiência
                            </h2>
                            <p className="text-white/50 text-sm font-light max-w-md">
                                Selecione um dos horários nobres disponíveis ou entre em contato com nosso concierge para solicitações especiais.
                            </p>
                        </div>
                        <a
                            href="https://wa.me/5511967422133"
                            target="_blank"
                            className="group flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-editorial transition-all"
                        >
                            <span>Falar com Concierge</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : error || !data?.slots || data.slots.length === 0 ? (
                        <motion.div
                            {...({
                                initial: { opacity: 0, scale: 0.95 },
                                animate: { opacity: 1, scale: 1 }
                            } as any)}
                            className="py-16 text-center"
                        >
                            <CalendarHeart className="w-12 h-12 text-white/20 mx-auto mb-6" />
                            <p className="text-white/70 text-lg font-serif italic mb-2">
                                "A exclusividade requer paciência."
                            </p>
                            <p className="text-white/40 text-sm font-light mb-8">
                                Nossa agenda encontra-se temporariamente completa. Novas vagas são abertas pontualmente.
                            </p>
                            <Button
                                variant="outline"
                                className="bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs h-14 px-10 rounded-none transition-all"
                                onClick={() =>
                                    window.open(
                                        "https://wa.me/5511967422133?text=Gostaria de entrar na lista de espera VIP.",
                                        "_blank"
                                    )
                                }
                            >
                                Entrar na Lista de Espera VIP
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary text-[10px] tracking-widest uppercase mb-2 ml-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Alta Demanda: Poucos horários disponíveis
                            </div>
                            <motion.div
                                {...({
                                    variants: containerVariants,
                                    initial: "hidden",
                                    animate: "show"
                                } as any)}
                                className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x pt-2"
                            >
                                {data.slots.slice(0, 6).map((slot, i) => {
                                    const date = new Date(slot.start);
                                    return (
                                        <motion.div
                                            key={i}
                                            {...({
                                                variants: itemVariants,
                                            } as any)}
                                            onClick={() => handleBook(slot)}
                                            className="snap-start min-w-[180px] group cursor-pointer relative overflow-hidden rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl"></div>
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <ArrowUpRight className="w-4 h-4 text-white" />
                                            </div>

                                            <div className="p-6 h-full flex flex-col justify-between min-h-[160px]">
                                                <div className="space-y-1 relative z-10">
                                                    <span className="text-white/40 text-[10px] uppercase tracking-widest block group-hover:text-white/60 transition-colors">
                                                        {format(date, "MMM", { locale: ptBR })}
                                                    </span>
                                                    <span className="text-white/90 text-sm font-light block">
                                                        {format(date, "EEEE", { locale: ptBR })}
                                                    </span>
                                                    <span className="text-white/40 text-xs block pt-1">
                                                        Dia {format(date, "dd")}
                                                    </span>
                                                </div>

                                                <div className="mt-8 relative z-10">
                                                    <div className="font-serif text-4xl text-white group-hover:text-primary transition-colors duration-500">
                                                        {format(date, "HH:mm")}
                                                    </div>
                                                    <span className="text-white/30 text-[9px] tracking-editorial block pt-2 group-hover:text-white/50 transition-colors">
                                                        {slot.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}





