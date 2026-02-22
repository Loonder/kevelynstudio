import { supabase } from "@/lib/supabase-client";
import { ServicesClient } from "@/components/ui/services-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export const revalidate = 60; // ISR

export default async function PublicServicesPage() {
    const { data: allServices } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('price', { ascending: true });

    return (
        <div className="bg-black min-h-screen">
            <ServicesClient allServices={allServices || []} />
        </div>
    );
}





