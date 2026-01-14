import { db } from "@/lib/db";
import { services, professionals, courses, lessons, appointments } from "@/db/schema";

const SEED_SERVICES = [
    { title: "Design de Sobrancelhas", price: 8500, durationMinutes: 45, category: "Brows", description: "Design personalizado com visagismo." },
    { title: "Lash Lifting", price: 18000, durationMinutes: 60, category: "Lashes", description: "Curvatura natural e tratamento para os fios." },
    { title: "Extensão Volume Russo", price: 25000, durationMinutes: 120, category: "Lashes", description: "Volume intenso e olhar marcante." },
    { title: "Nanopigmentação", price: 55000, durationMinutes: 150, category: "Brows", description: "Técnica ultra realista de fios." },
];

const SEED_PROS = [
    { name: "Kevelyn", role: "Master Artist", bio: "Especialista em visagismo e fundadora.", slug: "kevelyn" },
    { name: "Equipe Kevelyn Studio", role: "Junior Artist", bio: "Profissionais treinadas pela metodologia exclusiva.", slug: "team" },
];

const SEED_COURSES = [
    {
        title: "Metodologia Kevelyn Studio",
        price: 150000,
        description: "Domine a arte do olhar com a técnica que fideliza clientes de alto padrão.",
        active: true,
        lessons: [
            { title: "Postura e Atendimento", durationMinutes: 20 },
            { title: "Montando seu Espaço", durationMinutes: 45 },
            { title: "Anatomia do Fio", durationMinutes: 30 },
            { title: "Mapping Avançado", durationMinutes: 60 },
        ]
    }
];

async function main() {
    console.log("🌱 Starting Seed...");

    // Clear existing data to prevent duplicates (since unique constraints were removed for some tables)
    console.log("🧹 Clearing old data...");
    try {
        await db.delete(appointments); // Delete dependent first
        await db.delete(lessons);
        await db.delete(courses);
        await db.delete(services);
        await db.delete(professionals);
    } catch (e) {
        console.warn("⚠️ Error clearing data (tables might be pending migration):", e);
    }

    // 1. Seed Professionals
    // console.log("... Seeding Pros");
    // try {
    //    for (const pro of SEED_PROS) {
    //        await db.insert(professionals).values({
    //            ...pro,
    //            // imageUrl: placeholder
    //        }); 
    //    }
    //    console.log("✅ Professionals seeded");
    // } catch (e) {
    //     console.error("❌ Error seeding professionals:", e);
    // }

    // 2. Seed Services
    // console.log("... Seeding Services");
    // try {
    //    for (const serv of SEED_SERVICES) {
    //        await db.insert(services).values(serv);
    //    }
    //    console.log("✅ Services seeded");
    // } catch (e) {
    //     console.error("❌ Error seeding services:", e);
    // }

    // 3. Seed Courses
    for (const course of SEED_COURSES) {
        const c = await db.insert(courses).values({
            title: course.title,
            price: course.price,
            description: course.description,
            active: course.active,
        }).returning();

        const courseId = c[0].id;

        for (const [lIndex, less] of course.lessons.entries()) {
            await db.insert(lessons).values({
                courseId,
                title: less.title,
                duration: less.durationMinutes,
                order: lIndex + 1
            });
        }
    }
    console.log("✅ Courses seeded");
    console.log("🌱 Seeding Complete!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
