"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

const professionalSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    role: z.string().min(1, "Cargo é obrigatório"),
    slug: z.string().optional(),
    bio: z.string().nullable().optional(),
    instagramHandle: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    color: z.string().optional(),
});

export type ProfessionalInput = z.infer<typeof professionalSchema> & { id?: string };

export async function createProfessional(data: Omit<ProfessionalInput, 'id'>) {
    const result = professionalSchema.safeParse(data);

    if (!result.success) {
        const errorMessage = Object.values(result.error.flatten().fieldErrors).flat().join(", ");
        return { success: false, error: `Dados inválidos: ${errorMessage}` };
    }

    const { name, role, slug, bio, instagramHandle, imageUrl, color } = result.data;

    try {
        const { error } = await supabase
            .from('professionals')
            .insert({
                name,
                role,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
                bio: bio || null,
                instagram_handle: instagramHandle || null,
                image_url: imageUrl || null,
                color: color || "#D4AF37",
                is_active: true,
                tenant_id: TENANT_ID
            });

        if (error) throw error;

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/team");
        revalidatePath("/admin/calendar");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Create Professional Error (Supabase):", error);
        return { success: false, error: "Erro ao criar profissional." };
    }
}

export async function updateProfessional(id: string, data: Omit<ProfessionalInput, 'id'>) {
    const result = professionalSchema.safeParse(data);

    if (!result.success) {
        const errorMessage = Object.values(result.error.flatten().fieldErrors).flat().join(", ");
        return { success: false, error: `Dados inválidos: ${errorMessage}` };
    }

    const { name, role, slug, bio, instagramHandle, imageUrl, color } = result.data;

    try {
        const { error } = await supabase
            .from('professionals')
            .update({
                name,
                role,
                slug,
                bio: bio || null,
                instagram_handle: instagramHandle || null,
                image_url: imageUrl || null,
                color: color || "#D4AF37",
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/team");
        revalidatePath("/admin/calendar");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Update Professional Error (Supabase):", error);
        return { success: false, error: "Erro ao atualizar profissional." };
    }
}

export async function updateProfessionalStatus(id: string, isActive: boolean) {
    try {
        const { error } = await supabase
            .from('professionals')
            .update({ is_active: isActive })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/calendar");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Update Professional Status Error:", error);
        return { error: "Erro ao atualizar status." };
    }
}

export async function deleteProfessional(id: string) {
    try {
        const { error } = await supabase
            .from('professionals')
            .delete()
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/calendar");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Delete Professional Error:", error);
        return { error: "Erro ao excluir profissional." };
    }
}

export async function getProfessionalsForBooking() {
    try {
        const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('is_active', true)
            .eq('tenant_id', TENANT_ID)
            .order('name', { ascending: true });

        if (error) throw error;

        return (data || []).map(p => ({
            ...p,
            instagramHandle: p.instagram_handle,
            imageUrl: p.image_url,
            isActive: p.is_active
        }));
    } catch (error) {
        console.error("Get Professionals For Booking Error:", error);
        return [];
    }
}





