import { supabase } from "@/lib/supabase-client";
import { BlogEditor } from "@/components/admin/blog/blog-editor";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditBlogPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const { id } = await params;

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (error || !post) {
        notFound();
    }

    // Map Supabase fields to the format expected by BlogEditor
    const mappedPost = {
        ...post,
        coverImage: post.cover_image,
        content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/admin/blog" className="flex items-center text-white/50 hover:text-[#D4AF37] transition-colors mb-4 w-fit text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Lista
            </Link>
            <h1 className="text-3xl font-serif text-white mb-8">Editar Artigo</h1>
            <BlogEditor initialData={mappedPost as any} />
        </div>
    );
}
