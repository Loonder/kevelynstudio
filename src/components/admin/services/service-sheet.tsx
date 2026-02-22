"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming generic Textarea exists
import { LuxuryButton } from "@/components/ui/luxury-button";
import { createService, updateService } from "@/actions/service-actions";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ServiceSheetProps {
    serviceToEdit?: any | null; // If null, create mode
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ServiceSheet({ serviceToEdit, trigger, open, onOpenChange }: ServiceSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // If controlled (open/onOpenChange passed), use that. Else generic trigger.
    const isEdit = !!serviceToEdit;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            title: formData.get("name") as string, // Changed from "title" to "name" to match input field
            description: formData.get("description") as string || undefined,
            price: Number(formData.get("price")),
            durationMinutes: Number(formData.get("duration")),
            category: formData.get("category") as string,
            imageUrl: undefined, // Assuming imageUrl is not part of the form for now
        };

        try {
            let result;
            if (isEdit) {
                result = await updateService(serviceToEdit.id, data);
            } else {
                result = await createService(data);
            }

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(isEdit ? "Serviço atualizado!" : "Serviço criado com sucesso!");
                if (onOpenChange) onOpenChange(false);
                router.refresh(); // Ensure client update
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    }

    const defaultValues = serviceToEdit ? {
        name: serviceToEdit.title,
        description: serviceToEdit.description,
        price: serviceToEdit.price / 100,
        duration: serviceToEdit.durationMinutes,
        category: serviceToEdit.category
    } : {
        name: "",
        description: "",
        price: "",
        duration: "60",
        category: "Cílios"
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent className="bg-[#0A0A0A] border-l border-white/10 text-white w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-serif text-2xl text-[#D4AF37]">
                        {isEdit ? "Editar Serviço" : "Novo Serviço"}
                    </SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Nome do Serviço</label>
                        <Input
                            name="name"
                            defaultValue={defaultValues.name}
                            required
                            className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]"
                            placeholder="Ex: Volume Brasileiro"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-widest">Preço (R$)</label>
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={defaultValues.price}
                                required
                                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-widest">Duração (min)</label>
                            <Input
                                name="duration"
                                type="number"
                                defaultValue={defaultValues.duration}
                                required
                                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Categoria</label>
                        <select
                            name="category"
                            defaultValue={defaultValues.category}
                            className="w-full flex h-10 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder:text-white/20"
                        >
                            <option value="Cílios" className="bg-black">Cílios</option>
                            <option value="Sobrancelhas" className="bg-black">Sobrancelhas</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Descrição</label>
                        <textarea
                            name="description"
                            defaultValue={defaultValues.description}
                            className="flex min-h-[80px] w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder:text-white/20"
                            placeholder="Detalhes sobre o procedimento..."
                        />
                    </div>

                    <div className="pt-4">
                        <LuxuryButton type="submit" isLoading={isLoading} className="w-full justify-center bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                            {isEdit ? "Salvar Alterações" : "Criar Serviço"}
                        </LuxuryButton>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}





