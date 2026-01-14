
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function BlogPreview() {
    // Determine if table exists (graceful degradation if not migrated yet)
    let latestPosts: any[] = [];
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database Timeout")), 2000)
        );

        latestPosts = await Promise.race([
            db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(3),
            timeoutPromise
        ]) as any[];

        // Ensure result is array (race might make TS unhappy)
        if (!Array.isArray(latestPosts)) latestPosts = [];

    } catch (e) {
        // Silent fallback
        latestPosts = [];
    }

    if (latestPosts.length === 0) return null;

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-gold text-xs uppercase tracking-widest mb-4 block">Knowledge</span>
                        <h2 className="font-serif text-4xl text-white">
                            Kevelyn <span className="text-primary italic">Journal</span>
                        </h2>
                    </div>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm uppercase tracking-wide">
                        Ver todos os posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                            <GlassCard className="h-full flex flex-col overflow-hidden hover:border-primary/30 transition-colors">
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    <Image
                                        src={post.coverImage || '/assets/images/placeholder-blog.jpg'}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                                            {post.category || 'Novidade'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {post.createdAt ? format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR }) : 'Recente'}
                                    </div>

                                    <h3 className="text-xl font-serif text-white mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-white/50 text-sm line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wider">
                                        Ler Artigo <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm uppercase tracking-wide">
                        Ver todos os posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
