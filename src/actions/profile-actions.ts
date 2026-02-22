"use server";

import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type SensoryPreferences = {
    favoriteMusic?: string;
    drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
    temperature?: "Warm" | "Cool" | "Neutral";
    musicVolume?: "Soft" | "Medium" | "Deep";
};

export async function updateClientPreferences(clientId: string, preferences: SensoryPreferences) {
    try {
        await db.update(clients)
            .set({
                sensoryPreferences: preferences
            })
            .where(eq(clients.id, clientId));

        revalidatePath("/profile");
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Error updating preferences:", error);
        return { success: false, error: "Erro ao salvar preferências" };
    }
}





