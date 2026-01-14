"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

export function BrandManifesto() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "start 0.2"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

    return (
        <section ref={containerRef} className="py-32 md:py-48 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center">

                    <motion.div style={{ opacity, y }} className="space-y-12">
                        <span className="inline-block text-primary text-xs tracking-[0.4em] uppercase font-semibold">
                            Filosofia
                        </span>

                        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-white/90">
                            "Não vendemos apenas estética. <br />
                            <span className="text-white/40">Entregamos</span> <span className="text-primary italic">autoestima</span> <br />
                            <span className="text-white/40">em sua forma mais </span> pura."
                        </h2>

                        <p className="text-white/60 font-light text-lg leading-relaxed max-w-2xl mx-auto">
                            Cada traço é calculado. Cada procedimento é uma assinatura.
                            No Kevelyn Studio, unimos a precisão técnica com uma experiência sensorial desenhada para
                            fazer você se sentir única desde o primeiro segundo.
                        </p>

                        <div className="h-20 w-[1px] bg-gradient-to-b from-primary to-transparent mx-auto mt-12" />
                    </motion.div>

                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
