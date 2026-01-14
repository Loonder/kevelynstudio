import { BLOG_POSTS, ContentBlock } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";

interface BlogPostPageProps {
    params: {
        slug: string;
    }
}

// Helper component to render individual blocks
function BlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case 'paragraph':
            return (
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-8 font-sans">
                    {block.text}
                </p>
            );
        case 'h2':
            return (
                <h2 className="text-3xl md:text-4xl font-serif text-primary mt-12 mb-6 leading-tight">
                    {block.text}
                </h2>
            );
        case 'h3':
            return (
                <h3 className="text-2xl font-serif text-white mt-8 mb-4">
                    {block.text}
                </h3>
            );
        case 'blockquote':
            return (
                <blockquote className="my-10 pl-6 md:pl-10 border-l-2 border-primary italic">
                    <p className="text-xl md:text-2xl text-white font-serif leading-relaxed">
                        &ldquo;{block.text}&rdquo;
                    </p>
                    {block.author && (
                        <cite className="block mt-4 text-sm text-primary uppercase tracking-widest not-italic font-sans">
                            — {block.author}
                        </cite>
                    )}
                </blockquote>
            );
        case 'list':
            return (
                <ul className="list-disc pl-6 mb-8 space-y-3 text-lg text-white/80 font-light">
                    {block.items.map((item, idx) => (
                        <li key={idx} className="pl-2">
                            <span className="text-primary mr-2">•</span> {item}
                        </li>
                    ))}
                </ul>
            );
        case 'image':
            return (
                <figure className="my-10">
                    <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-white/10">
                        <Image
                            src={block.url}
                            alt={block.alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {block.caption && (
                        <figcaption className="mt-3 text-center text-sm text-white/40 italic font-light">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );
        default:
            return null;
    }
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-[#050505] text-white">
            {/* Header Image */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]" />

                {/* Back Button positioned absolutely */}
                <div className="absolute top-8 left-4 md:left-8 z-20">
                    <Link href="/blog">
                        <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Revista
                        </div>
                    </Link>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 pb-12 md:pb-20">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex items-center gap-4 text-sm text-white/80 mb-6 uppercase tracking-widest font-medium">
                            <span className="bg-primary px-3 py-1 text-black font-bold">{post.category}</span>
                            <span>{format(new Date(post.date), "dd . MM . yyyy")}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight font-medium mb-6 drop-shadow-xl">
                            {post.title}
                        </h1>

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-6 md:gap-10 border-t border-white/20 pt-6 mt-8">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                                    <Image src={post.author.avatarUrl} alt={post.author.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{post.author.name}</p>
                                    <p className="text-white/40 text-xs uppercase tracking-wider">{post.author.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Clock className="w-4 h-4 text-primary" />
                                {post.readTime} de leitura
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
                {/* Excerpt Lead */}
                <div className="mb-16">
                    <p className="text-2xl md:text-3xl font-serif text-white/90 leading-relaxed indent-8 md:indent-12 first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                        {post.excerpt}
                    </p>
                </div>

                {/* Content Blocks */}
                <div className="prose prose-invert prose-lg max-w-none">
                    {post.contentBlocks.map((block, index) => (
                        <BlockRenderer key={index} block={block} />
                    ))}
                </div>

                {/* Footer / Share */}
                <div className="mt-24 pt-12 border-t border-white/10 flex flex-col items-center text-center">
                    <h4 className="font-serif text-2xl text-white mb-6">Gostou deste artigo?</h4>
                    <LuxuryButton variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" /> Compartilhar
                    </LuxuryButton>
                </div>
            </div>
        </article>
    );
}
