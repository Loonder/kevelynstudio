"use server";

import { supabase } from "@/lib/supabase-client";
import { addMinutes, startOfDay, endOfDay, isBefore, areIntervalsOverlapping } from "date-fns";

// Types
type Slot = {
    start: Date;
    end: Date;
    score: number; // 0-100 (100 = perfect fit)
    reason: string;
};

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

// 1. Check Conflicts
export async function checkConflicts(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
) {
    const dayStart = startOfDay(startTime);
    const dayEnd = endOfDay(startTime);

    const { data: existingApps, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('tenant_id', TENANT_ID)
        .gte('start_time', dayStart.toISOString())
        .lt('start_time', dayEnd.toISOString());

    if (error) {
        console.error("Check Conflicts Error:", error);
        return true; // Assume conflict on error
    }

    const hasConflict = (existingApps || []).some(app => {
        if (excludeAppointmentId && app.id === excludeAppointmentId) return false;

        return areIntervalsOverlapping(
            { start: new Date(app.start_time), end: new Date(app.end_time) },
            { start: startTime, end: endTime }
        );
    });

    return hasConflict;
}

// 2. Find Smart Slots (Tetris Algorithm)
export async function findSmartSlots(
    serviceId: string,
    professionalId: string,
    date: Date
): Promise<Slot[]> {
    // Fetch Service
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (serviceError || !service) throw new Error("Service not found");
    const durationBtn = service.duration_minutes;
    const buffer = 5;
    const totalDuration = durationBtn + buffer;

    // Work Hours
    const workStart = new Date(date);
    workStart.setHours(9, 0, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(19, 0, 0, 0);

    // Fetch existing
    const { data: existingApps, error: appsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('tenant_id', TENANT_ID)
        .gte('start_time', startOfDay(date).toISOString())
        .lt('start_time', endOfDay(date).toISOString())
        .order('start_time', { ascending: true });

    if (appsError) throw appsError;

    // Find Gaps
    const freeRanges: { start: Date, end: Date }[] = [];
    let lasEndTime = workStart;

    (existingApps || []).forEach(app => {
        const appStart = new Date(app.start_time);
        const appEnd = new Date(app.end_time);

        if (isBefore(lasEndTime, appStart)) {
            freeRanges.push({ start: lasEndTime, end: appStart });
        }
        lasEndTime = appEnd > lasEndTime ? appEnd : lasEndTime;
    });

    if (isBefore(lasEndTime, workEnd)) {
        freeRanges.push({ start: lasEndTime, end: workEnd });
    }

    // Generate Slots from Gaps
    const slots: Slot[] = [];
    const STEP_MIN = 15;

    for (const range of freeRanges) {
        let runner = new Date(range.start);

        while (isBefore(addMinutes(runner, totalDuration), range.end) ||
            addMinutes(runner, totalDuration).getTime() === range.end.getTime()) {

            const slotStart = new Date(runner);
            const slotEnd = addMinutes(slotStart, durationBtn);

            // SCORING LOGIC
            let score = 50;
            let reason = "Available";

            if (slotStart.getTime() === range.start.getTime()) {
                score += 25;
                reason = "Perfect Fit (No gap before)";
            }

            const finishTime = addMinutes(slotStart, totalDuration);
            if (finishTime.getTime() === range.end.getTime()) {
                score += 25;
                reason = "Perfect Fit (No gap after)";
            }

            if (slotStart.getHours() === 9 && slotStart.getMinutes() === 0) score += 10;

            slots.push({
                start: slotStart,
                end: slotEnd,
                score,
                reason
            });

            runner = addMinutes(runner, STEP_MIN);
        }
    }

    return slots.sort((a, b) => b.score - a.score);
}
