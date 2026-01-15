"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, Star, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ServiceRowProps {
    service: any;
    onEdit: (service: any) => void;
    onToggleFeatured: (id: string, current: boolean) => void;
}

export function ServiceRow({ service, onEdit, onToggleFeatured }: ServiceRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: service.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-4 p-4 bg-zinc-900 border border-white/5 rounded-lg group hover:border-[#D4AF37]/30 transition-colors",
                isDragging && "opacity-50 border-[#D4AF37] shadow-xl z-50 bg-zinc-800"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-move p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-medium truncate">{service.title}</h4>
                    {service.category === 'Lashes' && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Lashes</span>}
                    {service.category === 'Brows' && <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">Brows</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes} min
                    </span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price / 100)}
                    </span>
                    {service.promotionalPrice && (
                        <span className="text-green-400">
                            Promo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.promotionalPrice / 100)}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onToggleFeatured(service.id, service.isFeatured)}
                    className={cn(
                        "p-2 rounded-full transition-all border",
                        service.isFeatured
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                            : "bg-transparent text-white/10 border-transparent hover:text-white/30 hover:bg-white/5"
                    )}
                    title="Destacar Serviço"
                >
                    <Star className={cn("w-4 h-4", service.isFeatured && "fill-current")} />
                </button>

                <div className="h-8 w-[1px] bg-white/5" />

                <Switch disabled checked={true} /> {/* Placeholder for Active Toggle - future impl */}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(service)}
                    className="text-white/50 hover:text-white hover:bg-white/10"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
            </div>
        </div>
    );
}
