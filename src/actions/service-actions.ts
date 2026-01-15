"use server";

import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
        await db.insert(services).values({
            title,
            description: description || "",
            price,
            durationMinutes,
            category,
            imageUrl: imageUrl || null,
        });

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
        await db.update(services)
            .set({
                title,
                description: description || "",
                price,
                durationMinutes,
                category,
                imageUrl: imageUrl || null,
            })
            .where(eq(services.id, id));

        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar serviço." };
    }
}

export async function deleteService(id: string) {
    try {
        await db.delete(services).where(eq(services.id, id));
        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir serviço. Verifique se há agendamentos vinculados." };
    }
}

export async function getServicesForBooking() {
    try {
        const result = await db.query.services.findMany({
            orderBy: (services, { asc }) => [asc(services.displayOrder), asc(services.title)]
        });
        return result;
    } catch (error) {
        console.error("Get Services For Booking Error:", error);
        return [];
    }
}
