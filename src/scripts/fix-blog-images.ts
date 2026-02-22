
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

const IMAGE_UPDATES = [
    {
        slug: "henna-ombre-naturalidade",
        imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80"
    },
    {
        slug: "arquitetura-do-olhar-russo-vs-brasileiro",
        imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80"
    },
    {
        slug: "ciencia-lash-lifting",
        imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80"
    },
    {
        slug: "mito-do-dano-extensoes",
        imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    },
    {
        slug: "brow-lamination-textura-selvagem",
        imageUrl: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=800&q=80"
    },
    {
        slug: "matematica-sobrancelha-proporcao-aurea",
        imageUrl: "https://images.unsplash.com/photo-1522337360705-2b1cc3d549be?auto=format&fit=crop&w=800&q=80"
    }
];

async function main() {
    console.log("🎨 Fixing Blog Images...");

    for (const update of IMAGE_UPDATES) {
        console.log(`Updating: ${update.slug}`);
        await db.update(blogPosts)
            .set({ coverImage: update.imageUrl })
            .where(eq(blogPosts.slug, update.slug));
    }

    console.log("✅ Images Fixed!");
    process.exit(0);
}

main();





