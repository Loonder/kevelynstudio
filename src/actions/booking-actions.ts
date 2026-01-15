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
    clientId: string; // Now we expect authenticated client ID
    phone?: string; // Optional phone update
};

export async function createAppointment(data: BookingInput) {
    try {
        // 1. Calculate Start/End Time
        const [hours, minutes] = data.timeSlot.split(':').map(Number);

        const startTime = new Date(data.date);
        startTime.setHours(hours, minutes, 0, 0);

        // Fetch service duration
        const service = await db.query.services.findFirst({
            where: eq(services.id, data.serviceId)
        });

        if (!service) throw new Error("Service not found");

        const endTime = new Date(startTime.getTime() + (service.durationMinutes * 60000));

        // 2. CHECK AVAILABILITY (Conflict Detection)
        const conflict = await db.query.appointments.findFirst({
            where: and(
                eq(appointments.professionalId, data.professionalId),
                lt(appointments.startTime, endTime),
                gt(appointments.endTime, startTime),
                ne(appointments.status, 'cancelled')
            )
        });

        if (conflict) {
            return { success: false, error: "Este horário já foi reservado por outra cliente. Por favor, escolha outro." };
        }

        // 3. Update phone if provided
        if (data.phone) {
            await db.update(clients)
                .set({ phone: data.phone })
                .where(eq(clients.id, data.clientId));
        }

        // 4. Create Appointment
        const newAppointment = await db.insert(appointments).values({
            clientId: data.clientId,
            professionalId: data.professionalId,
            serviceId: data.serviceId,
            startTime,
            endTime,
            status: "confirmed",
        }).returning();

        // Revalidate admin dashboard
        revalidatePath('/admin');
        revalidatePath('/(reception)/dashboard');
        revalidatePath('/my-appointments');

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
