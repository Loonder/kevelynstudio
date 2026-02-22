import { NextResponse } from "next/server";
import { AvailabilityService } from "@/services/availability-service";
import { db } from "@/lib/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, professionalId, serviceId } = body;

        if (!date || !professionalId || !serviceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch service duration
        const service = await db.query.services.findFirst({
            where: eq(services.id, serviceId)
        });

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const slots = await AvailabilityService.getSlots(
            date,
            professionalId,
            service.durationMinutes
        );

        return NextResponse.json({ slots });

    } catch (error) {
        console.error("Availability API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





