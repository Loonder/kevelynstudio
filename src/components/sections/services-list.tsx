"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ServicesList() {
    const [hoveredService, setHoveredService] = useState<string | null>(null);

    // Get the active image (or use the first one as default if needed, or null)
    const activeImage = SERVICES.find(s => s.id === hoveredService)?.image;

    return (
        <section id="atendimento" className="relative py-32 bg-surface overflow-hidden min-h-screen flex items-center">

            {/* Background Image Reveal */}
            <AnimatePresence mode="wait">
                {activeImage && (
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 z-0 pointer-events-none"
                    >
                        {/* Fallback to gradient if activeImage is placeholder/missing */}
                        {!activeImage.includes('placeholder') ? (
                            <Image
                                src={activeImage}
                                alt="Service Preview"
                                fill
                                className="object-cover filter grayscale contrast-125"
                                sizes="100vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black" />
                        )}
                        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Header */}
                    <div className="lg:col-span-4">
                        <span className="text-gold text-xs uppercase tracking-widest mb-6 block">Nossos Procedimentos</span>
                        <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
                            Menu de <br /> <a className="text-white/30 italic">Experiências</a>
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-12">
                            Uma curadoria de técnicas de micropigmentação e design desenvolvidas
                            para mulheres que não negociam sua imagem.
                        </p>

                        <a href="/book" className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-colors">
                            Ver Menu Completo <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-8 flex flex-col">
                        {SERVICES.slice(0, 5).map((service, idx) => (
                            <motion.div
                                key={service.id}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative border-b border-white/10 py-10 cursor-pointer transition-colors hover:border-primary/50"
                            >
                                <div className="flex items-baseline justify-between relative z-10">
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs font-sans text-white/30 font-light hidden md:inline-block">
                                            0{idx + 1}
                                        </span>
                                        <h3 className={cn(
                                            "font-serif text-3xl md:text-5xl transition-all duration-500",
                                            hoveredService === service.id ? "text-gold translate-x-4" : "text-white"
                                        )}>
                                            {service.title}
                                        </h3>
                                    </div>

                                    <span className="text-white/40 font-light text-sm md:text-lg group-hover:text-white transition-colors">
                                        {service.price}
                                    </span>
                                </div>

                                <p className={cn(
                                    "mt-4 text-white/50 text-sm max-w-md ml-10 md:ml-12 transition-all duration-500",
                                    hoveredService === service.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 h-0 overflow-hidden"
                                )}>
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
