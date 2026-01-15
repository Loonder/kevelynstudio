import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus, Edit2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminBlogList } from "@/components/admin/blog/admin-blog-list";

export default async function AdminBlogPage() {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Gerenciar Blog</h1>
                    <p className="text-white/40 font-light">Crie e edite artigos para a revista digital.</p>
                </div>
                <Link href="/admin/blog/new">
                    <LuxuryButton className="gap-2">
                        <Plus className="w-4 h-4" /> Novo Artigo
                    </LuxuryButton>
                </Link>
            </div>

            <AdminBlogList posts={posts} />
        </div>
    );
}
