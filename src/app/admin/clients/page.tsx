
import { getClients } from "@/actions/client-actions";
import ClientsClient from "./ClientsClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
    const leads = await getClients();
    return <ClientsClient initialLeads={leads} />;
}





