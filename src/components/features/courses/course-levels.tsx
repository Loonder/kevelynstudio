"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Level = "iniciante" | "intermediario" | "avancado";

interface CourseLevelsProps {
    levels: {
        id: Level;
        title: string;
        description: string;
        features: string[];
    }[];
}

export function CourseLevels({ levels }: CourseLevelsProps) {
    const [activeLevel, setActiveLevel] = useState<Level>("iniciante");

    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Jornada de Aprendizado</h2>
                    <p className="text-white/50">W escolha o nível ideal para o seu momento profissional.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/10 relative">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setActiveLevel(level.id)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10",
                                    activeLevel === level.id ? "text-black" : "text-white/60 hover:text-white"
                                )}
                            >
                                {activeLevel === level.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{level.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {levels.map((level) => (
                            level.id === activeLevel && (
                                <motion.div
                                    key={level.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-black/40 border border-white/5 rounded-2xl p-8 md:p-12 relative overflow-hidden"
                                >
                                    {/* Decorative Glow */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                        <div>
                                            <h3 className="text-2xl font-serif text-white mb-4">{level.title}</h3>
                                            <p className="text-white/60 leading-relaxed mb-8">
                                                {level.description}
                                            </p>

                                            <button className="text-primary hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-primary/30 pb-1 hover:border-white">
                                                Ver cronograma completo
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {level.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                                        <Check className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-white/80 font-light">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}





