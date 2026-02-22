"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                status,
                contact:contacts (
                    id,
                    name,
                    sensory_preferences
                ),
                service:services (
                    title
                ),
                professional:professionals (
                    name
                )
            `)
            .eq('tenant_id', TENANT_ID)
            .gte('start_time', today.toISOString())
            .lte('start_time', tonight.toISOString())
            .order('start_time', { ascending: true });

        if (error) throw error;

        // Transform to match the old shape if needed
        const results = (data || []).map((appt: any) => ({
            id: appt.id,
            startTime: appt.start_time,
            status: appt.status,
            client: appt.contact ? {
                id: appt.contact.id,
                fullName: appt.contact.name,
                sensoryPreferences: appt.contact.sensory_preferences,
            } : null,
            service: appt.service,
            professional: appt.professional
        }));

        return { data: results };
    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        return { error: "Failed to fetch appointments." };
    }
}

export async function updateAppointmentStatus(id: string, status: "confirmed" | "completed" | "cancelled") {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/(reception)/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { error: "Failed to update status." };
    }
}






