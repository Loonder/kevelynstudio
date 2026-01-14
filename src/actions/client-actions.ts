"use server";

import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateClient(
    clientId: string,
    data: {
        fullName: string;
        email: string;
        phone: string;
        sensoryPreferences: {
            favoriteMusic?: string;
            drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
            temperature?: "Warm" | "Cool" | "Neutral";
            musicVolume?: "Soft" | "Medium" | "Deep";
        };
        notes?: string;
    }
) {
    try {
        await db.update(clients)
            .set({
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                sensoryPreferences: data.sensoryPreferences,
                notes: data.notes,
            })
            .where(eq(clients.id, clientId));

        revalidatePath('/admin/clients');
        revalidatePath(`/admin/clients/edit/${clientId}`);
        return { success: true };
    } catch (error) {
        console.error("Update Client Error:", error);
        return { success: false, error: "Falha ao atualizar cliente." };
    }
}

export async function getClient(clientId: string) {
    try {
        const client = await db.query.clients.findFirst({
            where: eq(clients.id, clientId)
        });
        if (!client) return { success: false, error: "Cliente não encontrado" };
        return { success: true, data: client };
    } catch (error) {
        return { success: false, error: "Erro ao buscar cliente" };
    }
}
