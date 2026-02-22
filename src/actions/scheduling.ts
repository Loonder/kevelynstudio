
"use server";

import { db } from "../lib/db";
import { appointments, services, professionals } from "../db/schema";
import { eq, and, gte, lt, or } from "drizzle-orm";
import { addMinutes, startOfDay, endOfDay, isBefore, isAfter, areIntervalsOverlapping } from "date-fns";

// Types
type Slot = {
    start: Date;
    end: Date;
    score: number; // 0-100 (100 = perfect fit)
    reason: string;
};

// 1. Check Conflicts
export async function checkConflicts(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
) {
    // Find appointments that overlap with [startTime, endTime)
    // Overlap if: (StartA < EndB) and (EndA > StartB)

    // SQLite dates are stored as timestamps (integers) or strings depending on config.
    // Drizzle handles this if configured correctly.

    // For safety, we fetch relevant day's appointments and filter in memory if volume is low, 
    // or use SQL between.

    const dayStart = startOfDay(startTime);
    const dayEnd = endOfDay(startTime);

    const existingApps = await db.query.appointments.findMany({
        where: and(
            eq(appointments.professionalId, professionalId),
            gte(appointments.startTime, dayStart),
            lt(appointments.startTime, dayEnd)
        )
    });

    const hasConflict = existingApps.some(app => {
        if (excludeAppointmentId && app.id === excludeAppointmentId) return false;

        return areIntervalsOverlapping(
            { start: app.startTime, end: app.endTime },
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
    const service = await db.query.services.findFirst({
        where: eq(services.id, serviceId)
    });

    if (!service) throw new Error("Service not found");
    const durationBtn = service.durationMinutes;
    // Add buffer? Let's say 5 min cleanup
    const buffer = 5;
    const totalDuration = durationBtn + buffer;

    // Work Hours (Hardcoded for now, could be dynamic)
    const workStart = new Date(date);
    workStart.setHours(9, 0, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(19, 0, 0, 0); // 7 PM

    // Fetch existing
    const existingApps = await db.query.appointments.findMany({
        where: and(
            eq(appointments.professionalId, professionalId),
            gte(appointments.startTime, startOfDay(date)),
            lt(appointments.startTime, endOfDay(date))
        ),
        orderBy: (appointments, { asc }) => [asc(appointments.startTime)]
    });

    // Find Gaps
    const freeRanges: { start: Date, end: Date }[] = [];
    let lasEndTime = workStart;

    existingApps.forEach(app => {
        if (isBefore(lasEndTime, app.startTime)) {
            freeRanges.push({ start: lasEndTime, end: app.startTime });
        }
        lasEndTime = app.endTime > lasEndTime ? app.endTime : lasEndTime;
    });

    if (isBefore(lasEndTime, workEnd)) {
        freeRanges.push({ start: lasEndTime, end: workEnd });
    }

    // Generate Slots from Gaps
    const slots: Slot[] = [];
    const STEP_MIN = 15;

    for (const range of freeRanges) {
        let runner = new Date(range.start);

        // While runner + duration <= range.end
        while (isBefore(addMinutes(runner, totalDuration), range.end) ||
            addMinutes(runner, totalDuration).getTime() === range.end.getTime()) {

            const slotStart = new Date(runner);
            const slotEnd = addMinutes(slotStart, durationBtn); // Actual Service End
            // The slot technically consumes 'totalDuration' (service + buffer)

            // SCORING LOGIC
            let score = 50;
            let reason = "Available";

            // 1. Is it flush with previous app? (Start of range)
            if (slotStart.getTime() === range.start.getTime()) {
                score += 25;
                reason = "Perfect Fit (No gap before)";
            }

            // 2. Is it flush with next app? (End of service+buffer matches Range End)
            const finishTime = addMinutes(slotStart, totalDuration);
            if (finishTime.getTime() === range.end.getTime()) {
                score += 25;
                reason = "Perfect Fit (No gap after)";
            }

            // 3. Is it flush with Start of Day or End of Day? also good.
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

    // Return sorted by Score (High to Low)
    return slots.sort((a, b) => b.score - a.score);
}





