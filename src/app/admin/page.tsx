
import { getAdminStats } from "./server-actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const stats = await getAdminStats();

    return <DashboardClient initialStats={stats} />;
}





