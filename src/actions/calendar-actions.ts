"use server";

import { db } from "@/lib/db";
import { appointments, services } from "@/db/schema";
import { eq, and, or, lt, gt, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- HELPER: Conflict Detection ---
async function checkOverlap(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
) {
    const conflicts = await db.query.appointments.findFirst({
        where: and(
            eq(appointments.professionalId, professionalId),
            // Overlap logic: (StartA < EndB) AND (EndA > StartB)
            // SQL: start_time < newEnd AND end_time > newStart
            and(
                lt(appointments.startTime, endTime),
                gt(appointments.endTime, startTime)
            ),
            // Exclude current appointment if resizing/moving
            excludeAppointmentId ? ne(appointments.id, excludeAppointmentId) : undefined,
            // Only count active appointments
            ne(appointments.status, 'cancelled')
        )
    });

    return !!conflicts;
}

export async function rescheduleAppointment(
    appointmentId: string,
    newStartTime: Date | string,
    newEndTime?: Date | string, // Optional now, can be calculated
    professionalId?: string | null
) {
    try {
        const start = new Date(newStartTime);
        let end = newEndTime ? new Date(newEndTime) : null;

        // 1. Fetch current appointment to get professional/service details if missing
        const currentAppt = await db.query.appointments.findFirst({
            where: eq(appointments.id, appointmentId),
            with: { service: true }
        });

        if (!currentAppt) return { success: false, error: "Agendamento não encontrado." };

        // 2. Determine Professional ID (New or Existing)
        const targetProfId = professionalId || currentAppt.professionalId;

        // 3. Calculate End Time if not provided (Safety Rule)
        if (!end) {
            // Ensure we use the service duration
            const duration = currentAppt.service.durationMinutes || 60; // Default 60 if missing
            end = new Date(start.getTime() + duration * 60000);
        }

        // 4. VALIDATION: End must be after Start
        if (end <= start) {
            return {
                success: false,
                error: "Horário de término deve ser após o horário de início."
            };
        }

        // 5. VALIDATION: Cannot schedule in the past
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDay < today) {
            return {
                success: false,
                error: "Não é possível agendar no passado."
            };
        }

        // 6. SECURITY: Check Overlap
        const hasConflict = await checkOverlap(targetProfId, start, end, appointmentId);

        if (hasConflict) {
            return {
                success: false,
                error: "Conflito de horário! A profissional já possui agendamento neste período."
            };
        }

        // 5. Update DB
        await db.update(appointments)
            .set({
                startTime: start,
                endTime: end,
                professionalId: targetProfId,
                status: 'confirmed' // Auto-confirm on admin move
            })
            .where(eq(appointments.id, appointmentId));

        revalidatePath('/admin/calendar');
        return { success: true, newEnd: end }; // Return calculated end for UI update
    } catch (error) {
        console.error("Reschedule Error:", error);
        return { success: false, error: "Erro interno ao reagendar." };
    }
}

export async function deleteAppointment(appointmentId: string) {
    try {
        await db.delete(appointments).where(eq(appointments.id, appointmentId));
        revalidatePath('/admin/calendar');
        return { success: true };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, error: "Falha ao excluir." };
    }
}

export async function updateAppointmentStatus(
    id: string,
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show'
) {
    try {
        await db.update(appointments)
            .set({ status })
            .where(eq(appointments.id, id));

        revalidatePath('/admin/calendar');
        return { success: true };
    } catch (error) {
        console.error("Status Update Error:", error);
        return { success: false, error: "Falha ao atualizar status." };
    }
}

export async function createAppointment(data: {
    clientId: string;
    professionalId: string;
    serviceId: string;
    startTime: Date | string;
    endTime?: Date | string; // Optional: if provided from calendar drag, use it instead of calculating
}) {
    try {
        const start = new Date(data.startTime);

        // 1. Determine End Time
        let end: Date;

        if (data.endTime) {
            // Use provided endTime from calendar drag
            end = new Date(data.endTime);
        } else {
            // Calculate from service duration
            const service = await db.query.services.findFirst({
                where: eq(services.id, data.serviceId)
            });

            if (!service) {
                return { success: false, error: "Serviço não encontrado." };
            }

            const duration = service.durationMinutes || 60;
            end = new Date(start.getTime() + duration * 60000);
        }

        // 2. VALIDATION: End must be after Start
        if (end <= start) {
            return {
                success: false,
                error: "Horário de término deve ser após o horário de início."
            };
        }

        // 3. VALIDATION: Cannot schedule in the past
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDay < today) {
            return {
                success: false,
                error: "Não é possível agendar no passado."
            };
        }

        // 4. CRITICAL: Check Overlap
        const hasConflict = await checkOverlap(data.professionalId, start, end);

        if (hasConflict) {
            return {
                success: false,
                error: "Este profissional já possui um atendimento neste horário."
            };
        }

        // 4. Insert
        await db.insert(appointments).values({
            clientId: data.clientId,
            professionalId: data.professionalId,
            serviceId: data.serviceId,
            startTime: start,
            endTime: end,
            status: 'confirmed',
        });

        revalidatePath('/admin/calendar');
        return { success: true };
    } catch (error) {
        console.error("Create Appointment Error:", error);
        return { success: false, error: "Falha ao criar agendamento." };
    }
}