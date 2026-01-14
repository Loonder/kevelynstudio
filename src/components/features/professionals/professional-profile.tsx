"use client";

import { Professional } from "@/lib/data-professionals";
import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import { InstagramFeed } from "@/components/features/social/instagram-feed";

export function ProfessionalProfile({ professional }: { professional: Professional }) {
    return (
        <section className="min-h-screen bg-background py-24 md:py-32">
            <div className="container mx-auto px-6">
                <GlassCard className="max-w-5xl mx-auto overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Image Side */}
                        <div className="relative aspect-[3/4] md:aspect-auto h-full min-h-[500px] rounded-xl overflow-hidden">
                            <Image
                                src={professional.image}
                                alt={professional.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <h2 className="text-4xl font-serif text-white">{professional.name}</h2>
                                <p className="text-primary text-sm uppercase tracking-widest">{professional.role}</p>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="flex flex-col justify-center py-6">
                            <div className="mb-8">
                                <h3 className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">Sobre a Profissional</h3>
                                <p className="text-white/70 text-lg font-light leading-relaxed">
                                    {professional.bio}
                                </p>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">Especialidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {professional.specialties.map(spec => (
                                        <span key={spec} className="px-4 py-2 border border-white/10 rounded-full text-white/60 text-xs uppercase tracking-wider">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-[1px] bg-white/5 mb-8" />

                            {/* Instagram Integration */}
                            <InstagramFeed handle={professional.instagram} />
                        </div>

                    </div>
                </GlassCard>
            </div>
        </section>
    );
}
