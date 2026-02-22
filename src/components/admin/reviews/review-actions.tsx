'use client';

import { approveReview, deleteReview } from "@/actions/review-actions";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ApproveReviewButton({ reviewId }: { reviewId: string }) {
    const router = useRouter();
    return (
        <button
            onClick={async () => {
                await approveReview(reviewId, false);
                toast.success("Depoimento aprovado!");
                router.refresh(); // Or revalidatePath handling
            }}
            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-full transition-colors"
            title="Aprovar"
        >
            <Check className="w-4 h-4" />
        </button>
    );
}

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
    const router = useRouter();
    return (
        <button
            onClick={async () => {
                if (confirm("Tem certeza que deseja apagar?")) {
                    await deleteReview(reviewId);
                    toast.success("Depoimento removido.");
                    router.refresh();
                }
            }}
            className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-full transition-colors"
            title="Rejeitar/Apagar"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}





