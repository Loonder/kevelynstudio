
"use client";

import { useState } from "react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { createCourse } from "@/actions/academy-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Course {
    id: string;
    title: string;
    price: number;
    active: boolean | null;
}

export default function AcademyClient({ initialCourses }: { initialCourses: Course[] }) {
    const [courses, setCourses] = useState(initialCourses);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await createCourse({
                title: formData.get("title") as string,
                price: Number(formData.get("price")) * 100, // to cents
            });
            if (res.success) {
                toast.success("Curso criado!");
                setOpen(false);
                // Refresh handled by Server Action revalidate in real app, but client state update here helps responsiveness
                // For now, simpler to just let revalidate work on next refresh or if using router.refresh()
                window.location.reload();
            } else {
                toast.error("Erro ao criar.");
            }
        } catch (error) {
            toast.error("Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif text-primary">Academy Management</h1>
                    <p className="text-muted-foreground text-sm">Gerencie os cursos e alunos da Kevelyn Academy.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <LuxuryButton className="bg-primary text-black hover:bg-white">
                            <Plus className="w-4 h-4 mr-2" /> Novo Curso
                        </LuxuryButton>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Curso</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <Input name="title" placeholder="Nome do Curso" required className="bg-white/5 border-white/10" />
                            <Input name="price" type="number" placeholder="Preço (R$)" required className="bg-white/5 border-white/10" />
                            <LuxuryButton type="submit" isLoading={isLoading} className="w-full justify-center bg-primary text-black">
                                Criar
                            </LuxuryButton>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {courses.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-white/30">
                        Nenhum curso cadastrado.
                    </div>
                ) : (
                    courses.map(course => (
                        <div key={course.id} className="bg-white/5 border border-white/10 p-6 flex justify-between items-center hover:border-primary/30 transition-colors rounded-xl">
                            <div className="flex items-center gap-6">
                                <div className={`w-3 h-3 rounded-full ${course.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div>
                                    <h3 className="text-white font-serif text-lg">{course.title}</h3>
                                    <div className="text-xs text-white/40 flex gap-4 mt-1 items-center">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 0 alunos</span>
                                        <span className="text-primary font-mono">{(course.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/admin/academy/${course.id}`}>
                                    <LuxuryButton variant="outline" className="border-white/10 text-white/60 hover:text-white">
                                        Gerenciar
                                    </LuxuryButton>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}





