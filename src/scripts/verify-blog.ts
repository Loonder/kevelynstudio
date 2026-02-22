
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { count } from "drizzle-orm";

async function main() {
    console.log("🔍 Verifying Blog Posts...");

    const posts = await db.select().from(blogPosts).limit(5);
    console.log(`Found ${posts.length} posts (showing top 5):`);

    posts.forEach(p => {
        console.log(`- [${p.title}] (${p.slug})`);
        console.log(`  Img: ${p.coverImage}`);
    });

    if (posts.length > 0) {
        console.log("✅ Blog content exists.");
    } else {
        console.error("❌ No blog posts found!");
    }
    process.exit(0);
}

main();






