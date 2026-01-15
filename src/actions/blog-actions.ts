
"use server";

import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFeaturedPost(id: string, currentStatus: boolean | null) {

    // First, unfeature all other posts if we are enabling this one (optional, if we only want 1 featured)
    // For now, let's allow multiple, but typically only 1 is hero. The sorting handles typically only the first one being hero.
    // If we want strict single-featured, we would update all to false first.
    // Let's implement strict single-featured for the 'Hero'.

    if (!currentStatus) { // If we are turning it ON
        await db.update(blogPosts).set({ featured: false });
    }

    await db.update(blogPosts)
        .set({ featured: !currentStatus })
        .where(eq(blogPosts.id, id));

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
}

export async function createBlogPost(data: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    content: any;
    published: boolean;
}) {
    try {
        await db.insert(blogPosts).values({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            content: data.content,
            published: data.published,
        });

        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Create blog post error:", error);
        return { success: false, error: error?.message || "Erro ao criar artigo." };
    }
}

export async function updateBlogPost(id: string, data: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    content: any;
    published: boolean;
}) {
    try {
        await db.update(blogPosts)
            .set({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                content: data.content,
                published: data.published,
            })
            .where(eq(blogPosts.id, id));

        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Update blog post error:", error);
        return { success: false, error: error?.message || "Erro ao atualizar artigo." };
    }
}

export async function deleteBlogPost(id: string) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
}
