
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./button";
import { Sparkles, Clock, ArrowRight, ShieldCheck, Heart } from "lucide-react";

interface Service {
    id: string | number;
    title: string;
    description: string | null;
    price: number;
    durationMinutes: number;
    category: string;
    imageUrl?: string | null;
}

interface ServicesClientProps {
    allServices: Service[];
}

const CATEGORY_META: Record<string, { image: string, tagline: string }> = {
    "Cílios": {
        image: "/images/services/lashes-elite.png",
        tagline: "O olhar que comanda o ambiente."
    },
    "Sobrancelhas": {
        image: "/images/services/brows-elite.png",
        tagline: "A arquitetura suprema da expressão."
    }
};

export function ServicesClient({ allServices }: ServicesClientProps) {
    // Normalização defensiva no frontend
    const sanitizedServices = allServices.filter(s =>
        s.category !== "Lábios" &&
        !s.title.toLowerCase().includes("lábio")
    ).map(s => {
        let normalizedCategory = s.category;
        const catLower = s.category.toLowerCase();

        if (catLower.includes('lash')) normalizedCategory = "Cílios";
        else if (catLower.includes('brow')) normalizedCategory = "Sobrancelhas";

        return {
            ...s,
            category: normalizedCategory
        };
    });

    const categories = Array.from(new Set(sanitizedServices.map(s => s.category)));
    const [activeCategory, setActiveCategory] = useState(categories[0] || "Cílios");

    const filteredServices = sanitizedServices.filter(s => s.category === activeCategory);

    return (
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 min-h-screen">

            {/* Left Side: Category Navigation (Sticky) */}
            <aside className="w-full lg:w-1/3 lg:h-screen lg:sticky lg:top-0 bg-[#050505] p-12 flex flex-col justify-between border-r border-white/5 z-20">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="text-primary text-[10px] tracking-[0.5em] uppercase">Private Menu</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight italic font-light">
                            Seleção de <br />
                            <span className="not-italic font-normal">Alta Performance</span>
                        </h2>
                    </div>

                    <nav className="flex flex-col gap-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-left transition-all duration-500 group flex items-center gap-4 ${activeCategory === cat ? "text-white" : "text-white/30 hover:text-white/60"
                                    }`}
                            >
                                <span className={`h-px transition-all duration-700 ${activeCategory === cat ? "w-12 bg-primary" : "w-0 bg-white/20 group-hover:w-6"
                                    }`} />
                                <span className="font-serif text-2xl tracking-tight">{cat}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="pt-12 border-t border-white/5 hidden lg:block">
                    <div className="flex items-center gap-3 text-white/20 text-[10px] uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Reserva Garantida & Segura</span>
                    </div>
                </div>
            </aside>

            {/* Right Side: Services Flow */}
            <main className="flex-1 bg-black p-6 lg:p-20 pt-16 lg:pt-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        {...({
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 },
                            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                        } as any)}
                        className="space-y-24"
                    >
                        {/* Category Hero Image */}
                        <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <Image
                                src={CATEGORY_META[activeCategory]?.image || "/images/services/lashes-elite.png"}
                                alt={activeCategory}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-[3s] grayscale hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute bottom-8 left-8 space-y-2">
                                <span className="text-primary text-xs italic font-serif">{CATEGORY_META[activeCategory]?.tagline}</span>
                                <h3 className="text-white text-4xl font-serif uppercase tracking-tighter">{activeCategory}</h3>
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="grid grid-cols-1 gap-12 max-w-4xl">
                            {filteredServices.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    {...({
                                        initial: { opacity: 0, y: 30 },
                                        animate: { opacity: 1, y: 0 },
                                        transition: { delay: index * 0.1 }
                                    } as any)}
                                    className="group relative flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-neutral-900/40 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-700"
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-primary text-[10px] uppercase tracking-widest tabular-nums opacity-60">
                                                Elite Service {index + 1}
                                            </span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <h4 className="text-3xl font-serif text-white group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h4>
                                        <p className="text-white/40 font-light leading-relaxed max-w-xl text-lg">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center gap-6 pt-2">
                                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                <span>{service.durationMinutes} minutos</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                <span>Signature Technique</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-8 w-full md:w-auto pt-10 md:pt-0 min-w-[200px]">
                                        <div className="text-right">
                                            <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] block mb-1">Investimento</span>
                                            <span className="text-4xl font-serif text-white tracking-tighter">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price / 100)}
                                            </span>
                                        </div>
                                        <Button
                                            className="bg-white text-black hover:bg-primary hover:text-white transition-all rounded-full px-10 h-14 uppercase tracking-widest text-xs font-bold border-none"
                                            asChild
                                        >
                                            <a
                                                href={`https://wa.me/5511967422133?text=Olá, gostaria de reservar uma experiência exclusiva de ${service.title}`}
                                                target="_blank"
                                            >
                                                Reservar Agora
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Hover Micro-Animation Decoration */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <Heart className="w-5 h-5 text-primary/40" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Exclusive Footer Note */}
                        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                            <p className="text-xs uppercase tracking-widest max-w-xs text-center md:text-left">
                                Todos os procedimentos são precedidos por uma consultoria visagista exclusiva.
                            </p>
                            <span className="text-primary font-serif italic text-sm">Kevelyn Signature</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}






