"use client";

import { useState } from "react";
import { ServiceList } from "@/components/admin/settings/service-list";
import { ServiceEditSheet } from "@/components/admin/settings/service-edit-sheet";
import { Plus } from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";

export default function ServicesSettingsPage({ services }: { services: any[] }) {
    const [editingService, setEditingService] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleEdit = (service: any) => {
        setEditingService(service);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-medium text-white">Menu de Serviços</h3>
                    <p className="text-sm text-white/50">
                        Arraste para reordenar. O topo da lista aparece primeiro para o cliente.
                    </p>
                </div>
                <LuxuryButton className="h-9 text-xs">
                    <Plus className="w-4 h-4 mr-2" /> Novo Serviço
                </LuxuryButton>
            </div>

            <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-6 min-h-[400px]">
                <ServiceList
                    initialServices={services}
                    onEdit={handleEdit}
                />
            </div>

            <ServiceEditSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                service={editingService}
            />
        </div>
    );
}





