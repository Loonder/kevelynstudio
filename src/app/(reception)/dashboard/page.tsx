import { supabase } from "@/lib/supabase-client";
import { ReceptionClient } from "@/app/(reception)/dashboard/reception-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function ReceptionDashboard() {
    let serializedAppointments: any[] = [];

    try {
        // Brazil Time Logic
        const now = new Date();
        const brazilOffset = -3;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const brazilTime = new Date(utc + (3600000 * brazilOffset));

        const startOfTodayBR = new Date(brazilTime);
        startOfTodayBR.setHours(0, 0, 0, 0);

        const endOfTodayBR = new Date(startOfTodayBR);
        endOfTodayBR.setHours(23, 59, 59, 999);

        // Fetch from Supabase
        const { data: results, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                status,
                contacts!contact_id (
                    id,
                    full_name,
                    sensory_preferences,
                    technical_notes
                ),
                services!service_id (
                    title
                ),
                professionals!professional_id (
                    name
                )
            `)
            .eq('tenant_id', TENANT_ID)
            .gte('start_time', startOfTodayBR.toISOString())
            .lte('start_time', endOfTodayBR.toISOString())
            .order('start_time', { ascending: true });

        if (error) throw error;

        serializedAppointments = (results || []).map(appt => {
            // Supabase joins can return arrays or single objects depending on the schema detection
            const client = Array.isArray(appt.contacts) ? appt.contacts[0] : appt.contacts;
            const service = Array.isArray(appt.services) ? appt.services[0] : appt.services;
            const professional = Array.isArray(appt.professionals) ? appt.professionals[0] : appt.professionals;

            return {
                id: appt.id,
                startTime: appt.start_time,
                status: appt.status,
                client: {
                    id: client?.id,
                    fullName: client?.full_name,
                    sensoryPreferences: client?.sensory_preferences,
                    technicalNotes: client?.technical_notes,
                },
                service: {
                    title: service?.title,
                },
                professional: {
                    name: professional?.name,
                }
            };
        });
    } catch (error) {
        console.error("Reception data fetch error:", error);
    }

    return <ReceptionClient appointments={serializedAppointments} />;
}






