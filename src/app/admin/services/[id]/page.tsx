
import { ServiceForm } from "@/components/admin/services/service-form";
import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const service = await db.query.services.findFirst({
        where: eq(services.id, id)
    });

    if (!service) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-serif text-white mb-2">Editar Serviço</h2>
                <p className="text-white/50">Atualize as informações do procedimento.</p>
            </header>
            <ServiceForm initialData={service as any} isEditing />
        </div>
    );
}
