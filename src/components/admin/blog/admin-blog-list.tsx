
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Edit2, Eye, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toggleFeaturedPost, deleteBlogPost } from "@/actions/blog-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Post {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    published: boolean | null;
    featured: boolean | null;
    createdAt: Date | null;
}

interface AdminBlogListProps {
    posts: Post[];
}

export function AdminBlogList({ posts }: AdminBlogListProps) {
    const router = useRouter();

    const handleToggleFeatured = async (id: string, currentStatus: boolean | null) => {
        try {
            await toggleFeaturedPost(id, currentStatus);
            toast.success(currentStatus
                ? "Artigo removido dos destaques"
                : "Artigo definido como destaque principal");
            router.refresh();
        } catch (error) {
            toast.error("Erro ao atualizar destaque");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Tem certeza que deseja excluir o artigo "${title}"? Esta ação não pode ser desfeita.`)) {
            try {
                await deleteBlogPost(id);
                toast.success("Artigo excluído com sucesso");
                router.refresh();
            } catch (error) {
                toast.error("Erro ao excluir artigo");
            }
        }
    };

    return (
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
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded bg-white/10 relative overflow-hidden flex-shrink-0">
                                        {post.coverImage && (
                                            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium line-clamp-1 flex items-center gap-2">
                                            {post.title}
                                            {post.featured && (
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            )}
                                        </p>
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
                                {post.createdAt ? format(new Date(post.createdAt), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleToggleFeatured(post.id, post.featured)}
                                        className={`p-2 rounded-full transition-colors cursor-pointer ${post.featured ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/20 hover:text-yellow-400 hover:bg-white/10'}`}
                                        title={post.featured ? "Remover Destaque" : "Destacar"}
                                    >
                                        <Star className={`w-4 h-4 ${post.featured ? 'fill-yellow-400' : ''}`} />
                                    </button>

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
                                    <button
                                        onClick={() => handleDelete(post.id, post.title)}
                                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-white/40 hover:text-red-400 cursor-pointer"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
    );
}
