import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ServiceSheet } from "@/components/admin/services/service-sheet";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { ServiceActions } from "@/components/admin/services/service-actions"; // Client component for actions

export default async function ServicesPage() {
    const allServices = await db.query.services.findMany({
        orderBy: (services, { desc }) => [desc(services.createdAt)]
    });

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2">Menu de Serviços</h1>
                    <p className="text-white/50 text-sm font-light">
                        Gerencie os procedimentos e valores do estúdio.
                    </p>
                </div>

                <ServiceSheet
                    trigger={
                        <LuxuryButton className="bg-[#D4AF37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Serviço
                        </LuxuryButton>
                    }
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allServices.map((service) => (
                    <GlassCard key={service.id} className="p-6 flex flex-col gap-4 group hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-sm">
                                    {service.category}
                                </span>
                                <h3 className="text-xl font-serif text-white mt-3 group-hover:text-[#D4AF37] transition-colors">
                                    {service.title}
                                </h3>
                            </div>
                            <ServiceActions service={service} />
                        </div>

                        <p className="text-white/40 text-sm line-clamp-2 h-10">
                            {service.description || "Sem descrição."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center text-white/60 text-xs">
                                <Clock className="w-3 h-3 mr-1.5" />
                                {service.durationMinutes} min
                            </div>
                            <span className="text-lg font-medium text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price / 100)}
                            </span>
                        </div>
                    </GlassCard>
                ))}

                {allServices.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/30 border border-dashed border-white/10 rounded-xl">
                        <p>Nenhum serviço cadastrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
