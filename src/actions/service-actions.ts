"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

const serviceSchema = z.object({
    title: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().int().min(0, "Preço deve ser positivo"),
    durationMinutes: z.number().int().min(1, "Duração deve ser positiva"),
    category: z.string().min(1, "Categoria é obrigatória"),
    imageUrl: z.string().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema> & { id?: string };

export async function createService(data: Omit<ServiceInput, 'id'>) {
    const result = serviceSchema.safeParse(data);

    if (!result.success) {
        return { error: "Dados inválidos: " + result.error.issues.map((e: any) => e.message).join(", ") };
    }

    const { title, description, price, durationMinutes, category, imageUrl } = result.data;

    try {
        const { error } = await supabase
            .from('services')
            .insert({
                title,
                description: description || "",
                price,
                duration_minutes: durationMinutes,
                category,
                image_url: imageUrl || null,
                tenant_id: TENANT_ID
            });

        if (error) throw error;

        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Create Service Error:", error);
        return { error: "Erro ao criar serviço." };
    }
}

export async function updateService(id: string, data: Omit<ServiceInput, 'id'>) {
    const result = serviceSchema.safeParse(data);

    if (!result.success) {
        return { error: "Dados inválidos." };
    }

    const { title, description, price, durationMinutes, category, imageUrl } = result.data;

    try {
        const { error } = await supabase
            .from('services')
            .update({
                title,
                description: description || "",
                price,
                duration_minutes: durationMinutes,
                category,
                image_url: imageUrl || null,
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Update Service Error:", error);
        return { error: "Erro ao atualizar serviço." };
    }
}

export async function deleteService(id: string) {
    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir serviço. Verifique se há agendamentos vinculados." };
    }
}

export async function getServicesForBooking() {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('display_order', { ascending: true })
            .order('title', { ascending: true });

        if (error) throw error;

        return (data || []).map(s => ({
            ...s,
            durationMinutes: s.duration_minutes,
            imageUrl: s.image_url
        }));
    } catch (error) {
        console.error("Get Services For Booking Error:", error);
        return [];
    }
}





