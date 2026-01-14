"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClient } from "@/actions/client-actions";
import { SensoryProfileCard } from "@/components/admin/clients/sensory-profile-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ArrowLeft, User, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await getClient(id);
            if (res.success) {
                setClient(res.data);
            }
            setIsLoading(false);
        }
        load();
    }, [id]);

    if (isLoading) return <div className="p-10 text-white">Carregando perfil...</div>;
    if (!client) return <div className="p-10 text-white">Cliente não encontrado.</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <Link href="/admin/clients" className="flex items-center text-white/50 hover:text-[#D4AF37] transition-colors mb-4 w-fit text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Lista
                    </Link>
                    <h1 className="text-4xl font-serif text-white">{client.fullName}</h1>
                    <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                        <span>{client.email}</span>
                        <span>•</span>
                        <span>{client.phone}</span>
                    </div>
                </div>
                <Link href={`/admin/clients/edit/${id}`}>
                    <LuxuryButton className="bg-white/5 hover:bg-white/10 border-white/10">
                        <Edit className="w-4 h-4 mr-2" /> Editar Perfil
                    </LuxuryButton>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Notes */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] mb-4">Métricas</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Total de Visitas</span>
                                <span className="text-2xl font-serif text-white">{client.totalVisits}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Última Visita</span>
                                <span className="text-white">
                                    {client.lastVisit ? format(new Date(client.lastVisit), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white/60">Cliente desde</span>
                                <span className="text-white">
                                    {format(new Date(client.createdAt), "MMM yyyy", { locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4">Notas Técnicas</h3>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                            {client.notes || "Nenhuma observação registrada."}
                        </p>
                    </div>
                </div>

                {/* Right Column: Sensory & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* SENSORY CARD */}
                    <SensoryProfileCard preferences={client.sensoryPreferences} />

                    {/* Timeline Placeholder */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[200px]">
                        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6">Histórico de Procedimentos</h3>
                        <div className="flex flex-col items-center justify-center h-40 text-white/30 text-sm italic border-2 border-dashed border-white/5 rounded-lg">
                            Em breve: Histórico detalhado com fotos.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
