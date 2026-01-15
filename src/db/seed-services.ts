

import { db } from "@/lib/db";
import { services, professionals } from "@/db/schema";

async function seed() {
    console.log("🌱 Clearing functionality tables...");

    // Optional: Clear existing data to avoid duplicates if running multiple times
    // Note: Be careful with foreign keys. 
    // await db.delete(services);
    // await db.delete(professionals);

    console.log("🌱 Seeding Services...");

    const lashServices = [
        {
            title: "Volume Brasileiro",
            description: "Técnica que utiliza fios em formato de Y para um olhar marcante e com volume, sem perder a naturalidade.",
            price: 18000, // R$ 180,00
            durationMinutes: 90,
            category: "Cílios",
            imageUrl: ""
        },
        {
            title: "Volume Russo",
            description: "Aplicação de leques (fans) de fios ultrafinos para um volume intenso e dramático.",
            price: 22000, // R$ 220,00
            durationMinutes: 120,
            category: "Cílios",
            imageUrl: ""
        },
        {
            title: "Lifting de Cílios",
            description: "Curvatura e tintura dos fios naturais, proporcionando efeito de rímel por semanas.",
            price: 14000, // R$ 140,00
            durationMinutes: 60,
            category: "Cílios",
            imageUrl: ""
        },
        {
            title: "Design de Sobrancelhas",
            description: "Mapeamento e remoção dos pelos para harmonizar o olhar com o rosto.",
            price: 5000, // R$ 50,00
            durationMinutes: 30,
            category: "Sobrancelhas",
            imageUrl: ""
        },
        {
            title: "Brow Lamination",
            description: "Alinhamento dos fios da sobrancelha para cima, criando um efeito mais cheio e moderno.",
            price: 16000, // R$ 160,00
            durationMinutes: 60,
            category: "Sobrancelhas",
            imageUrl: ""
        }
    ];

    for (const service of lashServices) {
        await db.insert(services).values(service);
    }

    console.log("🌱 Seeding Professionals...");

    const staff = [
        {
            name: "Kevelyn",
            slug: "kevelyn",
            role: "Master Lash Designer",
            bio: "Especialista em visagismo e saúde ocular com 5 anos de experiência.",
            color: "#D4AF37", // Gold
            isActive: true
        },
        {
            name: "Ana",
            slug: "ana",
            role: "Lash Designer",
            bio: "Apaixonada por realçar olhares com naturalidade.",
            color: "#A855F7", // Purple
            isActive: true
        },
        {
            name: "Julia",
            slug: "julia",
            role: "Brow Artist",
            bio: "Especialista em reconstrução de sobrancelhas.",
            color: "#EC4899", // Pink
            isActive: true
        }
    ];

    for (const pro of staff) {
        await db.insert(professionals).values(pro);
    }

    console.log("✅ Seed completed successfully!");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
