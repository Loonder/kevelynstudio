
// import { db } from "../db"; 
// Adjust path if needed.
import { blogPosts } from "../db/schema";
// import { v4 as uuidv4 } from "uuid"; // Use global crypto

// Since we are running with ts-node from root or src, we need to handle paths.
// But better to make this self-contained or run via package.json script.
// Let's assume we can import from src/db/index.ts if we run from src.

// Actually, simpler to just define db connection here to avoid import issues if verify fails?
// But better to use the app's db logic.

const posts = [
    {
        title: "The Architecture of the Eye: Why Mapping Matters",
        category: "Lash Design",
        excerpt: "Beauty is geometry. Discover how we map your unique eye shape to create balance and allure.",
        content: "Full content about lash mapping...",
        coverImage: "/images/uploads/brand-3.jpg"
    },
    {
        title: "Sensory Beauty: The Science of Relaxation",
        category: "Experience",
        excerpt: "Why your cortisol levels affect your retention. The Kevelyn sensory protocol explained.",
        content: "Content about sensory inputs...",
        coverImage: "/images/uploads/brand-1.jpg"
    },
    {
        title: "Brows as a Frame: The Golden Ratio",
        category: "Brows Design",
        excerpt: "Using Fibonacci sequences to determine the perfect arch for your face structure.",
        content: "Content about golden ratio...",
        coverImage: "/images/uploads/brand-4.jpg"
    },
    {
        title: "The Silent Appointment: Why Silence is Luxury",
        category: "Experience",
        excerpt: "In a noisy world, we offer the luxury of silence. No forced conversation, just restoration.",
        content: "Content about silence...",
        coverImage: "/images/uploads/brand-2.jpg"
    },
    {
        title: "Lip Neutralization: Restoring Your Canvas",
        category: "Lips",
        excerpt: "Correcting melanin saturation to reveal purely youthful flexibility and color.",
        content: "Content about lips...",
        coverImage: "/images/uploads/brand-5.jpg"
    },
    // Generate 10 more variations
    ...Array.from({ length: 10 }).map((_, i) => ({
        title: `Technical Mastery Vol. ${i + 1}: ${i % 2 === 0 ? 'Volume' : 'Precision'}`,
        category: i % 2 === 0 ? "Lash Design" : "Brows Design",
        excerpt: "Deep dive into the technical specifications of our materials and techniques.",
        content: " detailed technical content...",
        coverImage: i % 3 === 0 ? "/images/uploads/brand-3.jpg" : "/images/uploads/brand-4.jpg"
    }))
];

async function seed() {
    console.log("Seeding blog posts...");
    // We need to initialize DB connection manually if we can't import 'db' easily
    // But let's try to grab it from a hypothetical 'db/index.ts' or construct it.

    // Minimal setup for seeding script
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const sqlite = new Database("../sqlite.db");
    const db = drizzle(sqlite);

    // We need to use the schema object to insert
    // Importing from schema file might require ts-node to handle the import
    // If we run this as 'ts-node scripts/seed-blog.ts', it should work.

    try {
        for (const post of posts) {
            await db.insert(blogPosts).values({
                id: crypto.randomUUID(),
                slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                title: post.title,
                excerpt: post.excerpt,
                content: JSON.stringify([{ type: 'paragraph', text: post.content }]),
                category: post.category,
                coverImage: post.coverImage,
                published: true,
                createdAt: new Date(),
                featured: Math.random() > 0.8
            });
        }
        console.log("Seeding complete.");
    } catch (e) {
        console.error("Seeding failed:", e);
    }
}

seed();






