"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { createProfessional } from "@/actions/professional-actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfessionalModalProps {
    trigger?: React.ReactNode;
}

const COLORS = [
    { name: "Gold", value: "#D4AF37", class: "bg-[#D4AF37]" },
    { name: "Purple", value: "#A855F7", class: "bg-[#A855F7]" },
    { name: "Pink", value: "#EC4899", class: "bg-[#EC4899]" },
    { name: "Blue", value: "#3B82F6", class: "bg-[#3B82F6]" },
    { name: "Green", value: "#10B981", class: "bg-[#10B981]" },
    { name: "Red", value: "#EF4444", class: "bg-[#EF4444]" },
];

export function ProfessionalModal({ trigger }: ProfessionalModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.set("color", selectedColor);

        try {
            const result = await createProfessional(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Profissional adicionada!");
                setOpen(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <LuxuryButton className="bg-[#D4AF37] text-black">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                    </LuxuryButton>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border rounded-xl border-white/10 text-white sm:max-w-md shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-[#D4AF37] text-center mb-2">
                        Novo Membro
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Nome Completo</label>
                        <Input
                            name="name"
                            required
                            className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37] h-12"
                            placeholder="Ex: Kevelyn Costa"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Especialidade (Cargo)</label>
                        <Input
                            name="role"
                            required
                            className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37] h-12"
                            placeholder="Ex: Master Lash Designer"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Cor na Agenda</label>
                        <div className="flex gap-3 justify-center">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-8 h-8 rounded-full transition-all duration-300 ${color.class} ${selectedColor === color.value
                                            ? "ring-2 ring-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                            : "opacity-50 hover:opacity-100 hover:scale-105"
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Bio (Opcional)</label>
                        <Textarea
                            name="bio"
                            className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37] min-h-[80px]"
                            placeholder="Breve descrição sobre a profissional..."
                        />
                    </div>

                    <div className="pt-4">
                        <LuxuryButton type="submit" isLoading={isLoading} className="w-full justify-center bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                            Salvar Profissional
                        </LuxuryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
