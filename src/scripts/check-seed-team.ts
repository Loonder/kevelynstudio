import { db } from "@/lib/db";
import { professionals } from "@/db/schema";
import { count } from "drizzle-orm";

async function seed() {
    const proCount = await db.select({ count: count() }).from(professionals);
    console.log("Current Professionals:", proCount[0].count);

    if (Number(proCount[0].count) === 0) {
        console.log("Seeding Professionals...");
        await db.insert(professionals).values([
            {
                name: "Kevelyn Soares",
                slug: "kevelyn-soares",
                role: "Founder & Master Artist",
                bio: "Especialista em micropigmentação de alta performance e design de olhar. Fundadora do Kevelyn Studio, dedicada a realçar a beleza natural com técnicas exclusivas.",
                imageUrl: "/assets/images/team-kevelyn.jpg", // Placeholder path
                instagramHandle: "@kevelynstudio"
            },
            {
                name: "Beatriz Silva",
                slug: "beatriz-silva",
                role: "Lash Designer",
                bio: "Apaixonada por extensão de cílios, Beatriz domina as técnicas mais avançadas de volume e visagismo para criar olhares marcantes.",
                imageUrl: "/assets/images/team-bea.jpg", // Placeholder path
                instagramHandle: "@bea.lashes"
            },
            {
                name: "Larissa Costa",
                slug: "larissa-costa",
                role: "Brow Expert",
                bio: "Especialista em design de sobrancelhas e Brow Lamination. Focada em harmonização facial e reconstrução de sobrancelhas.",
                imageUrl: "/assets/images/team-lari.jpg", // Placeholder path
                instagramHandle: "@lari.brows"
            }
        ]);
        console.log("Seeding Complete!");
    } else {
        console.log("Professionals already exist. Skipping seed.");
    }
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
