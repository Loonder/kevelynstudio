import { ServiceForm } from "@/components/admin/services/service-form";
import { supabase } from "@/lib/supabase-client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (error || !service) {
        notFound();
    }

    // Map Supabase fields to the format expected by ServiceForm
    const mappedService = {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        durationMinutes: service.duration_minutes,
        category: service.category,
        imageUrl: service.image_url,
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-serif text-white mb-2">Editar Serviço</h2>
                <p className="text-white/50">Atualize as informações do procedimento.</p>
            </header>
            <ServiceForm initialData={mappedService as any} isEditing />
        </div>
    );
}
