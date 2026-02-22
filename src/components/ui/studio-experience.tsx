
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { GlassCard } from "./glass-card";
import { Coffee, Music, Shield, Star } from "lucide-react";

const AMENITIES = [
    { icon: <Coffee className="w-5 h-5 text-primary" />, title: "Concierge VIP", desc: "Serviço de champagne e café gourmet cortesia." },
    { icon: <Music className="w-5 h-5 text-primary" />, title: "Som Curado", desc: "Paisagens sonoras ambientais para desconexão total." },
    { icon: <Shield className="w-5 h-5 text-primary" />, title: "Privacidade", desc: "Suítes individuais com isolamento acústico." },
    { icon: <Star className="w-5 h-5 text-primary" />, title: "Design", desc: "Mármore nero e iluminação circadiana." },
];

export const StudioExperience = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const xLeft = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const xRight = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="py-32 bg-[#020202] overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* Visual Side: Parallax Image Grid */}
                    <div className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center">
                        <motion.div
                            {...({
                                style: { x: xLeft },
                                className: "absolute left-0 top-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/5 z-20"
                            } as any)}
                        >
                            <Image src="/images/generated/luxury_studio_1769449402673.png" alt="Studio Corner 1" fill sizes="256px" className="object-cover" />
                        </motion.div>

                        <motion.div
                            {...({
                                className: "w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            } as any)}
                        >
                            <Image src="/images/generated/luxury_studio_1769449402673.png" alt="Main Studio View" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </motion.div>

                        <motion.div
                            {...({
                                style: { x: xRight },
                                className: "absolute right-0 bottom-0 w-72 h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/5 z-20"
                            } as any)}
                        >
                            <Image src="/images/generated/luxury_studio_1769449402673.png" alt="Studio Detail" fill sizes="288px" className="object-cover" />
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-12">
                        <div className="space-y-6">
                            <span className="text-primary text-xs uppercase tracking-[0.4em] block">The Ambiance</span>
                            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight">
                                Um Santuário para a <br />
                                <span className="italic text-primary font-light">Mulher Poderosa</span>
                            </h2>
                            <p className="text-white/50 text-xl font-light leading-relaxed max-w-xl">
                                Cada detalhe do nosso espaço foi meticulosamente planejado para ser o intervalo de silêncio e sofisticação que a sua rotina exige.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {AMENITIES.map((item, i) => (
                                <GlassCard key={i} className="p-6 border-white/5 hover:border-primary/20 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-lg mb-1">{item.title}</h4>
                                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>

                        <div className="pt-8">
                            <button className="flex items-center gap-6 group">
                                <span className="h-px w-24 bg-primary/40 group-hover:w-32 transition-all duration-500" />
                                <span className="text-white font-serif italic text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                                    Explorar Galeria Imersiva
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Background Narrative (Ghostly) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
                <span className="text-[30vw] font-black text-white whitespace-nowrap">STUDIO EXPERIENCE</span>
            </div>
        </section>
    );
};





