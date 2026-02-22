import { NextResponse } from "next/server";
import { AvailabilityService } from "@/services/availability-service";
import { supabase } from "@/lib/supabase-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, professionalId, serviceId } = body;

        if (!date || !professionalId || !serviceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch service duration
        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', serviceId)
            .eq('tenant_id', TENANT_ID)
            .single();

        if (error || !service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const slots = await AvailabilityService.getSlots(
            date,
            professionalId,
            service.duration_minutes
        );

        return NextResponse.json({ slots });

    } catch (error) {
        console.error("Availability API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





