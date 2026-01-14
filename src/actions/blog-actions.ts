'use server';

import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createBlogPost(data: any) {
    try {
        await db.insert(blogPosts).values({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            content: data.content, // JSONB
            published: data.published
        });

        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Create Post Error:", error);
        return { error: error.message };
    }
}

export async function updateBlogPost(id: string, data: any) {
    try {
        await db.update(blogPosts)
            .set({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                content: data.content,
                published: data.published
            })
            .where(eq(blogPosts.id, id));

        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        revalidatePath(`/blog/${data.slug}`);
        return { success: true };
    } catch (error: any) {
        console.error("Update Post Error:", error);
        return { error: error.message };
    }
}
