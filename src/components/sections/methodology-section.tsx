"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import Image from "next/image";

interface MethodologyStep {
    id: number;
    title: string;
    description: string;
    order: number;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface MethodologySectionProps {
    steps: MethodologyStep[];
}

export function MethodologySection({ steps }: MethodologySectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Filter active steps and sort by order
    const activeSteps = steps
        .filter(step => step.active === true)
        .sort((a, b) => a.order - b.order);

    return (
        <section className="py-24 bg-black relative border-y border-white/5" ref={containerRef}>
            <div className="container mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Content Timeline */}
                    <div className="relative">
                        <div className="mb-16">
                            <span className="text-gold text-[10px] uppercase tracking-[0.2em] mb-3 block">The Kevelyn Method</span>
                            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
                                Assinatura <br /> Técnica
                            </h2>
                            <p className="text-white/50 leading-relaxed max-w-sm">
                                Nossa metodologia exclusiva garante resultados hiper-realistas e saudáveis.
                            </p>
                        </div>

                        <div className="relative pl-8 md:pl-10 border-l border-white/10 ml-3">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-transparent">
                                <motion.div
                                    style={{ height: lineHeight }}
                                    className="w-full bg-primary shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                                />
                            </div>

                            <div className="space-y-16">
                                {activeSteps.length === 0 ? (
                                    <p className="text-white/30 italic">Nenhuma metodologia disponível no momento.</p>
                                ) : (
                                    activeSteps.map((step, i) => (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
                                            className="relative group"
                                        >
                                            {/* Dot Indicator */}
                                            <div className={cn(
                                                "absolute -left-[45px] md:-left-[47px] top-2 w-3 h-3 rounded-full border-2 border-black bg-white/20 transition-all duration-500",
                                                "group-hover:bg-gold group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                            )} />

                                            <span className="text-4xl font-serif text-white/5 group-hover:text-primary/20 transition-colors duration-500 select-none absolute -top-10 -left-6 z-0">
                                                {String(step.order).padStart(2, '0')}
                                            </span>

                                            <div className="relative z-10">
                                                <h3 className="text-xl text-white font-serif mb-3 group-hover:text-primary transition-colors duration-300">
                                                    {step.title}
                                                </h3>
                                                <p className="text-white/40 text-sm leading-relaxed max-w-md">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Visuals */}
                    <div className="relative hidden lg:block h-full">
                        <div className="sticky top-32">
                            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden border border-white/10 group">
                                <Image
                                    src="/assets/images/methodology-visagism.png"
                                    alt="Visagismo Mapping"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                {/* Overlay Stats/Info */}
                                <div className="absolute bottom-6 left-6 right-6 border-t border-white/20 pt-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-primary text-xs uppercase tracking-widest mb-1">Tecnologia</p>
                                            <p className="text-white font-serif text-lg">Mapeamento Facial</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/40 text-xs">Precisão</p>
                                            <p className="text-white font-sans">0.1mm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
