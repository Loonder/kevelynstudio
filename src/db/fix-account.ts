
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

async function fixAccount() {
    const targetEmail = process.argv[2];

    if (!targetEmail) {
        console.error("❌ Please provide an email address.");
        console.error("Usage: npx tsx src/db/fix-account.ts <email>");
        process.exit(1);
    }

    console.log(`🔧 Fixing account for: ${targetEmail}...`);

    try {
        // 1. Force Email Confirmation in Supabase Auth (Raw SQL because Drizzle doesn't map auth schema by default)
        // We assume the DB connection has permissions to write to auth.users (usually true for connection poolers/direct URL)
        console.log("... Confirming email in auth.users");
        await db.execute(sql`
            UPDATE auth.users 
            SET email_confirmed_at = now(), updated_at = now() 
            WHERE email = ${targetEmail}
        `);

        // 2. Promote to Admin in Public Schema
        console.log("... Promoting to Admin in public.clients");

        // Find user first to ensure they exist
        const client = await db.query.clients.findFirst({
            where: eq(clients.email, targetEmail)
        });

        if (client) {
            await db.update(clients)
                .set({ role: 'admin' })
                .where(eq(clients.email, targetEmail));
            console.log("✅ Role updated to 'admin'.");
        } else {
            console.warn("⚠️ User not found in 'clients' table. They might not have finished registration logic, but Auth should be fixed.");
        }

        console.log("🎉 DONE! You can now log in directly.");

    } catch (error) {
        console.error("❌ Error fixing account:", error);
        console.error("Hint: This script requires a database connection with permissions to modify 'auth.users'.");
    }
}

fixAccount();
