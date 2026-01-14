
import { db } from "@/lib/db";
import { blogPosts } from "./schema";
import { BLOG_POSTS } from "@/lib/blog-data";

export async function seedBlog() {
    console.log("🌱 Seeding Blog Posts...");

    for (const post of BLOG_POSTS) {
        await db.insert(blogPosts).values({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.contentBlocks, // JSONB
            coverImage: post.coverImageUrl,
            published: true,
            authorId: post.author.name, // Storing name as ID for now or could be UUID if we had users
            createdAt: new Date(post.date),
        }).onConflictDoNothing();
    }

    console.log("✅ Blog Posts Seeded!");
}

const isMainModule = typeof require !== 'undefined' && require.main === module;
if (isMainModule) {
    seedBlog().then(() => {
        console.log("Done");
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}
