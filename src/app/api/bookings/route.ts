import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { createClient } from "@/lib/supabase/server";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientData, appointmentData, sensoryData } = body;

        // Auth Check
        const supabaseServer = await createClient();
        const { data: { user } } = await supabaseServer.auth.getUser();

        // 1. Find or Create Contact
        let contactId: string;
        let existingContact = null;

        if (user) {
            // Try to find by Auth ID or Email
            const { data } = await supabase
                .from('contacts')
                .select('*')
                .eq('tenant_id', TENANT_ID)
                .or(`auth_user_id.eq.${user.id},email.eq.${clientData.email}`)
                .maybeSingle();
            existingContact = data;
        } else {
            // Try to find by Email or Phone
            const { data } = await supabase
                .from('contacts')
                .select('*')
                .eq('tenant_id', TENANT_ID)
                .or(`email.eq.${clientData.email},phone.eq.${clientData.phone}`)
                .maybeSingle();
            existingContact = data;
        }

        if (existingContact) {
            contactId = existingContact.id;
            const updateData: any = {
                name: clientData.name,
                phone: clientData.phone,
                sensory_preferences: {
                    favoriteMusic: sensoryData.musicGenre,
                    drinkPreference: sensoryData.drink
                }
            };

            if (user && !existingContact.auth_user_id) {
                updateData.auth_user_id = user.id;
            }

            await supabase
                .from('contacts')
                .update(updateData)
                .eq('id', contactId);
        } else {
            const { data: newContact, error: insertError } = await supabase
                .from('contacts')
                .insert({
                    name: clientData.name,
                    email: clientData.email,
                    phone: clientData.phone,
                    auth_user_id: user ? user.id : null,
                    tenant_id: TENANT_ID,
                    sensory_preferences: {
                        favoriteMusic: sensoryData.musicGenre,
                        drinkPreference: sensoryData.drink
                    }
                })
                .select()
                .single();

            if (insertError) throw insertError;
            contactId = newContact.id;
        }

        // 2. Create Appointment
        const startTime = new Date(appointmentData.date);
        // Default 60 mins if not specified
        const endTime = new Date(startTime.getTime() + 60 * 60000);

        const { data: newAppointment, error: apptError } = await supabase
            .from('appointments')
            .insert({
                contact_id: contactId,
                professional_id: appointmentData.professionalId,
                service_id: appointmentData.serviceId,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                status: 'pending',
                tenant_id: TENANT_ID
            })
            .select()
            .single();

        if (apptError) throw apptError;

        return NextResponse.json({ success: true, appointment: newAppointment });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}





