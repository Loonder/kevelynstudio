'use client';

import { useState } from "react";
import { createCourse } from "@/actions/academy-actions";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!title) return toast.error("Digite o nome do curso.");

        setIsCreating(true);
        try {
            const result = await createCourse({
                title: title,
                price: 0 // Default price for quick creation
            });
            if (result.success) {
                toast.success("Curso criado!");
                router.push(`/admin/academy/${result.id}`);
            } else {
                toast.error("Erro ao criar curso.");
            }
        } catch (error) {
            toast.error("Erro inesperado.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-20">
            <GlassCard className="text-center space-y-6">
                <h1 className="text-2xl font-serif text-white">Novo Curso na Academy</h1>
                <div className="space-y-2 text-left">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Nome do Curso</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        className="bg-black/20 border-white/10"
                        placeholder="Ex: Masterclass Volume Russo"
                    />
                </div>
                <LuxuryButton onClick={handleCreate} disabled={isCreating} className="w-full">
                    {isCreating ? "Criando..." : "Começar Edição"}
                </LuxuryButton>
            </GlassCard>
        </div>
    );
}





