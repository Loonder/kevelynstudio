import { BLOG_POSTS } from "@/lib/blog-data";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function BlogPage() {
    const featuredPost = BLOG_POSTS[0];
    const otherPosts = BLOG_POSTS.slice(1);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30">

            {/* Hero Section (Featured Post) */}
            <section className="relative w-full h-[85vh] flex items-end justify-start overflow-hidden group">
                {/* Background Image with Parallax-like feel via fixed or absolute */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={featuredPost.coverImageUrl}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 pb-20 relative z-10 max-w-7xl">
                    <div className="max-w-4xl space-y-6 animate-fade-in-up">
                        <span className="inline-block px-4 py-1 border border-primary/30 rounded-full text-xs uppercase tracking-[0.2em] text-primary bg-black/20 backdrop-blur-sm">
                            Em Destaque
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight font-medium">
                            <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary transition-colors duration-300">
                                {featuredPost.title}
                            </Link>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed">
                            {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-white/60 pt-4">
                            <span className="tracking-widest uppercase">{featuredPost.category}</span>
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            <span>{format(new Date(featuredPost.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {featuredPost.readTime}
                            </span>
                        </div>

                        <div className="pt-6">
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <LuxuryButton className="px-8 py-6 text-sm tracking-widest">
                                    LER ARTIGO COMPLETO
                                </LuxuryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-24 container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-3xl font-serif text-white">Últimas Publicações</h2>
                    <div className="h-[1px] flex-1 bg-white/10 ml-8 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post, index) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                            <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group-hover:-translate-y-2">
                                {/* Image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    <Image
                                        src={post.coverImageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider text-white rounded">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3 uppercase tracking-wider">
                                        <span>{format(new Date(post.date), "MMM dd, yyyy", { locale: ptBR })}</span>
                                        <span className="w-1 h-1 rounded-full bg-primary/50" />
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-2xl font-serif text-white group-hover:text-primary transition-colors mb-4 line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-white/60 text-sm line-clamp-3 mb-6 font-light leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-primary text-xs uppercase tracking-widest font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Ler Mais <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
