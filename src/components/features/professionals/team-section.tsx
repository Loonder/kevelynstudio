"use client";

import { PROFESSIONALS } from "@/lib/data-professionals";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TeamSection() {
    return (
        <section id="profissionais" className="py-32 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-primary text-xs uppercase tracking-widest block mb-4">Nossa Equipe</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white">Artistas da <br /> Excelência</h2>
                    </div>
                    <p className="text-white/50 max-w-md text-sm leading-relaxed">
                        Profissionais selecionadas e treinadas rigorosamente sob a metodologia Kevelyn Company.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {PROFESSIONALS.map((prof, i) => (
                        <div key={prof.id} className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505]">
                                {prof.image && !prof.image.includes("placeholder") ? (
                                    <Image
                                        src={prof.image}
                                        alt={prof.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_100%,_#D4AF37,_transparent_60%)]" />
                                        <h3 className="text-9xl font-serif text-white/5 font-bold select-none group-hover:text-primary/10 transition-colors duration-700">
                                            {prof.name.charAt(0)}
                                        </h3>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="font-serif text-3xl text-white mb-1">{prof.name}</h3>
                                    <p className="text-primary text-xs uppercase tracking-widest mb-6">{prof.role}</p>

                                    <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {prof.specialties.slice(0, 2).map(s => (
                                            <span key={s} className="text-[10px] text-white/70 border border-white/20 px-2 py-1 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={`/team/${prof.id}`} className="flex items-center gap-2 text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:text-primary">
                                        Ver Perfil Completo <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}





