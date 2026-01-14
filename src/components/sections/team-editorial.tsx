"use client";

import { PROFESSIONALS } from "@/lib/data-professionals";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function TeamEditorial() {
    return (
        <section className="py-32 bg-black overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Editorial Header */}
                <div className="text-center mb-24 relative">
                    <h2 className="font-serif text-[10vw] leading-[0.8] text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-0 select-none">
                        THE ARTISTS
                    </h2>
                    <div className="relative z-10">
                        <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">Master Team</span>
                        <h3 className="font-serif text-4xl md:text-6xl text-white">
                            Padrão Internacional
                        </h3>
                    </div>
                </div>

                {/* Editorial Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

                    {/* Highlight Profile (Kevelyn?) - Mocking first pro as featured */}
                    {PROFESSIONALS.slice(0, 1).map((prof) => (
                        <div key={prof.id} className="lg:col-span-7 relative group cursor-pointer">
                            <div className="aspect-[3/4] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out">
                                {prof.image && !prof.image.includes('placeholder') ? (
                                    <Image
                                        src={prof.image}
                                        alt={prof.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={prof.image.includes('reveal-portrait.jpg')}
                                    />
                                ) : (
                                    // Abstract Placeholder
                                    <div className="w-full h-full bg-gradient-to-b from-[#111] to-black relative">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#333_0%,_transparent_60%)]" />
                                        <div className="absolute bottom-0 left-0 p-12">
                                            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                                                <span className="font-serif text-4xl text-white/20 italic">K</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Overlay Info */}
                            <div className="absolute bottom-10 -right-10 bg-surface border border-white/5 p-8 max-w-sm shadow-2xl z-10 hidden md:block">
                                <h4 className="font-serif text-3xl text-white mb-2">{prof.name}</h4>
                                <p className="text-primary text-xs uppercase tracking-widest mb-4">{prof.role}</p>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    "Minha missão é revelar a versão mais poderosa de cada mulher através de um olhar desenhado com alma."
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Secondary List */}
                    <div className="lg:col-span-5 flex flex-col gap-12 mt-12 lg:mt-32">
                        {PROFESSIONALS.slice(1).map((prof) => (
                            <div key={prof.id} className="flex gap-6 items-center group cursor-pointer">
                                <div className="w-24 h-32 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0">
                                    {prof.image && !prof.image.includes('placeholder') ? (
                                        <Image src={prof.image} alt={prof.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                                    ) : (
                                        <div className="w-full h-full bg-[#111]" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-serif text-2xl text-white group-hover:text-primary transition-colors">{prof.name}</h4>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{prof.role}</p>
                                    <div className="flex gap-2">
                                        {prof.specialties.map(s => (
                                            <span key={s} className="text-[10px] text-white/40 border border-white/10 px-2 py-1 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 border-t border-white/10 pt-8">
                            <p className="text-white/40 text-sm mb-4">
                                Deseja fazer parte desta equipe ou aprender nossa metodologia?
                            </p>
                            <a href="/courses" className="text-gold text-xs uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-colors">
                                Conheça a Academy
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
