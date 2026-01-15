"use server";

import { db } from "@/lib/db";
import { professionals } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
        await db.insert(professionals).values({
            name,
            role,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
            bio: bio || null,
            instagramHandle: instagramHandle || null,
            imageUrl: imageUrl || null,
            color: color || "#D4AF37",
            isActive: true
        });

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/team");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Create Professional Error:", error);
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
        await db.update(professionals)
            .set({
                name,
                role,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
                bio: bio || null,
                instagramHandle: instagramHandle || null,
                imageUrl: imageUrl || null,
                color: color || "#D4AF37",
            })
            .where(eq(professionals.id, id));

        revalidatePath("/admin/professionals");
        revalidatePath("/admin/team");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Update Professional Error:", error);
        return { success: false, error: "Erro ao atualizar profissional." };
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

export async function getProfessionalsForBooking() {
    try {
        const result = await db.query.professionals.findMany({
            where: eq(professionals.isActive, true),
            orderBy: (professionals, { asc }) => [asc(professionals.name)]
        });
        return result;
    } catch (error) {
        console.error("Get Professionals For Booking Error:", error);
        return [];
    }
}
