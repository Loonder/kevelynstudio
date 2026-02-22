"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService, deleteService, ServiceInput } from "@/actions/service-actions";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface ServiceFormProps {
    initialData?: ServiceInput;
    isEditing?: boolean;
}

export function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ServiceInput>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || 0, // In cents, but we might want inputs in reals
        durationMinutes: initialData?.durationMinutes || 60,
        category: initialData?.category || "Lashes",
        imageUrl: initialData?.imageUrl || "",
    });

    // Handle price display (Cents to String)
    const [priceDisplay, setPriceDisplay] = useState(
        initialData?.price ? (initialData.price / 100).toFixed(2) : ""
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            price: Math.round(parseFloat(priceDisplay.replace(',', '.')) * 100) || 0
        };

        let result;
        if (isEditing && initialData?.id) {
            result = await updateService(initialData.id, payload);
        } else {
            result = await createService(payload);
        }

        if (result.success) {
            alert(isEditing ? "Serviço atualizado!" : "Serviço criado!");
            router.push("/admin/services");
            router.refresh();
        } else {
            alert("Erro: " + result.error);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!initialData?.id || !confirm("Tem certeza que deseja excluir este serviço?")) return;
        setIsLoading(true);
        const result = await deleteService(initialData.id);
        if (result.success) {
            router.push("/admin/services");
            router.refresh();
        } else {
            alert("Erro ao excluir.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <header className="flex justify-between items-center mb-6">
                <Link href="/admin/services" className="text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Serviço
                    </button>
                )}
            </header>

            <GlassCard className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Nome do Procedimento</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            placeholder="Ex: Volume Russo"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Categoria</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none [&>option]:bg-black"
                        >
                            <option value="Lashes">Cílios (Lashes)</option>
                            <option value="Brows">Sobrancelhas (Brows)</option>
                            <option value="Lips">Lábios (Lips)</option>
                            <option value="Nails">Unhas (Nails)</option>
                            <option value="Other">Outros</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Duração (Minutos)</label>
                        <input
                            required
                            type="number"
                            min="15"
                            step="15"
                            value={formData.durationMinutes}
                            onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Preço (R$)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">R$</span>
                            <input
                                required
                                type="text"
                                value={priceDisplay}
                                onChange={e => {
                                    // Allow numbers and ONE comma
                                    let val = e.target.value.replace(/[^0-9,]/g, '');
                                    const parts = val.split(',');
                                    if (parts.length > 2) val = parts[0] + ',' + parts.slice(1).join('');
                                    setPriceDisplay(val);
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none"
                                placeholder="0,00"
                            />
                        </div>
                    </div>

                    {/* Image URL (Optional for now) */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">URL da Imagem (Opcional)</label>
                        <input
                            type="text"
                            value={formData.imageUrl || ''}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Descrição</label>
                        <textarea
                            rows={3}
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none"
                            placeholder="Detalhes sobre o procedimento..."
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-black font-medium px-8 py-3 rounded-full transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEditing ? "Salvar Alterações" : "Criar Serviço"}
                    </button>
                </div>
            </GlassCard>
        </form>
    );
}





