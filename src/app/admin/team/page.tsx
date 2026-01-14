import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import { db } from "@/lib/db";
import { professionals } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Plus, Instagram, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    const allPros = await db.select().from(professionals).orderBy(desc(professionals.createdAt));

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Equipe & Profissionais</h2>
                    <p className="text-white/50">Quem faz a mágica acontecer.</p>
                </div>

                <Link href="/admin/team/new" className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors">
                    <Plus className="w-4 h-4" /> Novo Profissional
                </Link>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {allPros.length === 0 ? (
                    <div className="md:col-span-2 text-center py-12 border border-dashed border-white/10 rounded-lg">
                        <p className="text-white/30 mb-4">Nenhum profissional cadastrado.</p>
                        <Link href="/admin/team/new" className="text-primary hover:underline">Cadastrar o primeiro</Link>
                    </div>
                ) : (
                    allPros.map(pro => (
                        <GlassCard key={pro.id} className="p-6 relative overflow-hidden group">
                            <div className="flex items-start gap-4 z-10 relative">
                                {/* Avatar Placeholder */}
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                                    {pro.imageUrl ? (
                                        <Image
                                            src={pro.imageUrl}
                                            alt={pro.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-serif text-white/30">{pro.name.charAt(0)}</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl text-white font-serif">{pro.name}</h3>
                                    <p className="text-primary text-sm uppercase tracking-wide mb-2">{pro.role}</p>

                                    {pro.instagramHandle && (
                                        <a href={`https://instagram.com/${pro.instagramHandle}`} target="_blank" className="flex items-center gap-1 text-white/40 hover:text-white text-xs transition-colors">
                                            <Instagram className="w-3 h-3" /> @{pro.instagramHandle}
                                        </a>
                                    )}
                                </div>

                                <button className="text-white/30 hover:text-white">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Indicator */}
                            <div className="absolute top-4 right-4">
                                <span className={`w-2 h-2 rounded-full block ${pro.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
}
