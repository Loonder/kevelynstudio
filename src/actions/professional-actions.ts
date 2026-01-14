"use server";

import { db } from "@/lib/db";
import { professionals } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

const professionalSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    role: z.string().min(1, "Cargo é obrigatório"),
    bio: z.string().nullable().optional(),
    color: z.string().min(4, "Cor inválida"),
});

export async function createProfessional(formData: FormData) {
    const rawData = {
        name: formData.get("name")?.toString(),
        role: formData.get("role")?.toString(),
        bio: formData.get("bio")?.toString() || null,
        color: formData.get("color")?.toString(),
    };

    const result = professionalSchema.safeParse(rawData);

    if (!result.success) {
        const errorMessage = Object.values(result.error.flatten().fieldErrors).flat().join(", ");
        return { error: `Dados inválidos: ${errorMessage}` };
    }

    const { name, role, bio, color } = result.data;

    try {
        await db.insert(professionals).values({
            name: name!,
            role: role!,
            bio: bio || null,
            slug: name!.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
            color: color || "#D4AF37",
            imageUrl: "", // Placeholder for now
            isActive: true
        });

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Create Professional Error:", error);
        return { error: "Erro ao criar profissional." };
    }
}

export async function updateProfessionalStatus(id: string, isActive: boolean) {
    try {
        await db.update(professionals)
            .set({ isActive })
            .where(eq(professionals.id, id));

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar status." };
    }
}

export async function deleteProfessional(id: string) {
    try {
        await db.delete(professionals).where(eq(professionals.id, id));
        revalidatePath("/admin/professionals");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir profissional." };
    }
}
