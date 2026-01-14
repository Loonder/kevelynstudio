"use server";

import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

const serviceSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Preço deve ser positivo"),
    duration: z.coerce.number().min(1, "Duração deve ser positiva"),
    category: z.string().min(1, "Categoria é obrigatória"),
});

export async function createService(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        duration: formData.get("duration"),
        category: formData.get("category"),
    };

    const result = serviceSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Dados inválidos: " + result.error.errors.map(e => e.message).join(", ") };
    }

    const { name, description, price, duration, category } = result.data;

    try {
        await db.insert(services).values({
            title: name,
            description: description || "",
            price: Math.round(price * 100), // Convert to cents
            durationMinutes: duration,
            category: category,
        });

        revalidatePath("/admin/services");
        revalidatePath("/admin/calendar");
        return { success: true };
    } catch (error) {
        console.error("Create Service Error:", error);
        return { error: "Erro ao criar serviço." };
    }
}

export async function updateService(id: string, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        duration: formData.get("duration"),
        category: formData.get("category"),
    };

    const result = serviceSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Dados inválidos." };
    }

    const { name, description, price, duration, category } = result.data;

    try {
        await db.update(services)
            .set({
                title: name,
                description: description || "",
                price: Math.round(price * 100),
                durationMinutes: duration,
                category: category,
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
