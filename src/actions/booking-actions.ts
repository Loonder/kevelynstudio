"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export type BookingInput = {
    serviceId: string;
    professionalId: string;
    date: Date;
    timeSlot: string;
    clientId: string;
    phone?: string;
};

export async function createAppointment(data: BookingInput) {
    try {
        const [hours, minutes] = data.timeSlot.split(':').map(Number);
        const startTime = new Date(data.date);
        startTime.setHours(hours, minutes, 0, 0);

        // Fetch service duration
        const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('duration_minutes')
            .eq('id', data.serviceId)
            .single();

        if (serviceError || !service) throw new Error("Service not found");

        const endTime = new Date(startTime.getTime() + (service.duration_minutes * 60000));

        // 2. CHECK AVAILABILITY
        const { data: conflicts, error: conflictError } = await supabase
            .from('appointments')
            .select('id')
            .eq('professional_id', data.professionalId)
            .lt('start_time', endTime.toISOString())
            .gt('end_time', startTime.toISOString())
            .neq('status', 'cancelled')
            .limit(1);

        if (conflictError) throw conflictError;

        if (conflicts && conflicts.length > 0) {
            return { success: false, error: "Este horário já foi reservado por outra cliente. Por favor, escolha outro." };
        }

        // 3. Update phone if provided
        if (data.phone) {
            await supabase
                .from('contacts')
                .update({ phone: data.phone })
                .eq('id', data.clientId);
        }

        // 4. Create Appointment
        const { data: newAppt, error: createError } = await supabase
            .from('appointments')
            .insert({
                contact_id: data.clientId,
                professional_id: data.professionalId,
                service_id: data.serviceId,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                status: "confirmed",
                tenant_id: TENANT_ID
            })
            .select()
            .single();

        if (createError) throw createError;

        revalidatePath('/admin');
        revalidatePath('/admin/calendar');
        return { success: true, appointmentId: newAppt.id };

    } catch (error) {
        console.error("[Booking] Error:", error);
        return { success: false, error: "Falha ao criar agendamento." };
    }
}

export async function updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', appointmentId)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath('/admin/calendar');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Falha ao atualizar status." };
    }
}




