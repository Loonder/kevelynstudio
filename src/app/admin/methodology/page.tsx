import { getMethodologySteps } from "@/actions/cms-actions";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface MethodologyStep {
    id: number;
    title: string;
    description: string;
    order: number;
    active: boolean;
}

export default async function MethodologyManagerPage() {
    const steps: MethodologyStep[] = await getMethodologySteps();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-white">Metodologia</h2>
                    <p className="text-white/40 mt-1">Gerencie os passos da "Assinatura Técnica".</p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Novo Passo
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Ordem</th>
                            <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Título</th>
                            <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Descrição</th>
                            <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {steps.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-white/30">
                                    Nenhum passo cadastrado. Adicione o primeiro.
                                </td>
                            </tr>
                        ) : (
                            steps.map((step) => (
                                <tr key={step.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 text-white/50 font-mono text-sm">
                                        {String(step.order).padStart(2, '0')}
                                    </td>
                                    <td className="p-4 text-white font-serif text-lg">
                                        {step.title}
                                    </td>
                                    <td className="p-4 text-white/60 text-sm max-w-md truncate">
                                        {step.description}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}





