
import { db } from "@/lib/db";
import { clients, appointments, services } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getAdminStats() {
    // 1. Clients/Leads
    const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt));
    const activeClientsCount = allClients.length;

    // 2. Revenue (Mock logic based on confirmed appointments or just random seeded data if none)
    // In a real scenario, sum up 'totalAmount' from 'appointments' where status='completed'
    // For now, let's just count appointments * average ticket or use a mock if table is empty
    const allAppointments = await db.select().from(appointments);
    const completedApps = allAppointments.filter(a => a.status === 'completed');

    // Calculate simulated revenue if no real data (since we just seeded services, maybe no appointments yet)
    let revenue = 0;
    if (completedApps.length > 0) {
        revenue = completedApps.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0) / 100;
    } else {
        // Fallback for "Demo Mode" visualization
        revenue = 42900;
    }

    // 3. Conversion Rate (Calculated: Leads -> Appointments)
    const conversionRate = allClients.length > 0
        ? `${((allAppointments.length / allClients.length) * 100).toFixed(1)}%`
        : "0%";

    return {
        activeClients: activeClientsCount,
        recentLeads: allClients.slice(0, 5).map(c => ({
            name: c.fullName,
            phone: c.phone,
            status: "Novo", // Default status
            created_at: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString()
        })),
        revenue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenue),
        conversionRate
    };
}






