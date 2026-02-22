
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Standard button for small actions
import { approveReview, deleteReview } from "@/actions/review-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Review {
    id: string;
    clientName: string;
    rating: number;
    comment: string | null;
    approved: boolean | null;
    createdAt: Date | null;
}

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
    const router = useRouter();

    const handleToggle = async (id: string, status: boolean | null) => {
        try {
            await approveReview(id, status);
            toast.success("Status atualizado!");
            router.refresh();
        } catch (error) {
            toast.error("Erro ao atualizar.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir review?")) return;
        try {
            await deleteReview(id);
            toast.success("Review excluído.");
            router.refresh();
        } catch (error) {
            toast.error("Erro ao excluir.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif text-primary">Reviews Moderation</h1>
                    <p className="text-muted-foreground text-sm">Aprove ou oculte depoimentos de clientes.</p>
                </div>
            </div>

            <div className="space-y-4">
                {initialReviews.length === 0 ? (
                    <p className="text-white/30 text-center py-8">Nenhum review registrado.</p>
                ) : (
                    initialReviews.map(review => (
                        <div key={review.id} className="bg-white/5 border border-white/10 p-6 hover:border-primary/30 transition-colors rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{review.clientName}</span>
                                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest border rounded ${review.approved ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                            }`}>
                                            {review.approved ? 'Publicado' : 'Pendente'}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < review.rating ? 'text-primary' : 'text-white/20'}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-white/40 text-sm">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : '-'}
                                </span>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    onClick={() => handleToggle(review.id, review.approved)}
                                    variant="outline"
                                    size="sm"
                                    className={`border-white/10 ${review.approved ? 'text-white/40' : 'text-green-400 hover:bg-green-500/10'}`}
                                >
                                    {review.approved ? 'Ocultar' : 'Aprovar'}
                                </Button>
                                <Button
                                    onClick={() => handleDelete(review.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}





