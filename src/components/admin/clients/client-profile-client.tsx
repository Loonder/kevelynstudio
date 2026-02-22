
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ClientProfileProps {
    client: any; // Type properly with schema inference ideally
}

export default function ClientProfileClient({ client }: ClientProfileProps) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="h-20 border-b border-white/10 flex items-center px-6 justify-between bg-surface">
                <div className="flex items-center gap-4">
                    <Link href="/admin/clients" className="text-white/50 hover:text-white transition-colors">← Voltar</Link>
                    <div className="h-8 w-px bg-white/10" />
                    <h1 className="font-serif text-2xl text-white">{client.fullName}</h1>
                    <span className="px-2 py-0.5 border border-primary text-primary text-[10px] uppercase tracking-widest">{client.role}</span>
                </div>
                <Button variant="ghost" className="text-primary hover:text-white">Editar Perfil</Button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Sensory & Bio */}
                <div className="space-y-8">
                    {/* Sensory Card */}
                    <div className="bg-gradient-to-br from-white/5 to-black border border-primary/20 p-6 relative overflow-hidden group rounded-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-50 transition-opacity">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                        <h2 className="text-primary font-serif text-xl mb-6">Perfil Sensorial</h2>

                        <div className="space-y-4">
                            {/* Safe access to nested optional properties */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Bebida</span>
                                <span className="text-white font-medium">{client.sensoryPreferences?.drinkPreference || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Temperatura</span>
                                <span className="text-white font-medium">{client.sensoryPreferences?.temperature || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Música</span>
                                <span className="text-white font-medium">{client.sensoryPreferences?.favoriteMusic || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Engajamento</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-3xl text-white font-serif">{client.totalVisits || 0}</div>
                                <div className="text-[10px] text-white/40 uppercase">Visitas</div>
                            </div>
                            <div>
                                {/* Placeholder LTV calculation logic */}
                                <div className="text-3xl text-white font-serif">-</div>
                                <div className="text-[10px] text-white/40 uppercase">LTV</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Technical History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-serif text-xl text-white">Histórico Técnico</h2>
                        <Button variant="outline" size="sm" className="border-white/10 text-white/60">+ Nota</Button>
                    </div>

                    <div className="space-y-4">
                        {(!client.history || client.history.length === 0) ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-white/30">
                                Nenhum histórico de atendimento.
                            </div>
                        ) : (
                            client.history.map((record: any, i: number) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 hover:border-primary/30 transition-colors rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-medium">{record.service?.title || 'Serviço Removido'}</h4>
                                        <span className="text-white/40 text-sm">{new Date(record.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-white/60 text-sm mb-2">Profissional: <span className="text-white">{record.professional?.name}</span></p>
                                    <p className="text-white/70 text-sm leading-relaxed border-l-2 border-primary/20 pl-4">{record.notes || 'Sem observações.'}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}





