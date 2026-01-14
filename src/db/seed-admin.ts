
import { db } from "@/lib/db";
import { clients } from "@/db/schema";

async function seedAdmin() {
    const adminEmail = "admin@kevelynstudio.com";

    console.log(`Seeding Admin: ${adminEmail} ...`);

    try {
        await db.insert(clients).values({
            fullName: "Super Admin",
            email: adminEmail,
            phone: "11999999999",
            role: "admin",
            notes: "Conta administrativa padrão.",
            technicalNotes: "Acesso total ao sistema."
        }).onConflictDoUpdate({
            target: clients.email,
            set: {
                role: 'admin' // Force role to admin if exists
            }
        });

        console.log("✅ Admin seeded successfully!");
        console.log("👉 ACTION REQUIRED: Register a new account with 'admin@kevelynstudio.com' to claim this admin profile.");
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
}

seedAdmin();
