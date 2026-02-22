import { supabase } from "@/lib/supabase-client";
import { startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { AdminCalendar } from "@/components/admin/calendar/admin-calendar";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    // 1. Fetch Professionals (Resources)
    const { data: staff } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true)
        .eq('tenant_id', TENANT_ID);

    const resources = (staff || []).map(pro => ({
        id: pro.id,
        title: pro.name,
        name: pro.name
    }));

    // 2. Fetch Clients & Services for Create Modal
    const { data: allClients } = await supabase
        .from('contacts')
        .select('*')
        .eq('tenant_id', TENANT_ID);

    const { data: allServices } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', TENANT_ID);

    // 3. Fetch Appointments 
    const today = new Date();
    const startRange = subMonths(startOfMonth(today), 2);
    const endRange = addMonths(endOfMonth(today), 6);

    const { data: apptsData } = await supabase
        .from('appointments')
        .select(`
            id,
            start_time,
            end_time,
            status,
            professional_id,
            contacts!contact_id (full_name),
            services!service_id (title, category),
            professionals!professional_id (color)
        `)
        .eq('tenant_id', TENANT_ID)
        .gte('start_time', startRange.toISOString())
        .lte('start_time', endRange.toISOString());

    // 4. Transform Data for Calendar
    const events = (apptsData || []).map(appt => {
        // Handle potential array or single object from Supabase joins
        const client = Array.isArray(appt.contacts) ? appt.contacts[0] : appt.contacts;
        const service = Array.isArray(appt.services) ? appt.services[0] : appt.services;
        const professional = Array.isArray(appt.professionals) ? appt.professionals[0] : appt.professionals;

        return {
            id: appt.id,
            title: `${client?.full_name || 'Cliente'} - ${service?.title || 'Serviço'}`,
            start: new Date(appt.start_time),
            end: new Date(appt.end_time),
            resourceId: appt.professional_id,
            status: appt.status,
            color: professional?.color,
            category: service?.category,
            clientName: client?.full_name,
            serviceTitle: service?.title,
        };
    });

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex-1">
                <AdminCalendar
                    initialEvents={events}
                    resources={resources}
                    clients={allClients || []}
                    services={allServices || []}
                    defaultDate={today}
                />
            </div>
        </div>
    );
}






