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

            <GlassCard className="p-0 overflow-hidden border-white/5 bg-white/[0.02]">
                <table className="w-full text-left text-sm text-white/60">
                    <thead className="bg-white/5 text-white uppercase tracking-wider font-medium text-xs">
                        <tr>
                            <th className="p-6">Artigo</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Data</th>
                            <th className="p-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-white/10 relative overflow-hidden flex-shrink-0">
                                            {post.coverImage && (
                                                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium line-clamp-1">{post.title}</p>
                                            <p className="text-xs text-white/40 line-clamp-1">{post.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.published ? 'Publicado' : 'Rascunho'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    {post.createdAt ? format(post.createdAt, "dd/MM/yyyy", { locale: ptBR }) : '-'}
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <div className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white cursor-pointer" title="Visualizar">
                                                <Eye className="w-4 h-4" />
                                            </div>
                                        </Link>
                                        <Link href={`/admin/blog/edit/${post.id}`}>
                                            <div className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-primary cursor-pointer" title="Editar">
                                                <Edit2 className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-white/30 italic">
                                    Nenhum artigo encontrado. Crie o primeiro!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
