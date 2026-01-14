"use server";

import { db } from "@/lib/db";
import { appointments, clients, services, professionals } from "@/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    try {
        const results = await db
            .select({
                id: appointments.id,
                startTime: appointments.startTime,
                status: appointments.status,
                client: {
                    id: clients.id,
                    fullName: clients.fullName,
                    sensoryPreferences: clients.sensoryPreferences,
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

        return { data: results };
    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        return { error: "Failed to fetch appointments." };
    }
}

export async function updateAppointmentStatus(id: string, status: "confirmed" | "completed" | "cancelled") {
    try {
        await db.update(appointments)
            .set({ status })
            .where(eq(appointments.id, id));

        revalidatePath("/(reception)/dashboard");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status." };
    }
}
