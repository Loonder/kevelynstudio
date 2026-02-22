
import Link from "next/link";
import { db } from "../../../lib/db";
import { blogPosts } from "../../../db/schema";
import { desc } from "drizzle-orm";
import PublicLayout from "../../../components/layout/PublicLayout";

export const revalidate = 60;

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    createdAt: Date | null;
}

export default async function BlogPage() {
    let posts: BlogPost[] = [];
    try {
        posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (e) {
        console.error("Failed to fetch posts", e);
    }

    return (
        <PublicLayout>
            <section className="pt-32 pb-20 px-6 bg-black min-h-screen">
                <div className="container mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-primary text-xs uppercase tracking-[0.3em]">O Journal</span>
                        <h1 className="font-serif text-6xl md:text-7xl text-white">Inteligência da Beleza</h1>
                        <p className="text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
                            Insights de especialistas sobre design de cílios, arte em sobrancelhas e a ciência por trás de resultados deslumbrantes.
                        </p>
                        <div className="w-px h-12 bg-primary/50 mx-auto mt-8" />
                    </div>

                    {/* Featured Post */}
                    {posts.length > 0 && (
                        <div className="mb-20">
                            <Link href={`/blog/${posts[0].slug}`} className="group block">
                                <div className="grid md:grid-cols-2 gap-8 border border-white/10 hover:border-primary/30 transition-all duration-500">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={posts[0].coverImage || "/images/generated/hero_lashes_1769449267789.png"}
                                            alt={posts[0].title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col justify-center space-y-6">
                                        <span className="text-primary text-xs uppercase tracking-[0.2em]">{posts[0].category}</span>
                                        <h2 className="font-serif text-3xl md:text-4xl text-white group-hover:text-primary transition-colors">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-white/60 leading-relaxed line-clamp-3">{posts[0].excerpt}</p>
                                        <span className="text-primary text-sm uppercase tracking-widest">Ler Artigo →</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(1).map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                <article className="border border-white/10 bg-black hover:border-primary/30 transition-all duration-500">
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={post.coverImage || "/images/generated/lash_mapping_1769449336290.png"}
                                            alt={post.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="text-primary uppercase tracking-widest">{post.category}</span>
                                            <span className="text-white/30">•</span>
                                            <span className="text-white/40">5 min de leitura</span>
                                        </div>
                                        <h3 className="font-serif text-xl text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-white/50 text-sm line-clamp-2">{post.excerpt}</p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20 text-white/40">
                            <p>Nenhum artigo ainda. Execute o script de seed para popular.</p>
                            <code className="block mt-4 text-sm text-primary/60">npx ts-node src/scripts/seed-blog-complete.ts</code>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}






