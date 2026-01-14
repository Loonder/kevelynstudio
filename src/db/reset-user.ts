
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

async function resetUser() {
    const targetEmail = process.argv[2];

    if (!targetEmail) {
        console.error("❌ Please provide an email address.");
        process.exit(1);
    }

    console.log(`🗑️  DELETING User: ${targetEmail}...`);

    try {
        // 1. Delete from public.clients
        await db.delete(clients).where(eq(clients.email, targetEmail));
        console.log("... Deleted from public.clients");

        // 2. Delete from auth.users (Raw SQL)
        await db.execute(sql`
            DELETE FROM auth.users WHERE email = ${targetEmail}
        `);
        console.log("... Deleted from auth.users");

        console.log("✅ User DELETE successful.");
        console.log("👉 You can now REGISTER again with this email.");

    } catch (error) {
        console.error("❌ Error deleting user:", error);
    }
}

resetUser();
