import { supabase } from "@/lib/supabase-client";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminBlogList } from "@/components/admin/blog/admin-blog-list";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function AdminBlogPage() {
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false });

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

            <AdminBlogList posts={posts || []} />
        </div>
    );
}






