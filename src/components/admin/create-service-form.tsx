"use client";

import { useTransition, useState } from "react";
import { createService } from "@/actions/service-actions";
import { Input } from "@/components/ui/input";
import { LuxuryButton } from "@/components/ui/luxury-button";

interface CreateServiceFormProps {
    onSuccess: () => void;
}

export function CreateServiceForm({ onSuccess }: CreateServiceFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const data = {
                title: formData.get("title") as string,
                price: Number(formData.get("price")),
                durationMinutes: Number(formData.get("duration")),
                category: formData.get("category") as string,
                description: formData.get("description") as string || undefined,
                imageUrl: undefined,
            };

            const result = await createService(data);
            if (result?.error) {
                setError(result.error);
            } else {
                onSuccess();
            }
        });
    }

    return (
        <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs uppercase text-white/50 tracking-wider">Nome do Serviço</label>
                <Input name="title" placeholder="Ex: Design de Sobrancelhas" required className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-white/50 tracking-wider">Preço (Centavos)</label>
                    <Input name="price" type="number" placeholder="Ex: 8000 (R$ 80,00)" required className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-white/50 tracking-wider">Duração (Min)</label>
                    <Input name="duration" type="number" placeholder="Ex: 60" required className="bg-white/5 border-white/10 text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-white/50 tracking-wider">Categoria</label>
                <Input name="category" placeholder="Ex: Sobrancelhas" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-white/50 tracking-wider">Descrição</label>
                <textarea
                    name="description"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 text-sm h-24 resize-none"
                    placeholder="Detalhes sobre o procedimento..."
                />
            </div>

            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded text-center">
                    {error}
                </div>
            )}

            <LuxuryButton type="submit" isLoading={isPending} className="w-full justify-center">
                Criar Serviço
            </LuxuryButton>
        </form>
    );
}





