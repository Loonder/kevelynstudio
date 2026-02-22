"use server";

import { supabase } from "@/lib/supabase-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getClients() {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            status: c.status === 'lead' ? 'Lead' : 'Cliente',
            created_at: c.created_at,
            tags: []
        }));
    } catch (error) {
        console.error("Failed to fetch clients from Supabase:", error);
        return [];
    }
}

export async function getClientById(id: string) {
    try {
        const { data: client, error: clientError } = await supabase
            .from('contacts')
            .select('*')
            .eq('id', id)
            .eq('tenant_id', TENANT_ID)
            .single();

        if (clientError) throw clientError;

        const { data: history, error: historyError } = await supabase
            .from('appointments')
            .select('*, services(*), professionals(*)')
            .eq('contact_id', id)
            .eq('tenant_id', TENANT_ID)
            .order('start_time', { ascending: false })
            .limit(10);

        if (historyError) throw historyError;

        return {
            ...client,
            fullName: client.name, // Mapping for compatibility
            history: (history || []).map(h => ({
                ...h,
                service: h.services,
                professional: h.professionals
            }))
        };
    } catch (error) {
        console.error("Error fetching client profile from Supabase:", error);
        return null;
    }
}

export async function updateClient(id: string, data: any) {
    try {
        const { error } = await supabase
            .from('contacts')
            .update({
                name: data.fullName || data.name,
                email: data.email,
                phone: data.phone,
                notes: data.notes,
                sensory_preferences: data.sensoryPreferences
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Update Client Error (Supabase):", error);
        return { success: false, error: "Erro ao atualizar cliente" };
    }
}






