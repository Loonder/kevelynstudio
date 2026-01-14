
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

async function checkUser() {
    const targetEmail = process.argv[2];

    if (!targetEmail) {
        console.error("❌ Please provide an email address.");
        process.exit(1);
    }

    console.log(`🔍 Checking status for: ${targetEmail}...`);

    try {
        // 1. Check public.clients
        const client = await db.query.clients.findFirst({
            where: eq(clients.email, targetEmail),
        });

        console.log("\n--- PUBLIC CLIENTS TABLE ---");
        if (client) {
            console.log(`✅ Found Client:`);
            console.log(`   ID: ${client.id}`);
            console.log(`   Role: ${client.role}`);
            console.log(`   AuthUserID: ${client.authUserId}`);
        } else {
            console.log("❌ Client NOT FOUND in public profile.");
        }

        // 2. Check auth.users (Raw SQL)
        console.log("\n--- AUTH.USERS TABLE ---");
        const authUsers = await db.execute(sql`
            SELECT id, email, email_confirmed_at, encrypted_password 
            FROM auth.users 
            WHERE email = ${targetEmail}
        `);

        if (authUsers.length > 0) {
            const user = authUsers[0];
            console.log(`✅ Found Auth User:`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Confirmed At: ${user.email_confirmed_at ? user.email_confirmed_at : '❌ UNCONFIRMED'}`);
            console.log(`   Has Password: ${user.encrypted_password ? '✅ Yes' : '❌ No'}`);
        } else {
            console.log("❌ User NOT FOUND in Supabase Auth.");
        }

    } catch (error) {
        console.error("❌ Error checking user:", error);
    }
}

checkUser();
