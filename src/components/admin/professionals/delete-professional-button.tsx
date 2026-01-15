"use client";

import { useState } from "react";
import { deleteProfessional } from "@/actions/professional-actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteProfessionalButtonProps {
    professionalId: string;
    professionalName: string;
}

export function DeleteProfessionalButton({ professionalId, professionalName }: DeleteProfessionalButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = confirm(`Tem certeza que deseja excluir ${professionalName}? Esta ação não pode ser desfeita.`);

        if (!confirmed) return;

        setIsDeleting(true);
        const loadingToast = toast.loading("Excluindo profissional...");

        try {
            const result = await deleteProfessional(professionalId);

            if (result.success) {
                toast.success("Profissional excluído com sucesso!", { id: loadingToast });
            } else {
                toast.error(result.error || "Erro ao excluir profissional.", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Erro inesperado ao excluir.", { id: loadingToast });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-500/10 rounded-full transition-colors group disabled:opacity-50"
            title="Excluir profissional"
        >
            <Trash2 className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors" />
        </button>
    );
}
