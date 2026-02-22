
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, Play, BookOpen, Users, Trophy } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

const CURRICULUM = [
    {
        title: "Módulo 1: A Ciência do Fio",
        content: "Anatomia profunda, ciclos de crescimento e patologias oculares. O alicerce técnico para uma profissional de elite.",
        icon: <BookOpen className="w-5 h-5" />
    },
    {
        title: "Módulo 2: Visagismo Analítico",
        content: "Como mapear o olhar baseado na estrutura óssea e personalidade da cliente. Criando designs exclusivos e irreplicáveis.",
        icon: <Users className="w-5 h-5" />
    },
    {
        title: "Módulo 3: Engenharia de Acoplagem",
        content: "Técnicas avançadas de retenção e isolamento milimétrico. A arte de fazer o impossível durar semanas.",
        icon: <Play className="w-5 h-5" />
    },
    {
        title: "Módulo 4: Business de Luxo",
        content: "Posicionamento premium, precificação estratégica e como atrair clientes de alto poder aquisitivo.",
        icon: <Trophy className="w-5 h-5" />
    }
];

export const AcademyDeepDive = () => {
    const [activeModule, setActiveModule] = useState<number | null>(0);

    return (
        <section id="academy" className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

                    {/* Left Side: Editorial Content */}
                    <div className="space-y-12">
                        <motion.div
                            {...({
                                initial: { opacity: 0, x: -50 },
                                whileInView: { opacity: 1, x: 0 },
                                transition: { duration: 0.8 }
                            } as any)}
                        >
                            <span className="text-primary text-xs uppercase tracking-[0.4em] mb-6 block">K. Academy</span>
                            <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1]">
                                Domine a <br />
                                <span className="italic text-primary font-light">Alquimia do Olhar</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            {...({
                                initial: { opacity: 0 },
                                whileInView: { opacity: 1 },
                                transition: { duration: 0.8, delay: 0.2 }
                            } as any)}
                            className="text-xl text-white/50 font-light leading-relaxed max-w-xl"
                        >
                            Não ensinamos apenas extensões. Ensinamos como construir uma carreira de prestígio baseada em técnica cirúrgica e atendimento de concierge.
                        </motion.p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-white/80">
                            <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-colors">
                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <p className="font-serif text-lg mb-1">Certificação Master</p>
                                    <p className="text-white/40 text-sm">Válida internacionalmente para atuação em alto padrão.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-colors">
                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <p className="font-serif text-lg mb-1">Mentoria Direta</p>
                                    <p className="text-white/40 text-sm">Acesso vitalício à comunidade e suporte da Kevelyn.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flex items-center gap-2 text-primary text-[10px] tracking-widest uppercase mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-red-400 font-bold">Turmas 2026 Esgotadas</span>
                            </div>

                            <Button className="btn-premium py-8 px-12 bg-white text-black rounded-none hover:bg-primary hover:text-white transition-all duration-500 uppercase tracking-[0.2em] text-xs">
                                <a href="https://wa.me/5511967422133?text=Quero entrar na lista de espera da Academy" target="_blank">
                                    Aplicar para Lista de Espera VIP
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: Editorial Image Replacement */}
                    <motion.div
                        {...({
                            initial: { opacity: 0, scale: 0.9 },
                            whileInView: { opacity: 1, scale: 1 },
                            transition: { duration: 1 }
                        } as any)}
                        className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <Image
                            src="/images/course-cta.jpg"
                            alt="Academy Experience"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover image-grade-cinematic"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};





