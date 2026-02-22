
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markCommissionPaid } from "@/actions/finance-actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Commission {
    id: string;
    professionalName: string;
    amount: number;
    status: string | null;
    createdAt: Date | null;
    paidAt: Date | null;
}

export default function CommissionsClient({ initialCommissions }: { initialCommissions: Commission[] }) {

    const handlePay = async (id: string) => {
        if (!confirm("Confirmar pagamento desta comissão?")) return;

        try {
            const res = await markCommissionPaid(id);
            if (res.success) {
                toast.success("Comissão paga!");
                window.location.reload();
            } else {
                toast.error("Erro ao atualizar.");
            }
        } catch (e) {
            toast.error("Erro de conexão.");
        }
    };

    return (
        <div className="border border-white/10 bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider text-xs bg-white/5">
                        <th className="p-4 font-normal">Profissional</th>
                        <th className="p-4 font-normal">Valor</th>
                        <th className="p-4 font-normal">Data</th>
                        <th className="p-4 font-normal">Status</th>
                        <th className="p-4 font-normal text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {initialCommissions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-white/30">Nenhuma comissão encontrada.</td>
                        </tr>
                    ) : (
                        initialCommissions.map(c => (
                            <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-white font-medium">{c.professionalName}</td>
                                <td className="p-4 text-primary font-mono">{formatCurrency(c.amount)}</td>
                                <td className="p-4 text-white/60">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${c.status === 'paid' ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {c.status === 'paid' ? 'Pago' : 'Pendente'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {c.status === 'pending' && (
                                        <Button
                                            onClick={() => handlePay(c.id)}
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10 text-white/60 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/10"
                                        >
                                            Pagar
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}





