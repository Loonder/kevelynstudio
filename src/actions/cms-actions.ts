"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getMethodologySteps() {
    try {
        const { data, error } = await supabase
            .from('methodology_steps')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return (data || []).map(step => ({
            ...step,
            order: step.display_order // Mapping back for UI consistency if needed
        })) as any;
    } catch (error) {
        console.error("Fetch Methodology Steps Error:", error);
        // Fallback data to prevent homepage crash (Silent fail for user)
        const now = new Date();
        return [
            { id: 1, title: "Visagismo Analítico", description: "Análise da estrutura óssea e simetria facial para um design exclusivo.", order: 1, active: true, createdAt: now, updatedAt: now },
            { id: 2, title: "Health First", description: "Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.", order: 2, active: true, createdAt: now, updatedAt: now },
            { id: 3, title: "Mapping Personalizado", description: "Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.", order: 3, active: true, createdAt: now, updatedAt: now },
            { id: 4, title: "Experiência Sensorial", description: "Aromaprocedimento e conforto absoluto para um momento de desconexão total.", order: 4, active: true, createdAt: now, updatedAt: now },
        ];
    }
}

export async function createMethodologyStep(data: { title: string; description: string; order: number }) {
    try {
        const { error } = await supabase
            .from('methodology_steps')
            .insert({
                title: data.title,
                description: data.description,
                display_order: data.order,
                active: true,
                tenant_id: TENANT_ID
            });

        if (error) throw error;
        revalidatePath("/admin/methodology");
        revalidatePath("/");
    } catch (error) {
        console.error("Create Methodology Step Error:", error);
    }
}

export async function updateMethodologyStep(id: number, data: { title?: string; description?: string; order?: number; active?: boolean }) {
    try {
        const { error } = await supabase
            .from('methodology_steps')
            .update({
                title: data.title,
                description: data.description,
                display_order: data.order,
                active: data.active,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/methodology");
        revalidatePath("/");
    } catch (error) {
        console.error("Update Methodology Step Error:", error);
    }
}

export async function deleteMethodologyStep(id: number) {
    try {
        const { error } = await supabase
            .from('methodology_steps')
            .delete()
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/methodology");
        revalidatePath("/");
    } catch (error) {
        console.error("Delete Methodology Step Error:", error);
    }
}





