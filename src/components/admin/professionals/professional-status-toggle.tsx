"use client";

import { useState } from "react";
import { updateProfessionalStatus } from "@/actions/professional-actions";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfessionalStatusToggle({ professional }: { professional: { id: string; isActive: boolean | null | undefined } }) {
    const [isActive, setIsActive] = useState(professional.isActive ?? false);
    const router = useRouter();

    const handleToggle = async (checked: boolean) => {
        // Optimistic UI
        setIsActive(checked);
        const result = await updateProfessionalStatus(professional.id, checked);

        if (result.error) {
            setIsActive(!checked); // Revert
            toast.error(result.error);
        } else {
            toast.success("Status atualizado.");
            router.refresh();
        }
    };

    return (
        <Switch
            checked={isActive}
            onChange={(e) => handleToggle(e.target.checked)}
            className="peer data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-white/10"
        />
    );
}
