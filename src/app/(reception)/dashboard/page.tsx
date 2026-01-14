import { db } from "@/lib/db";
import { appointments, clients, services, professionals } from "@/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { ReceptionClient, type Appointment } from "@/app/(reception)/dashboard/reception-client";

export default async function ReceptionDashboard() {
    let appointmentsData: any[] = [];

    try {
        // Brazil Time Logic
        const now = new Date();
        const brazilOffset = -3;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const brazilTime = new Date(utc + (3600000 * brazilOffset));

        const startOfTodayBR = new Date(brazilTime);
        startOfTodayBR.setHours(0, 0, 0, 0);

        // Convert back to UTC for DB query
        const today = new Date(startOfTodayBR.getTime() + (3 * 60 * 60 * 1000));
        const tonight = new Date(today.getTime() + (24 * 60 * 60 * 1000) - 1);

        const results = await db
            .select({
                id: appointments.id,
                startTime: appointments.startTime,
                status: appointments.status,
                client: {
                    id: clients.id,
                    fullName: clients.fullName,
                    sensoryPreferences: clients.sensoryPreferences,
                    technicalNotes: clients.technicalNotes,
                },
                service: {
                    title: services.title,
                },
                professional: {
                    name: professionals.name,
                }
            })
            .from(appointments)
            .innerJoin(clients, eq(appointments.clientId, clients.id))
            .innerJoin(services, eq(appointments.serviceId, services.id))
            .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
            .where(
                and(
                    gte(appointments.startTime, today),
                    lte(appointments.startTime, tonight)
                )
            )
            .orderBy(asc(appointments.startTime));

        appointmentsData = results;
    } catch (error) {
        console.error("Reception data fetch error:", error);
    }

    const serializedAppointments = appointmentsData.map(appt => ({
        ...appt,
        startTime: appt.startTime instanceof Date ? appt.startTime.toISOString() : appt.startTime,
    }));

    return <ReceptionClient appointments={serializedAppointments} />;
}
