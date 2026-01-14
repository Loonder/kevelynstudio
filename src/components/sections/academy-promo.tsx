"use client";

import { LuxuryButton } from "@/components/ui/luxury-button";
import Image from "next/image";

export function AcademyPromo() {
    return (
        <section id="cursos" className="relative py-32 overflow-hidden flex items-center">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[#080808]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="order-2 lg:order-1 relative">
                        {/* Abstract / Artistic Composition */}
                        <div className="relative w-full aspect-[4/5] md:aspect-square bg-white/5 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay z-10" />
                            <Image
                                src="/assets/images/hero-eye.png" // Reusing high-quality asset for now
                                alt="Academy Student Work"
                                fill
                                className="object-cover opacity-80"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />

                            {/* Floating Elements */}
                            <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-white/10 p-6 max-w-xs z-20">
                                <p className="text-primary text-xs uppercase tracking-widest mb-2">Kevelyn Academy</p>
                                <p className="text-white font-serif text-xl">
                                    "Transformei minha carreira aprendendo a técnica Flow Brows."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 text-center lg:text-left">
                        <span className="text-gold text-xs uppercase tracking-widest mb-4 block">Education</span>
                        <h2 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-[0.9]">
                            Domine a <br /> <i className="text-white/30">Técnica</i>
                        </h2>
                        <p className="text-white/50 leading-relaxed text-lg max-w-md mx-auto lg:mx-0 mb-10">
                            Não formamos apenas profissionais, formamos artistas.
                            Aprenda a metodologia exclusiva Kevelyn Studio e eleve seu faturamento.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
                            <LuxuryButton href="/courses">Explorar Cursos</LuxuryButton>
                            <button className="text-white/50 text-xs uppercase tracking-widest hover:text-white transition-colors">
                                Baixar E-book Gratuito
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
