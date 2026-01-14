import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import Image from "next/image";

// Fetch fresh data
export const dynamic = 'force-dynamic';

export default async function AcademyPage() {
    const publishedCourses = await db.query.courses.findMany({
        where: eq(courses.active, true),
        orderBy: [desc(courses.createdAt)]
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Kevelyn Academy</span>
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        A Arte da <span className="italic text-white/80">Excelência</span>
                    </h1>
                    <p className="text-white/50 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Domine as técnicas mais exclusivas do mercado com nossa metodologia presencial.
                        Certificação de luxo e suporte vitalício.
                    </p>
                </header>

                {publishedCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publishedCourses.map((course) => (
                            <Link href={`/academy/${course.id}`} key={course.id} className="group">
                                <GlassCard className="h-full overflow-hidden hover:border-primary/50 transition-colors duration-500">
                                    <div className="relative h-64 w-full bg-white/5">
                                        {/* Fallback pattern if no image */}
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                                                <GraduationCap className="w-12 h-12 text-white/20 group-hover:text-primary/50 transition-colors" />
                                            </div>
                                        )}

                                        {/* Price Tag */}
                                        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-full">
                                            <span className="text-primary font-medium">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price / 100)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                                        <p className="text-white/40 text-sm line-clamp-2 mb-6">
                                            {course.description || "Aprenda com quem é referência no mercado."}
                                        </p>

                                        <div className="flex items-center text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                            Ver Detalhes <ChevronRight className="w-3 h-3 ml-2" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <GlassCard className="max-w-md mx-auto p-12 text-center">
                        <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-6" />
                        <h3 className="text-xl text-white font-serif mb-2">Turmas em Breve</h3>
                        <p className="text-white/50 text-sm">
                            Estamos preparando o cronograma. Entre em contato para lista de espera.
                        </p>
                        <button className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs uppercase tracking-widest transition-colors">
                            Falar no WhatsApp
                        </button>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}

