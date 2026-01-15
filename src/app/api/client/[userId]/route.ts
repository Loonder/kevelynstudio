import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await db.query.clients.findFirst({
            where: eq(clients.authUserId, userId),
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
        });
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
