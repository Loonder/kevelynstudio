"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getReviews() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching reviews from Supabase:", error);
        return [];
    }
}

export async function approveReview(id: string, currentStatus: boolean | null) {
    try {
        const { error } = await supabase
            .from('reviews')
            .update({ approved: !currentStatus })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error) {
        console.error("Approve Review Error:", error);
        return { success: false, error: "Erro ao atualizar review." };
    }
}

export async function deleteReview(id: string) {
    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/reviews");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Delete Review Error:", error);
        return { success: false, error: "Erro ao excluir review." };
    }
}

export async function createReview(data: { clientName: string; rating: number; comment: string; photoUrl?: string; approved?: boolean }) {
    try {
        const { error } = await supabase
            .from('reviews')
            .insert({
                client_name: data.clientName,
                rating: data.rating,
                comment: data.comment,
                photo_url: data.photoUrl,
                approved: data.approved ?? true,
                tenant_id: TENANT_ID
            });

        if (error) throw error;

        revalidatePath("/admin/reviews");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Create Review Error:", error);
        return { success: false, error: "Erro ao criar review." };
    }
}






