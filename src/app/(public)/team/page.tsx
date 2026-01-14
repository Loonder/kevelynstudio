import { db } from "@/lib/db";
import { professionals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Footer } from "@/components/layout/footer";
import { NavBar } from "@/components/layout/nav-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    // Fetch active professionals
    const team = await db.query.professionals.findMany({
        where: eq(professionals.isActive, true)
    });

    return (
        <>
            <NavBar />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <div className="container mx-auto text-center relative z-10">
                        <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Artistas & Especialistas</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Nosso Time
                        </h1>
                        <p className="text-white/50 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            Conheça as profissionais responsáveis por transformar olhares e elevar a autoestima.
                            Excelência técnica e sensibilidade artística em cada detalhe.
                        </p>
                    </div>
                </section>

                {/* Team Grid */}
                <section className="container mx-auto px-6 pb-32">
                    {team.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/30 italic">Em breve, nossa equipe estará aqui.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((pro, index) => (
                                <GlassCard
                                    key={pro.id}
                                    className="group overflow-hidden relative flex flex-col items-center text-center p-0 border-white/5 hover:border-primary/30 transition-all duration-500"
                                >
                                    {/* Image Container */}
                                    <div className="w-full aspect-[3/4] relative overflow-hidden bg-white/5">
                                        {pro.imageUrl ? (
                                            <Image
                                                src={pro.imageUrl}
                                                alt={pro.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-0 group-hover:saturate-100"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-serif">
                                                {pro.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                        {/* Overlay Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-primary text-xs uppercase tracking-widest mb-2 font-medium">{pro.role}</p>
                                            <h2 className="text-3xl font-serif text-white mb-4">{pro.name}</h2>

                                            {/* Social & Bio (Revealed on Hover) */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 space-y-4">
                                                <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                                                    {pro.bio || "Especialista em beleza e estética avançada, dedicada a realçar sua beleza natural."}
                                                </p>

                                                {pro.instagramHandle && (
                                                    <a
                                                        href={`https://instagram.com/${pro.instagramHandle.replace('@', '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors text-xs uppercase tracking-wider"
                                                    >
                                                        <Instagram className="w-4 h-4" />
                                                        {pro.instagramHandle}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link href="/book" className="w-full bg-white/5 hover:bg-primary hover:text-black text-white/50 hover:text-black py-4 text-xs uppercase tracking-widest transition-colors font-medium border-t border-white/5">
                                        Agendar com {pro.name.split(' ')[0]}
                                    </Link>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
