"use client";

import React from 'react';
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Sparkles, ScrollText } from "lucide-react";

const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;
const MotionH1 = motion.h1 as any;
const MotionSpan = motion.span as any;
const MotionP = motion.p as any;

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto max-w-4xl relative">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 space-y-4"
                >
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <ScrollText className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-[0.3em] font-sans">Conduta Elite</span>
                    </div>
                    <MotionH1
                        className="font-serif text-5xl md:text-7xl text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Termos de <br />
                        <MotionSpan className="italic text-primary font-light">Compromisso</MotionSpan>
                    </MotionH1>
                </MotionDiv>

                <GlassCard className="border-white/5 bg-white/5 p-12 space-y-12">
                    <div className="prose prose-invert prose-lg max-w-none text-white/70 font-light space-y-12">
                        <MotionSection
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-xl leading-relaxed italic border-l-2 border-primary/30 pl-8 py-2">
                                Bem-vinda à Kevelyn Company. Ao acessar nosso santuário digital e utilizar nossos serviços,
                                você concorda com os termos de excelência, pontualidade e respeito mútuo descritos abaixo.
                            </p>
                        </MotionSection>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-white">
                                <Sparkles className="w-6 h-6 text-primary" />
                                <h3 className="text-2xl font-serif">1. Agendamentos e Exclusividade</h3>
                            </div>
                            <p className="pl-10">
                                Para garantir a exclusividade e a qualidade inquestionável do atendimento, solicitamos que cancelamentos ou
                                reagendamentos sejam comunicados com, no mínimo, 24 horas de antecedência. A ausência sem aviso prévio
                                compromete a curadoria de nossa agenda VIP.
                            </p>
                        </section>

                        <section className="space-y-6 border-t border-white/5 pt-12">
                            <div className="flex items-center gap-4 text-white">
                                <Shield className="w-6 h-6 text-primary" />
                                <h3 className="text-2xl font-serif">2. Propriedade e Direitos Autorais</h3>
                            </div>
                            <p className="pl-10">
                                Todo o ecossistema visual da Kevelyn Company — incluindo imagens editoriais, textos acadêmicos e design de interface —
                                é protegido por leis de propriedade intelectual. O uso não autorizado de nossa identidade de marca é proibido.
                            </p>
                        </section>

                        <section className="space-y-6 border-t border-white/5 pt-12">
                            <h3 className="text-2xl font-serif text-white">3. A Alquimia do Resultado</h3>
                            <p>
                                Nos dedicamos a oferecer resultados de estética avançada baseados em técnica cirúrgica e sensibilidade artística.
                                Embora busquemos a perfeição em cada aplicação, os resultados finais podem variar de acordo com
                                a fisiologia individual de cada cliente.
                            </p>
                        </section>

                        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-sm text-white/30 uppercase tracking-widest">
                                Versão 2.1 • Atualizado em Fevereiro de 2026
                            </p>
                            <div className="text-primary text-[10px] tracking-tighter uppercase font-bold border border-primary/20 px-4 py-2">
                                Protocolo de Segurança Ativo
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}





