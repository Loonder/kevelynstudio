"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CreateServiceForm } from "@/components/admin/create-service-form";

export function CreateServiceButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
            >
                <Plus className="w-4 h-4" /> Novo Serviço
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Novo Serviço"
            >
                <CreateServiceForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}





