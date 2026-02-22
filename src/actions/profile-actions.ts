"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

type SensoryPreferences = {
    favoriteMusic?: string;
    drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
    temperature?: "Warm" | "Cool" | "Neutral";
    musicVolume?: "Soft" | "Medium" | "Deep";
};

export async function updateClientPreferences(clientId: string, preferences: SensoryPreferences) {
    try {
        const { error } = await supabase
            .from('contacts')
            .update({
                sensory_preferences: preferences
            })
            .eq('id', clientId)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/profile");
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Error updating preferences:", error);
        return { success: false, error: "Erro ao salvar preferências" };
    }
}





