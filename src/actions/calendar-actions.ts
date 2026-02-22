"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

// --- HELPER: Conflict Detection ---
async function checkOverlap(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
) {
    let query = supabase
        .from('appointments')
        .select('id')
        .eq('professional_id', professionalId)
        .lt('start_time', endTime.toISOString())
        .gt('end_time', startTime.toISOString())
        .neq('status', 'cancelled')
        .eq('tenant_id', TENANT_ID);

    if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
        console.error("Overlap Check Error:", error);
        return false;
    }

    return data && data.length > 0;
}

export async function rescheduleAppointment(
    appointmentId: string,
    newStartTime: Date | string,
    newEndTime?: Date | string,
    professionalId?: string | null
) {
    try {
        const start = new Date(newStartTime);
        let end = newEndTime ? new Date(newEndTime) : null;

        // 1. Fetch current appointment
        const { data: currentAppt, error: fetchError } = await supabase
            .from('appointments')
            .select('*, services(*)')
            .eq('id', appointmentId)
            .single();

        if (fetchError || !currentAppt) return { success: false, error: "Agendamento não encontrado." };

        const targetProfId = professionalId || currentAppt.professional_id;

        if (!end) {
            const duration = currentAppt.services?.duration_minutes || 60;
            end = new Date(start.getTime() + duration * 60000);
        }

        if (end <= start) {
            return { success: false, error: "Horário de término deve ser após o horário de início." };
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDay < today) {
            return { success: false, error: "Não é possível agendar no passado." };
        }

        const hasConflict = await checkOverlap(targetProfId, start, end, appointmentId);

        if (hasConflict) {
            return { success: false, error: "Conflito de horário! A profissional já possui agendamento neste período." };
        }

        const { error: updateError } = await supabase
            .from('appointments')
            .update({
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                professional_id: targetProfId,
                status: 'confirmed'
            })
            .eq('id', appointmentId)
            .eq('tenant_id', TENANT_ID);

        if (updateError) throw updateError;

        revalidatePath('/admin/calendar');
        return { success: true, newEnd: end };
    } catch (error) {
        console.error("Reschedule Error:", error);
        return { success: false, error: "Erro interno ao reagendar." };
    }
}

export async function deleteAppointment(appointmentId: string) {
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointmentId)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
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
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

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
    endTime?: Date | string;
}) {
    try {
        const start = new Date(data.startTime);
        let end: Date;

        if (data.endTime) {
            end = new Date(data.endTime);
        } else {
            const { data: svc, error: svcError } = await supabase
                .from('services')
                .select('duration_minutes')
                .eq('id', data.serviceId)
                .single();

            if (svcError || !svc) return { success: false, error: "Serviço não encontrado." };

            const duration = svc.duration_minutes || 60;
            end = new Date(start.getTime() + duration * 60000);
        }

        if (end <= start) return { success: false, error: "Horário de término deve ser após o horário de início." };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDay < today) return { success: false, error: "Não é possível agendar no passado." };

        const hasConflict = await checkOverlap(data.professionalId, start, end);

        if (hasConflict) {
            return { success: false, error: "Este profissional já possui um atendimento neste horário." };
        }

        const { error: insertError } = await supabase
            .from('appointments')
            .insert({
                contact_id: data.clientId,
                professional_id: data.professionalId,
                service_id: data.serviceId,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'confirmed',
                tenant_id: TENANT_ID
            });

        if (insertError) throw insertError;

        revalidatePath('/admin/calendar');
        return { success: true };
    } catch (error) {
        console.error("Create Appointment Error:", error);
        return { success: false, error: "Falha ao criar agendamento." };
    }
}




