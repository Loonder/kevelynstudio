"use client";

import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ServiceCardPreview } from "@/components/service-card-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { updateService } from "@/actions/settings-actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ServiceEditSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: any;
}

export function ServiceEditSheet({ open, onOpenChange, service }: ServiceEditSheetProps) {
    const { register, handleSubmit, watch, reset, setValue } = useForm();
    const [isSaving, setIsSaving] = useState(false);

    // Sync form with service when opened
    useEffect(() => {
        if (service) {
            reset({
                title: service.title,
                price: service.price / 100, // DB is cents
                promotionalPrice: service.promotionalPrice ? service.promotionalPrice / 100 : "",
                durationMinutes: service.durationMinutes,
                description: service.description,
                imageUrl: service.imageUrl
            });
        }
    }, [service, reset]);

    const watchedValues = watch();

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        const payload = {
            title: data.title,
            description: data.description,
            durationMinutes: Number(data.durationMinutes),
            price: Number(data.price) * 100,
            promotionalPrice: data.promotionalPrice ? Number(data.promotionalPrice) * 100 : null,
            imageUrl: data.imageUrl
        };

        const res = await updateService(service.id, payload);
        setIsSaving(false);

        if (res.success) {
            toast.success("Serviço atualizado!");
            onOpenChange(false);
        } else {
            toast.error("Erro ao salvar.");
        }
    };

    if (!service) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[90vw] sm:max-w-4xl border-l border-white/10 bg-[#050505] p-0 flex">

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-8 border-r border-white/5">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="text-2xl font-serif text-white">Editar Serviço</SheetTitle>
                        <SheetDescription>Altere as informações comerciais e veja a prévia instantânea.</SheetDescription>
                    </SheetHeader>

                    <form id="edit-service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white/60">Título do Serviço</Label>
                            <Input {...register("title")} className="bg-white/5 border-white/10 text-white" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <Label className="text-white/60">Preço (R$)</Label>
                                <Input type="number" step="0.01" {...register("price")} className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#D4AF37]">Preço Promocional (Opcional)</Label>
                                <Input type="number" step="0.01" {...register("promotionalPrice")} className="bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37] placeholder:text-[#D4AF37]/30" placeholder="Ex: 120.00" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/60">Duração (minutos)</Label>
                            <Input type="number" {...register("durationMinutes")} className="bg-white/5 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/60">Descrição Curta</Label>
                            <Textarea {...register("description")} className="bg-white/5 border-white/10 text-white min-h-[100px]" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/60">URL da Imagem (Unsplash/Local)</Label>
                            <Input {...register("imageUrl")} className="bg-white/5 border-white/10 text-white" />
                        </div>
                    </form>

                    <SheetFooter className="mt-8">
                        <LuxuryButton form="edit-service-form" disabled={isSaving}>
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </LuxuryButton>
                    </SheetFooter>
                </div>

                {/* Preview Area (Fixed) */}
                <div className="w-[400px] bg-zinc-900/50 flex flex-col justify-center items-center p-8">
                    <h4 className="text-white/30 text-xs uppercase tracking-widest mb-8">Visualização em Tempo Real</h4>

                    <ServiceCardPreview
                        title={watchedValues.title}
                        description={watchedValues.description}
                        price={watchedValues.price * 100}
                        promotionalPrice={watchedValues.promotionalPrice ? watchedValues.promotionalPrice * 100 : null}
                        durationMinutes={watchedValues.durationMinutes}
                        imageUrl={watchedValues.imageUrl}
                        isFeatured={service.isFeatured}
                    />
                </div>

            </SheetContent>
        </Sheet>
    );
}





