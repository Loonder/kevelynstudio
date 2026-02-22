import { supabase } from "@/lib/supabase-client";
import { DateUtils } from "@/lib/date-utils";

type TimeSlot = {
    time: string;
    available: boolean;
    reason?: "booked" | "buffer" | "closed";
};

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export class AvailabilityService {
    // Hardcoded working hours for now (could be DB driven later)
    private static WORKING_HOURS = {
        start: 9, // 9:00
        end: 19,  // 19:00
    };

    static async getSlots(
        dateStr: string,
        professionalId: string,
        serviceDurationMinutes: number
    ): Promise<TimeSlot[]> {
        const date = new Date(dateStr);
        const startOfDay = DateUtils.setTime(date, this.WORKING_HOURS.start, 0);
        const endOfDay = DateUtils.setTime(date, this.WORKING_HOURS.end, 0);

        // 1. Fetch existing appointments for this pro on this day
        const { data: existingAppointments, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('professional_id', professionalId)
            .eq('tenant_id', TENANT_ID)
            .gte('start_time', startOfDay.toISOString())
            .lte('start_time', endOfDay.toISOString());

        if (error) {
            console.error("Fetch Appointments Error:", error);
            return [];
        }

        // 2. Generate all possible slots (e.g., every 30 mins)
        const slots: TimeSlot[] = [];
        let currentTime = startOfDay;

        while (currentTime < endOfDay) {
            const slotEnd = DateUtils.addMinutes(currentTime, serviceDurationMinutes);

            // Stop if service exceeds working hours
            if (slotEnd > endOfDay) break;

            let isAvailable = true;
            let reason: TimeSlot["reason"] = undefined;

            // 3. Check overlaps with internal appointments
            for (const appt of (existingAppointments || [])) {
                // Add a buffer? Let's say 10 mins buffer after every appt
                const apptEndWithBuffer = DateUtils.addMinutes(new Date(appt.end_time), 10);

                if (DateUtils.isOverlapping(currentTime, slotEnd, new Date(appt.start_time), apptEndWithBuffer)) {
                    isAvailable = false;
                    reason = "booked";
                    break;
                }
            }

            slots.push({
                time: DateUtils.formatTime(currentTime),
                available: isAvailable,
                reason
            });

            // Interval step (e.g., allow booking every 30 mins)
            currentTime = DateUtils.addMinutes(currentTime, 30);
        }

        return slots;
    }
}






