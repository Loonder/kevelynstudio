"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Check, Star, Play, Clock, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface SalesPageProps {
    course: {
        id: string;
        title: string;
        description: string | null;
        price: number;
        thumbnail: string | null;
    };
}

export function SalesPage({ course }: SalesPageProps) {
    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceInCents / 100);
    };

    return (
        <main className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Copy */}
                <div className="space-y-8 animate-in slide-in-from-left duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-primary text-xs uppercase tracking-widest font-bold">Best Seller</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">
                        {course.title}
                    </h1>

                    <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                        {course.description || "Domine as técnicas mais avançadas do mercado e transforme sua carreira com este curso exclusivo Kevelyn Studio."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-primary text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            Comprar por {formatPrice(course.price)}
                        </button>
                        <Link href="/contact" className="px-8 py-4 rounded-full border border-white/20 text-white font-medium uppercase tracking-wider hover:bg-white/5 transition-colors text-center">
                            Falar com Suporte
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-white font-serif text-xl">10h</span>
                            </div>
                            <p className="text-white/30 text-xs uppercase">Conteúdo</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Play className="w-4 h-4 text-primary" />
                                <span className="text-white font-serif text-xl">25</span>
                            </div>
                            <p className="text-white/30 text-xs uppercase">Aulas</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-primary" />
                                <span className="text-white font-serif text-xl">Sim</span>
                            </div>
                            <p className="text-white/30 text-xs uppercase">Certificado</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="relative animate-in slide-in-from-right duration-700 delay-200">
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opactiy-60" />
                        {course.thumbnail ? (
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                <span className="text-white/20 font-serif text-4xl italic">Capa do Curso</span>
                            </div>
                        )}

                        <div className="absolute bottom-8 left-8 right-8 z-20">
                            <GlassCard className="p-6">
                                <h3 className="text-white font-serif mb-4">O que você vai aprender:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Técnicas Avançadas de Mapping",
                                        "Colorimetria Aplicada",
                                        "Marketing para Profissionais",
                                        "Fidelização de Clientes"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
