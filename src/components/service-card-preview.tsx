import { GlassCard } from "@/components/ui/glass-card";
import { Clock, Check } from "lucide-react";
import Image from "next/image";

interface ServiceCardPreviewProps {
    title: string;
    description: string;
    price: number;
    promotionalPrice?: number | null;
    durationMinutes: number;
    imageUrl?: string | null;
    isFeatured?: boolean;
}

export function ServiceCardPreview({
    title,
    description,
    price,
    promotionalPrice,
    durationMinutes,
    imageUrl,
    isFeatured
}: ServiceCardPreviewProps) {
    const hasPromo = promotionalPrice !== null && promotionalPrice !== undefined && promotionalPrice < price;

    return (
        <div className="relative group select-none">
            {/* Mobile-like Preview Container */}
            <div className="w-full max-w-[320px] mx-auto bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5">

                {/* Image Area */}
                <div className="h-40 w-full relative bg-zinc-900">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs uppercase tracking-widest bg-zinc-900 border-b border-white/5">
                            Sem Imagem
                        </div>
                    )}

                    {/* Featured Badge */}
                    {isFeatured && (
                        <div className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Destaque
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-white font-medium text-lg leading-tight">{title || "Nome do Serviço"}</h3>
                    </div>

                    <p className="text-white/40 text-xs line-clamp-2 min-h-[2.5em]">
                        {description || "Breve descrição do procedimento..."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-white/50 border-y border-white/5 py-3">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{durationMinutes || 0} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span>Reserva Online</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                            {hasPromo && (
                                <span className="text-xs text-white/30 line-through">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price / 100)}
                                </span>
                            )}
                            <span className={`font-serif text-xl ${hasPromo ? 'text-green-400' : 'text-[#D4AF37]'}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((hasPromo ? promotionalPrice! : price) / 100)}
                            </span>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors border border-white/10">
                            Agendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Label */}
            <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4">Pré-visualização do Cliente</p>
        </div>
    );
}





