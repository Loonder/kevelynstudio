"use server";

import { db } from "@/lib/db";
import { appointments, clients, services, professionals } from "@/db/schema";
import { eq, and, gte, lte, lt, gt, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BookingInput = {
    serviceId: string;
    professionalId: string;
    date: Date;
    timeSlot: string;
    client: {
        name: string;
        email: string;
        phone: string;
        birthDate?: string; // Format YYYY-MM-DD
    };
    sensory: {
        musicGenre: string;
        drink: string;
    }
};

export async function createAppointment(data: BookingInput) {
    try {


        // 1. Calculate Start/End Time
        // timeSlot is "09:00", date is Date object
        const [hours, minutes] = data.timeSlot.split(':').map(Number);

        const startTime = new Date(data.date);
        startTime.setHours(hours, minutes, 0, 0);

        // Fetch service duration
        const service = await db.query.services.findFirst({
            where: eq(services.id, data.serviceId)
        });

        if (!service) throw new Error("Service not found");

        const endTime = new Date(startTime.getTime() + (service.durationMinutes * 60000));

        // 1.5 CHECK AVAILABILITY (Conflict Detection)
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        const conflict = await db.query.appointments.findFirst({
            where: and(
                eq(appointments.professionalId, data.professionalId),
                // New appointment starts before existing ends
                lt(appointments.startTime, endTime),
                // New appointment ends after existing starts
                gt(appointments.endTime, startTime),
                // Exclude cancelled
                ne(appointments.status, 'cancelled')
            )
        });

        if (conflict) {
            return { success: false, error: "Este horário já foi reservado por outra cliente. Por favor, escolha outro." };
        }

        // 2. Find or Create Client
        // We link by email. If exists, we update preferences.
        let clientId: string;

        const existingClient = await db.query.clients.findFirst({
            where: eq(clients.email, data.client.email)
        });

        // Parse birthDate
        const birthDate = data.client.birthDate ? new Date(data.client.birthDate) : undefined;

        if (existingClient) {
            clientId = existingClient.id;
            // Update preferences if they changed
            await db.update(clients)
                .set({
                    phone: data.client.phone,
                    birthDate: birthDate || existingClient.birthDate, // Only update if provided
                    sensoryPreferences: {
                        favoriteMusic: data.sensory.musicGenre,
                        drinkPreference: data.sensory.drink as any,
                        // We reserve other fields
                    }
                })
                .where(eq(clients.id, clientId));
        } else {
            const newClient = await db.insert(clients).values({
                fullName: data.client.name,
                email: data.client.email,
                phone: data.client.phone,
                birthDate: birthDate,
                sensoryPreferences: {
                    favoriteMusic: data.sensory.musicGenre,
                    drinkPreference: data.sensory.drink as any,
                }
            }).returning({ id: clients.id });

            clientId = newClient[0].id;
        }

        // 3. Create Appointment
        const newAppointment = await db.insert(appointments).values({
            clientId,
            professionalId: data.professionalId,
            serviceId: data.serviceId,
            startTime,
            endTime,
            status: "confirmed", // Auto-confirm for MVP demo, usually pending
        }).returning();



        // Revalidate admin dashboard so it shows up immediately
        revalidatePath('/admin');
        revalidatePath('/(reception)/dashboard');

        return { success: true, appointmentId: newAppointment[0].id };

    } catch (error) {
        console.error("[Booking] Error:", error);
        return { success: false, error: "Falha ao criar agendamento." };
    }
}

export async function updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
    try {
        await db.update(appointments)
            .set({ status })
            .where(eq(appointments.id, appointmentId));

        revalidatePath('/admin/calendar');
        revalidatePath('/admin');
        revalidatePath('/(reception)/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Falha ao atualizar status." };
    }
}
