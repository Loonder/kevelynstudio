"use server";

import { supabase } from "@/lib/supabase-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getDashboardStats() {
    try {
        const { data: appts, error } = await supabase
            .from('appointments')
            .select('status, start_time')
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        return {
            totalAppointments: appts.length,
            confirmed: appts.filter(a => a.status === 'confirmed').length,
            pending: appts.filter(a => a.status === 'pending').length,
            cancelled: appts.filter(a => a.status === 'cancelled').length,
        };
    } catch (error) {
        console.error("Analytics Error:", error);
        return { totalAppointments: 0, confirmed: 0, pending: 0, cancelled: 0 };
    }
}
