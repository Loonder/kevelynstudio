"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Clock, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface CourseCardProps {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    coverImageUrl?: string | null;
    duration?: string;
    lessonsCount?: number;
    rating?: number;
}

export function CourseCard({
    slug,
    title,
    description,
    price,
    coverImageUrl,
    duration = "8h 30m",
    lessonsCount = 12,
    rating = 5.0
}: CourseCardProps) {

    // Premium Format: R$ 1.297,00
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price / 100);

    return (
        <Link href={`/courses/${slug}`} className="group block h-full">
            <GlassCard className="h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)] hover:border-primary/30">

                {/* Visual Header / Placeholder */}
                <div className="relative h-56 w-full overflow-hidden">
                    {coverImageUrl ? (
                        <Image
                            src={coverImageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        // Premium Placeholder using Globals CSS classes
                        <div className={cn(
                            "w-full h-full flex items-center justify-center p-8",
                            "bg-gradient-to-br from-surface to-[#111]",
                            "group-hover:from-[#111] group-hover:to-surface"
                        )}>
                            {/* Abstract Geometric decorative element */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#D4AF37,transparent_70%)]" />

                            <h3 className="text-3xl font-serif text-white/90 text-center leading-tight relative z-10 drop-shadow-lg">
                                {title}
                            </h3>
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" /> {rating.toFixed(1)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {duration}
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {lessonsCount} Aulas
                        </span>
                    </div>

                    <h4 className="text-xl font-serif text-white mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h4>

                    <p className="text-sm text-white/60 line-clamp-2 mb-6 flex-1">
                        {description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Investimento</span>
                            <span className="text-lg font-medium text-white">{formattedPrice}</span>
                        </div>

                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}





