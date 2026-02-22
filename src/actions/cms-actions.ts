"use server";

import { db } from "@/lib/db";
import { methodologySteps } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMethodologySteps() {
    try {
        // Timeout protection: If DB takes > 2s, throw error to trigger fallback
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database Timeout")), 2000)
        );

        const steps = await Promise.race([
            db.query.methodologySteps.findMany({
                orderBy: [asc(methodologySteps.order)],
            }),
            timeoutPromise
        ]);

        return steps as any; // Cast to avoid type issues with race result
    } catch (error) {
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
    await db.insert(methodologySteps).values({
        title: data.title,
        description: data.description,
        order: data.order,
        active: true,
    });
    revalidatePath("/admin/methodology");
    revalidatePath("/");
}

export async function updateMethodologyStep(id: number, data: { title?: string; description?: string; order?: number; active?: boolean }) {
    await db.update(methodologySteps)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(methodologySteps.id, id));

    revalidatePath("/admin/methodology");
    revalidatePath("/");
}

export async function deleteMethodologyStep(id: number) {
    await db.delete(methodologySteps)
        .where(eq(methodologySteps.id, id));

    revalidatePath("/admin/methodology");
    revalidatePath("/");
}





