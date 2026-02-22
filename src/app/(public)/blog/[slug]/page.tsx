
import { db } from "../../../../lib/db";
import { blogPosts } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicLayout from "../../../../components/layout/PublicLayout";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let post: any = null;
    try {
        const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
        post = result[0] || null;
    } catch (e) {
        console.error("Error fetching post", e);
    }

    if (!post) {
        notFound();
    }

    const content = typeof post.content === 'string'
        ? JSON.parse(post.content)
        : post.content;

    const bodyText = content?.body || "";
    const paragraphs = bodyText.split('\n\n').filter((p: string) => p.trim());
    const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [];

    return (
        <PublicLayout>
            <article className="min-h-screen bg-black">
                {/* Hero */}
                <div className="relative h-[60vh] w-full">
                    <img
                        src={post.coverImage || "/images/generated/hero_lashes_1769449267789.png"}
                        className="w-full h-full object-cover opacity-60"
                        alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                        <div className="container mx-auto px-6 pb-16 max-w-4xl">
                            <span className="text-primary text-xs uppercase tracking-[0.3em] border border-primary/30 px-4 py-2 inline-block mb-6">
                                {post.category}
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight">{post.title}</h1>
                            {tags.length > 0 && (
                                <div className="flex gap-3 mt-6">
                                    {tags.map((tag: string) => (
                                        <span key={tag} className="text-white/40 text-xs uppercase tracking-wider">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 py-20 max-w-4xl">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {paragraphs.map((paragraph: string, i: number) => (
                            <p key={i} className="text-white/80 leading-relaxed mb-6 text-lg">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>

                    {/* Back to Blog */}
                    <div className="mt-20 pt-12 border-t border-white/10 flex justify-between items-center">
                        <Link href="/blog">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                ← Back to Journal
                            </Button>
                        </Link>
                        <Button className="bg-primary text-black hover:bg-white">
                            Book Appointment
                        </Button>
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
