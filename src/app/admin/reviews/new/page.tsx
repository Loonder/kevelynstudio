'use client';

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { createReview } from "@/actions/review-actions"; // Will create next
import { useRouter } from "next/navigation";

export default function NewReviewPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name || !comment) return toast.error("Nome e Comentário são obrigatórios.");

        setIsSaving(true);
        try {
            await createReview({ clientName: name, rating, comment, photoUrl, approved: true }); // Adding manually implies approval usually
            toast.success("Depoimento adicionado!");
            router.push("/admin/reviews");
        } catch (error) {
            toast.error("Erro ao salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-10 pb-20">
            <h1 className="text-3xl font-serif text-white mb-8">Adicionar Depoimento Manualmente</h1>

            <GlassCard className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Nome da Cliente</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-black/20 border-white/10" placeholder="Ex: Maria Silva" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Avaliação (1-5)</label>
                        <div className="flex items-center gap-1 h-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Comentário (WhatsApp/Instagram)</label>
                    <Textarea
                        value={comment}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                        className="bg-black/20 border-white/10 h-32"
                        placeholder="Cole aqui o texto que a cliente enviou..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Foto (URL Opcional)</label>
                    <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="bg-black/20 border-white/10" placeholder="https://..." />
                </div>

                <LuxuryButton onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? "Salvando..." : "Adicionar ao Mural"}
                </LuxuryButton>
            </GlassCard>
        </div>
    );
}
