"use client";

import { useBooking } from "@/context/booking-context";
import { getProfessionalsForBooking } from "@/actions/professional-actions";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

export function StepProfessional() {
    const { state, setProfessional, nextStep, prevStep } = useBooking();
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfessionalsForBooking().then(data => {
            setProfessionals(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white text-center py-12">Carregando equipe...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-white text-center mb-2">Quem cuidará de você?</h2>
            <p className="text-white/50 text-center mb-10">Escolha a especialista para o seu procedimento.</p>

            <div className="grid md:grid-cols-2 gap-6">
                {professionals.map((prof) => {
                    const isSelected = state.professional?.id === prof.id;

                    return (
                        <GlassCard
                            key={prof.id}
                            className={cn(
                                "relative overflow-hidden cursor-pointer transition-all duration-500 group border-2",
                                isSelected
                                    ? "border-primary bg-white/5"
                                    : "border-transparent hover:border-white/20"
                            )}
                            onClick={() => {
                                setProfessional(prof);
                                // Optional: auto advance? Let's leave manual for clearer confirmation
                            }}
                        >
                            <div className="flex items-center gap-6 p-6">
                                {/* Editorial Avatar */}
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-zinc-800">
                                    {prof.imageUrl ? (
                                        <Image
                                            src={prof.imageUrl}
                                            alt={prof.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-serif text-white/30">{prof.name.charAt(0)}</span>
                                    )}
                                </div>

                                <div>
                                    <h3 className={cn(
                                        "font-serif text-2xl mb-1 transition-colors",
                                        isSelected ? "text-primary" : "text-white"
                                    )}>
                                        {prof.name}
                                    </h3>
                                    <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
                                        {prof.role}
                                    </p>

                                    {/* Mini-bio mockup (since not in data yet, we improvise or assume data has it) */}
                                    {/* Ideally we update data-professionals.ts to include bio. using static for now */}
                                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                        Especialista em visagismo e naturalidade com mais de 5 anos de experiência.
                                    </p>
                                </div>
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn(
                                "absolute bottom-0 left-0 w-full h-1 bg-primary transition-transform duration-300 origin-left",
                                isSelected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 opacity-50"
                            )} />
                        </GlassCard>
                    );
                })}
            </div>

            <div className="mt-12 flex justify-between items-center">
                <button onClick={prevStep} className="text-white/50 hover:text-white px-4 transition-colors">
                    Voltar
                </button>
                <button
                    disabled={!state.professional}
                    onClick={nextStep}
                    className="bg-white text-black px-8 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    Continuar <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}





