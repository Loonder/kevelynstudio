
import { db } from "../src/lib/db";
import { clients } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function makeAdmin(email: string) {
    console.log(`👑 Making ${email} an Admin...`);
    try {
        const client = await db.query.clients.findFirst({
            where: eq(clients.email, email)
        });

        if (client) {
            await db.update(clients)
                .set({ role: 'admin' })
                .where(eq(clients.email, email));
            console.log("✅ User promoted to Admin!");
        } else {
            console.log("⚠️ User not found. Creating placeholder admin...");
            await db.insert(clients).values({
                fullName: "Paulo Moraes",
                email: email,
                phone: "000000000",
                role: 'admin'
            });
            console.log("✅ Admin user created!");
        }
        process.exit(0);
    } catch (e) {
        console.error("❌ Failed:", e);
        process.exit(1);
    }
}

makeAdmin("paulomoraes1802@gmail.com");



