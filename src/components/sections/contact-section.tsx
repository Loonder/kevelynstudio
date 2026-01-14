
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { MapPin, Clock, MessageCircle, Mail, Sparkles } from "lucide-react";
import Image from "next/image";

export function ContactSection() {
    return (
        <section id="contato" className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* Left: Content (5 cols) */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-4 animate-in slide-in-from-left duration-700">
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-12 bg-primary/50" />
                                <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">Concierge</span>
                            </div>
                            <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">
                                Experiência <br />
                                <span className="italic text-white/70">Presencial</span>
                            </h2>
                            <p className="text-white/40 text-lg font-light leading-relaxed max-w-md border-l border-white/10 pl-6 py-2">
                                Um refúgio urbano desenhado para elevar sua autoestima e proporcionar momentos de puro relaxamento.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Hours Card */}
                            <GlassCard className="p-0 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-stretch">
                                    <div className="w-16 bg-white/5 flex items-center justify-center border-r border-white/5 group-hover:bg-primary/10 transition-colors">
                                        <Clock className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-serif text-xl mb-2">Horários</h3>
                                        <div className="space-y-1">
                                            <p className="text-white/60 text-sm">Segunda a Sexta — <span className="text-white">09h às 20h</span></p>
                                            <p className="text-white/60 text-sm">Sábado — <span className="text-white">09h às 16h</span></p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Location Card */}
                            <GlassCard className="p-0 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-stretch">
                                    <div className="w-16 bg-white/5 flex items-center justify-center border-r border-white/5 group-hover:bg-primary/10 transition-colors">
                                        <MapPin className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-serif text-xl mb-2">Localização</h3>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            Av. Paulista, 1000 — Bela Vista<br />
                                            <span className="text-white/30 text-xs uppercase tracking-wider mt-1 block">Estacionamento Conveniado com Valet</span>
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="flex-1">
                                <LuxuryButton className="w-full flex items-center justify-center gap-2 group">
                                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Agendar via WhatsApp
                                </LuxuryButton>
                            </a>
                            <a href="mailto:contato@kevelynstudio.com" className="flex-1">
                                <button className="w-full py-4 border border-white/10 rounded-sm text-white/60 hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Concierge
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* Right: Immersive Visuals (7 cols) */}
                    <div className="lg:col-span-7 relative h-[600px] lg:h-[700px] animate-in slide-in-from-right duration-1000 delay-200">
                        {/* Main Image */}
                        <div className="absolute inset-0 bg-white/5 rounded-sm overflow-hidden border border-white/5 group">
                            {/* Placeholder for Studio Interior - Using a dark abstract gradient fallback if image fails, or generic luxury interior */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505]" />
                            {/* 
                                NOTE: Replace logic below with actual image when available.
                                Using colors/gradients to verify layout first.
                             */}
                            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105" />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                            {/* Floating Details */}
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="backdrop-blur-md bg-black/40 border border-white/10 p-8 rounded-sm">
                                    <Sparkles className="w-6 h-6 text-primary mb-4" />
                                    <p className="text-white text-lg font-light italic leading-relaxed">
                                        "Mais do que um procedimento estético, oferecemos uma pausa na sua rotina.<br /> Um momento para se reconectar com sua melhor versão."
                                    </p>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="w-12 h-[1px] bg-white/20" />
                                        <span className="text-white/40 text-xs uppercase tracking-widest">Kevelyn Studio Experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decoration Elements */}
                        <div className="absolute -top-8 -right-8 w-64 h-64 border border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/5 rounded-full" />
                    </div>

                </div>
            </div>
        </section>
    );
}
