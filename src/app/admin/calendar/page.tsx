import { db } from "@/lib/db";
import { appointments, clients, services, professionals } from "@/db/schema";
import { eq, gte, lte, and } from "drizzle-orm";
import { startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { AdminCalendar } from "@/components/admin/calendar/admin-calendar";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    // 1. Fetch Professionals (Resources)
    const staff = await db.query.professionals.findMany({
        where: eq(professionals.isActive, true)
    });

    const resources = staff.map(pro => ({
        id: pro.id,
        title: pro.name,
        name: pro.name // Ensure 'name' exists for CreateModal compatible type
    }));

    // 2. Fetch Clients & Services for Create Modal
    const allClients = await db.query.clients.findMany();
    const allServices = await db.query.services.findMany();

    // 3. Fetch Appointments 
    const today = new Date();
    const startRange = subMonths(startOfMonth(today), 2);
    const endRange = addMonths(endOfMonth(today), 6);

    const data = await db.select({
        id: appointments.id,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        status: appointments.status,
        clientName: clients.fullName,
        serviceTitle: services.title,
        serviceCategory: services.category,
        professionalId: appointments.professionalId,
        professionalColor: professionals.color,
    })
        .from(appointments)
        .innerJoin(clients, eq(appointments.clientId, clients.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
        .where(and(
            gte(appointments.startTime, startRange),
            lte(appointments.startTime, endRange)
        ));

    // 4. Transform Data for Calendar
    const events = data.map(appt => ({
        id: appt.id,
        title: `${appt.clientName} - ${appt.serviceTitle}`,
        start: appt.startTime,
        end: appt.endTime,
        resourceId: appt.professionalId,
        status: appt.status,
        // Custom props for styling
        color: appt.professionalColor,
        category: appt.serviceCategory, // 'Lashes', 'Brows', etc.
        clientName: appt.clientName,
        serviceTitle: appt.serviceTitle,
    }));

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex-1">
                <AdminCalendar
                    initialEvents={events}
                    resources={resources}
                    clients={allClients}
                    services={allServices}
                    defaultDate={today}
                />
            </div>
        </div>
    );
}
