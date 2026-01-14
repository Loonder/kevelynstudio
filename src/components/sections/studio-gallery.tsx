"use client";

import Image from "next/image";

export function StudioGallery() {
    return (
        <section id="studio" className="py-32 bg-surface relative">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    {/* Text Content */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <span className="text-gold text-xs uppercase tracking-widest mb-4 block">O Espaço</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                            Refúgio de <br /> Exclusividade
                        </h2>
                        <div className="space-y-6 text-white/50 leading-relaxed">
                            <p>
                                Projetado para ser um oásis urbano. Cada detalhe do Kevelyn Studio
                                foi pensado para proporcionar relaxamento profundo.
                            </p>
                            <p>
                                Do aroma exclusivo que recebe você na entrada à iluminação
                                planejada para o máximo conforto visual.
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm group">
                            <Image
                                src="/assets/images/studio-interior.png"
                                alt="Kevelyn Studio Interior"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
