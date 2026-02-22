"use client";

import { useState } from "react";
import { ServiceSheet } from "./service-sheet";
import { Pencil, Trash2 } from "lucide-react";
import { deleteService } from "@/actions/service-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ServiceActions({ service }: { service: any }) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este serviço?")) {
            const result = await deleteService(service.id);
            if (result.success) {
                toast.success("Serviço excluído.");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setIsSheetOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ServiceSheet
                serviceToEdit={service}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}





