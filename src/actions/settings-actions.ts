"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getServices() {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data: data };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao buscar serviços" };
    }
}

export async function updateService(id: string, data: any) {
    try {
        const { error } = await supabase
            .from('services')
            .update({
                title: data.title,
                description: data.description,
                price: data.price,
                duration_minutes: data.durationMinutes || data.duration_minutes,
                category: data.category,
                image_url: data.image_url,
                display_order: data.displayOrder || data.display_order,
                is_featured: data.isFeatured !== undefined ? data.isFeatured : data.is_featured,
                promotional_price: data.promotionalPrice || data.promotional_price
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        console.error("Update Service Error:", error);
        return { success: false, error: "Erro ao atualizar serviço" };
    }
}

export async function toggleFeatured(id: string, currentState: boolean) {
    try {
        const { error } = await supabase
            .from('services')
            .update({ is_featured: !currentState })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        console.error("Toggle Featured Error:", error);
        return { success: false, error: "Erro ao destacar serviço" };
    }
}

export async function reorderServices(items: { id: string; order: number }[]) {
    try {
        for (const item of items) {
            await supabase
                .from('services')
                .update({ display_order: item.order })
                .eq('id', item.id)
                .eq('tenant_id', TENANT_ID);
        }

        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        console.error("Reorder Error:", error);
        return { success: false, error: "Falha ao reordenar serviços" };
    }
}





