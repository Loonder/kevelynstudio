
import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

async function promoteToAdmin() {
    // CHANGE THIS EMAIL to the one the user actually registered with
    const targetEmail = process.argv[2];

    if (!targetEmail) {
        console.error("❌ Please provide an email address as an argument.");
        console.error("Usage: npx tsx src/db/promote-admin.ts <email>");
        process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${targetEmail}...`);

    try {
        const client = await db.query.clients.findFirst({
            where: eq(clients.email, targetEmail)
        });

        if (!client) {
            console.error(`❌ User not found! Make sure you have registered first.`);
            process.exit(1);
        }

        await db.update(clients)
            .set({ role: 'admin' })
            .where(eq(clients.email, targetEmail));

        console.log(`✅ SUCCESS! User '${client.fullName}' (${targetEmail}) is now an ADMIN.`);
    } catch (error) {
        console.error("❌ Error promoting user:", error);
    }
}

promoteToAdmin();
