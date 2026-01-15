"use server";

import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getServices() {
    try {
        const result = await db.query.services.findMany({
            orderBy: [asc(services.displayOrder), desc(services.createdAt)]
        });
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao buscar serviços" };
    }
}

export async function updateService(id: string, data: Partial<typeof services.$inferInsert>) {
    try {
        await db.update(services).set(data).where(eq(services.id, id));
        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao atualizar serviço" };
    }
}

export async function toggleFeatured(id: string, currentState: boolean) {
    try {
        await db.update(services).set({ isFeatured: !currentState }).where(eq(services.id, id));
        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao destacar serviço" };
    }
}

export async function reorderServices(items: { id: string; order: number }[]) {
    try {
        // In a real production app with many items, a transaction or a single raw query CASE WHEN is better.
        // For menu size (<50 items), this loop is acceptable.
        await db.transaction(async (tx) => {
            for (const item of items) {
                await tx.update(services)
                    .set({ displayOrder: item.order })
                    .where(eq(services.id, item.id));
            }
        });

        revalidatePath("/admin/settings/services");
        return { success: true };
    } catch (error) {
        console.error("Reorder Error:", error);
        return { success: false, error: "Falha ao reordenar serviçõs" };
    }
}
