"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function createBlogPost(data: any) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .insert({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                content: data.content,
                published: data.published,
                author: data.author || 'Gabriela Kevelyn',
                tenant_id: TENANT_ID
            });

        if (error) throw error;
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Create Blog Post Error:", error);
        return { success: false, error: error.message || "Erro ao criar post" };
    }
}

export async function updateBlogPost(id: string, data: any) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .update({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                content: data.content,
                published: data.published,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        revalidatePath(`/blog/${data.slug}`);
        return { success: true };
    } catch (error: any) {
        console.error("Update Blog Post Error:", error);
        return { success: false, error: error.message || "Erro ao atualizar post" };
    }
}

export async function toggleFeaturedPost(id: string, currentStatus: boolean | null) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .update({ featured: !currentStatus })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Toggle Featured Post Error:", error);
        throw error;
    }
}

export async function deleteBlogPost(id: string) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Blog Post Error:", error);
        throw error;
    }
}
