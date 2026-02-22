import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase-client";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const supabaseServer = await createClient();
        const { data: { user } } = await supabaseServer.auth.getUser();

        if (!user || user.id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: contact, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('auth_user_id', userId)
            .eq('tenant_id', TENANT_ID)
            .maybeSingle();

        if (error || !contact) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: contact.id,
            fullName: contact.name,
            email: contact.email,
            phone: contact.phone,
        });
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
