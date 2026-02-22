import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, clients } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientData, appointmentData, sensoryData } = body;

        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Find or Create Client
        let clientId: string;

        // Determine matching strategy
        // If logged in, look for client with authUserId OR email
        // If guest, look for client with email

        let existingClient = null;

        if (user) {
            existingClient = await db.query.clients.findFirst({
                where: or(
                    eq(clients.authUserId, user.id),
                    eq(clients.email, clientData.email) // Link legacy client by email if logging in for first time
                )
            });
        } else {
            existingClient = await db.query.clients.findFirst({
                where: eq(clients.email, clientData.email)
            });
        }

        if (existingClient) {
            clientId = existingClient.id;

            // Update prefs & Link Auth ID if missing
            const updateData: any = {
                fullName: clientData.name,
                phone: clientData.phone,
                sensoryPreferences: {
                    favoriteMusic: sensoryData.musicGenre,
                    drinkPreference: sensoryData.drink
                }
            };

            // If user is logged in and client wasn't linked, link it now
            if (user && !existingClient.authUserId) {
                updateData.authUserId = user.id;
            }

            await db.update(clients)
                .set(updateData)
                .where(eq(clients.id, clientId));
        } else {
            const [newClient] = await db.insert(clients).values({
                fullName: clientData.name,
                email: clientData.email,
                phone: clientData.phone,
                authUserId: user ? user.id : null,
                sensoryPreferences: {
                    favoriteMusic: sensoryData.musicGenre,
                    drinkPreference: sensoryData.drink
                }
            }).returning();
            clientId = newClient.id;
        }

        // 2. Create Appointment
        // Calculate End Time (simplified, assuming passed data is correct)
        const startTime = new Date(appointmentData.date);
        // Mock duration for now: 60 mins
        const endTime = new Date(startTime.getTime() + 60 * 60000);

        const [newAppointment] = await db.insert(appointments).values({
            clientId: clientId,
            professionalId: appointmentData.professionalId,
            serviceId: appointmentData.serviceId,
            startTime: startTime,
            endTime: endTime,
            status: 'pending'
        }).returning();

        return NextResponse.json({ success: true, appointment: newAppointment });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}





