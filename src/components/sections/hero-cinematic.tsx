"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function HeroCinematic() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">

            {/* 1. Cinematic Background (Image Reveal) */}
            <div className="absolute inset-0 z-0 select-none">
                {/* High-End Editorial Image */}
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/assets/images/hero-eye.png"
                            alt="Kevelyn Studio Detail"
                            fill
                            className="object-cover opacity-60"
                            priority
                            sizes="100vw"
                        />
                    </div>
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                {/* Subtle Gold Dust Animation */}
                <div className="absolute inset-0 opacity-[0.10] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* 2. Editorial Typography (The Statement) */}
            <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center h-full text-center">

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                >
                    <span className="text-gold text-xs md:text-sm font-sans uppercase tracking-[0.5em] mb-8 font-semibold">
                        Est. 2024 • São Paulo
                    </span>

                    {/* The Giant "Vogue" Title */}
                    <h1 className="font-serif text-[12vw] leading-[0.85] text-white tracking-tight mix-blend-exclusion opacity-90">
                        KEVELYN<br />STUDIO
                    </h1>

                    <div className="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="h-[1px] w-12 bg-white/20 hidden md:block" />
                        <p className="max-w-md text-white/50 font-light text-sm md:text-base leading-relaxed text-center md:text-left">
                            A beleza não é apenas visual, é <strong className="text-white font-serif font-normal">poder</strong>. <br />
                            Especialistas em design de olhar e micropigmentação de alta performance.
                        </p>
                        <Link href="/book" className="group relative px-8 py-3 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-primary hover:border-primary">
                            <span className="relative z-10 text-xs uppercase tracking-widest text-white group-hover:text-black transition-colors font-semibold">Agendar Experience</span>
                        </Link>
                    </div>
                </motion.div>

            </div>

            {/* 3. Footer / Scroll */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 w-full flex justify-between px-12 text-white/20 text-[10px] uppercase tracking-widest"
            >
                <span>© 2026 Kevelyn Studio</span>
                <span className="flex items-center gap-2 animate-bounce">Scroll <ArrowDown className="w-3 h-3" /></span>
                <span>Exclusive Beauty</span>
            </motion.div>
        </section>
    );
}
