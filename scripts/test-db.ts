
import { db } from "../src/lib/db";
import { services } from "../src/db/schema";

async function main() {
    console.log("🚀 Testing Service Creation...");
    try {
        const result = await db.insert(services).values({
            title: "Test Service Script",
            description: "Created via script to test DB connection",
            price: 15000,
            durationMinutes: 60,
            category: "Lashes",
            imageUrl: "",
        }).returning();

        console.log("✅ Service Created Successfully:", result);
        process.exit(0);
    } catch (error) {
        console.error("❌ Service Creation Failed:", error);
        process.exit(1);
    }
}

main();
