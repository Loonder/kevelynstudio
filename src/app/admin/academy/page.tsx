import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus, GraduationCap } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminAcademyPage() {
    const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Kevelyn Academy</h1>
                    <p className="text-white/40 font-light">Gerencie seus cursos e alunas.</p>
                </div>
                <Link href="/admin/academy/new">
                    <LuxuryButton className="gap-2">
                        <Plus className="w-4 h-4" /> Novo Curso
                    </LuxuryButton>
                </Link>
            </div>

            <GlassCard className="p-0 overflow-hidden border-white/5 bg-white/[0.02]">
                <table className="w-full text-left text-sm text-white/60">
                    <thead className="bg-white/5 text-white uppercase tracking-wider font-medium text-xs">
                        <tr>
                            <th className="p-6">Curso</th>
                            <th className="p-6">Preço</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 align-middle">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center text-primary shrink-0">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{course.title}</p>
                                            <p className="text-xs text-white/40">{course.createdAt ? format(course.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR }) : 'Data inválida'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 align-middle">
                                    {(course.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="p-6 align-middle">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${course.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                                        {course.active ? 'Ativo' : 'Rascunho'}
                                    </span>
                                </td>
                                <td className="p-6 text-right align-middle">
                                    <Link href={`/admin/academy/${course.id}`}>
                                        <LuxuryButton variant="outline" className="text-xs h-8 hover:bg-[#D4AF37] hover:text-black border-white/20">
                                            Gerenciar Aulas
                                        </LuxuryButton>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {allCourses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-white/30 italic">
                                    Nenhum curso criado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
