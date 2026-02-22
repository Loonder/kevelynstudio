import { getServices } from "@/actions/settings-actions";
import ServicesSettingsPage from "@/components/admin/settings/services-page-client";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const res = await getServices();

    if (!res.success) {
        return <div className="text-red-500">Erro ao carregar serviços.</div>;
    }

    return <ServicesSettingsPage services={res.data || []} />;
}





