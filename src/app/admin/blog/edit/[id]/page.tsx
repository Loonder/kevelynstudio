import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BlogEditor } from "@/components/admin/blog/blog-editor";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const { id } = await params;

    const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, id)
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-serif text-white mb-8">Editar Artigo</h1>
            <BlogEditor initialData={post} />
        </div>
    );
}
