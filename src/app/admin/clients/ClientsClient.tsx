
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Search, Filter, MoreHorizontal, User, MessageSquare } from "lucide-react";

interface Lead {
    id: string;
    phone: string;
    name: string;
    status: string;
    created_at: string;
    tags?: string[];
}

interface ClientsClientProps {
    initialLeads: Lead[];
}

export default function ClientsClient({ initialLeads }: ClientsClientProps) {
    return (
        <div className="p-8 space-y-8 bg-black min-h-full">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        {...({
                            initial: { opacity: 0, x: -20 },
                            animate: { opacity: 1, x: 0 }
                        } as any)}
                        className="text-4xl font-serif text-white mb-2"
                    >
                        Registro <span className="text-primary italic">Sensorial</span>
                    </motion.h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Base de Clientes & Leads</p>
                </div>
            </div>

            <GlassCard className="border-white/5 bg-white/5">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10">
                        <tr>
                            <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-widest">Cliente</th>
                            <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-widest">Data</th>
                            <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {initialLeads.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-white/30">Nenhum registro encontrado.</td></tr>
                        ) : (
                            initialLeads.map((lead, i) => (
                                <motion.tr
                                    key={lead.id || lead.phone}
                                    {...({
                                        initial: { opacity: 0, y: 10 },
                                        animate: { opacity: 1, y: 0 },
                                        transition: { delay: i * 0.01 }
                                    } as any)}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif">
                                                {lead.name?.charAt(0) || <User className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{lead.name || "Desconhecido"}</div>
                                                <div className="text-white/40 text-xs">{lead.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider
                                            ${lead.status === 'lead' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}
                                        `}>
                                            {lead.status || 'Novo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/40 text-sm">
                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <a
                                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full hover:bg-emerald-500/10 text-white/40 hover:text-emerald-500 transition-colors"
                                                title="Mandar WhatsApp"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </a>
                                            <button className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}





