import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus, Check, X, MessageSquare, Star, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ApproveReviewButton, DeleteReviewButton } from "@/components/admin/reviews/review-actions";

export default async function AdminReviewsPage() {
    // Sort: Pending first, then by date desc
    const allReviews = await db.select().from(reviews).orderBy(asc(reviews.approved), desc(reviews.createdAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Mural de Depoimentos</h1>
                    <p className="text-white/40 font-light">Gerencie o que as clientes falam sobre você.</p>
                </div>
                <Link href="/admin/reviews/new">
                    <LuxuryButton className="gap-2">
                        <Plus className="w-4 h-4" /> Adicionar Manualmente
                    </LuxuryButton>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allReviews.map((review) => (
                    <GlassCard key={review.id} className={`flex flex-col border-white/5 ${!review.approved ? 'bg-yellow-500/[0.05] border-yellow-500/20' : 'bg-white/[0.02]'}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 relative overflow-hidden">
                                    {review.photoUrl ? (
                                        <Image src={review.photoUrl} alt={review.clientName} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/50">
                                            {review.clientName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{review.clientName}</p>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-white/20'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {!review.approved && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-[10px] uppercase font-bold rounded">
                                    Pendente
                                </span>
                            )}
                        </div>

                        <p className="text-white/70 text-sm mb-6 flex-1 italic leading-relaxed">
                            &ldquo;{review.comment}&rdquo;
                        </p>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-white/30 uppercase">
                                {review.createdAt ? format(review.createdAt, "dd MMM yyyy", { locale: ptBR }) : '-'}
                            </span>

                            <div className="flex items-center gap-2">
                                {!review.approved && (
                                    <ApproveReviewButton reviewId={review.id} />
                                )}
                                <Link href={`/admin/reviews/edit/${review.id}`}>
                                    <button className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors" title="Editar">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </Link>
                                <DeleteReviewButton reviewId={review.id} />
                            </div>
                        </div>
                    </GlassCard>
                ))}
                {allReviews.length === 0 && (
                    <div className="col-span-full py-20 text-center text-white/30 italic">
                        Nenhum depoimento encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
