
import { db } from "../lib/db";
import { professionals, services, blogPosts, appointments, clients } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("🌱 Starting Seed...");

    // 1. SERVICES
    const servicesData = [
        {
            title: "Volume Russo (Lashes)",
            description: "Extensão de cílios com técnica de volume russo para um olhar dramático.",
            price: 25000,
            durationMinutes: 120,
            category: "Lashes",
            imageUrl: "https://images.unsplash.com/photo-1587776465385-d86b72960655?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Fio a Fio Clássico",
            description: "Técnica clássica para um resultado natural e elegante.",
            price: 18000,
            durationMinutes: 90,
            category: "Lashes",
            imageUrl: "https://images.unsplash.com/photo-1587776465385-d86b72960655?auto=format&fit=crop&w=800&q=80", // Reusing for consistency or use another if needed
        },
        {
            title: "Design de Sobrancelha",
            description: "Mapeamento e design personalizado de acordo com seu rosto.",
            price: 5000,
            durationMinutes: 30,
            category: "Brows",
            imageUrl: "https://images.unsplash.com/photo-1629364966236-407675e24b33?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Nanoblading",
            description: "Micropigmentação hiper-realista fios finos.",
            price: 85000,
            durationMinutes: 180,
            category: "Brows",
            imageUrl: "https://images.unsplash.com/photo-1629364966236-407675e24b33?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Hydra Gloss Lips",
            description: "Hidratação profunda e revitalização dos lábios.",
            price: 35000,
            durationMinutes: 60,
            category: "Lips",
            imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
        }
    ];

    console.log("Creating Services...");
    for (const s of servicesData) {
        // Simple check to avoid duplicates if re-running (optional depending on DB constraints, but safer)
        // Here we just insert. Cleaning DB manually might be better if you want a fresh start, 
        // but for now let's just insert if not exists or let it duplicate (dev env).
        // A better approach for seed is to delete or upsert. Let's just insert.
        await db.insert(services).values(s).returning();
    }


    // 2. PROFESSIONALS
    const professionalsData = [
        {
            name: "Kevelyn Studio",
            slug: "kevelyn-studio",
            role: "Master Artist",
            bio: "Especialista em olhar e fundadora do studio.",
            imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
            color: "#D4AF37", // Gold
        },
        {
            name: "Sarah Silva",
            slug: "sarah-silva",
            role: "Lash Designer",
            bio: "Apaixonada por realçar a beleza natural.",
            imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            color: "#A0aec0", // Cool Gray
        },
        {
            name: "Amanda Costa",
            slug: "amanda-costa",
            role: "Brow Expert",
            bio: "Design de sobrancelhas perfeito é a minha assinatura.",
            imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80", // Using 1 again or find another if needed
            color: "#E9D8FD", // Light purple
        }
    ];

    console.log("Creating Professionals...");
    const createdProfs = [];
    for (const p of professionalsData) {
        const [prof] = await db.insert(professionals).values(p).returning();
        createdProfs.push(prof);
    }

    // 3. BLOG POSTS
    const blogData = [
        {
            title: "5 Dicas para Cuidar dos seus Cílios",
            slug: "dicas-cuidados-cilios",
            excerpt: "Saiba como manter sua extensão bonita por mais tempo.",
            coverImage: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
            content: { text: "Conteúdo do post..." },
            published: true,
        },
        {
            title: "Tendências de Sobrancelha para 2026",
            slug: "tendencias-sobrancelha-2026",
            excerpt: "O que está em alta no mundo da beleza.",
            coverImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
            content: { text: "Conteúdo do post..." },
            published: true,
        },
        {
            title: "Mitos e Verdades sobre Micropigmentação",
            slug: "mitos-verdades-micro",
            excerpt: "Desvendando os segredos do procedimento.",
            coverImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
            content: { text: "Conteúdo do post..." },
            published: true,
        },
        {
            title: "A Importância da Hidratação Labial",
            slug: "importancia-hidratacao-labial",
            excerpt: "Por que o Hydra Gloss é o queridinho do momento.",
            coverImage: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
            content: { text: "Conteúdo do post..." },
            published: true,
        }
    ];

    console.log("Creating Blog Posts...");
    for (const b of blogData) {
        await db.insert(blogPosts).values(b).returning();
    }

    // 4. CLIENTS & APPOINTMENTS
    // Create a dummy client
    const [client] = await db.insert(clients).values({
        fullName: "Cliente VIP Teste",
        email: "vip@test.com",
        phone: "11999999999",
        role: "client",
        sensoryPreferences: {
            favoriteMusic: "Jazz",
            drinkPreference: "Champagne",
            temperature: "Warm",
            musicVolume: "Soft"
        }
    }).returning();

    console.log("Creating Appointments...");

    // Create appointments for the next few days
    const today = new Date();
    const service = await db.query.services.findFirst(); // Get any service

    if (service && createdProfs.length > 0 && client) {
        for (let i = 0; i < 10; i++) {
            const prof = createdProfs[i % createdProfs.length];
            const startDetails = new Date(today);
            startDetails.setDate(today.getDate() + (i % 3)); // Spread over 3 days
            startDetails.setHours(9 + i + (i * 0.5), 0, 0); // 9:00, 10:30, etc.

            const endDetails = new Date(startDetails);
            endDetails.setMinutes(startDetails.getMinutes() + service.durationMinutes);

            await db.insert(appointments).values({
                clientId: client.id,
                professionalId: prof.id,
                serviceId: service.id,
                startTime: startDetails,
                endTime: endDetails,
                status: 'confirmed'
            });
        }
    }

    console.log("✅ Seed Completed!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});





