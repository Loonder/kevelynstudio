'use client';

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Assuming we have or use simple checkbox
import { Plus, Video, Clock, Trash2, MoveUp, MoveDown, Save, ArrowLeft } from "lucide-react";
import { updateCourse, saveLessons } from "@/actions/academy-actions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CourseManager({ course, initialLessons }: { course: any, initialLessons: any[] }) {
    const router = useRouter();
    const [details, setDetails] = useState(course);
    const [lessons, setLessons] = useState(initialLessons);
    const [isSaving, setIsSaving] = useState(false);

    // --- Details Handlers ---
    const handleDetailChange = (field: string, value: any) => {
        setDetails({ ...details, [field]: value });
    };

    // --- Lesson Handlers ---
    const addLesson = () => {
        setLessons([...lessons, {
            id: `temp-${Date.now()}`,
            title: "Nova Aula",
            videoUrl: "",
            duration: 0,
            order: lessons.length + 1
        }]);
    };

    const updateLesson = (index: number, field: string, value: any) => {
        const newLessons = [...lessons];
        newLessons[index] = { ...newLessons[index], [field]: value };
        setLessons(newLessons);
    };

    const removeLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index));
    };

    const moveLesson = (index: number, direction: -1 | 1) => {
        if ((index === 0 && direction === -1) || (index === lessons.length - 1 && direction === 1)) return;
        const newLessons = [...lessons];
        const temp = newLessons[index];
        newLessons[index] = newLessons[index + direction];
        newLessons[index + direction] = temp;
        // Update order property simply by index
        setLessons(newLessons); // We'll reassign generic order on save
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update Course Details
            await updateCourse(details);

            // Update Lessons (re-indexing order)
            const orderedLessons = lessons.map((l, idx) => ({ ...l, order: idx + 1, courseId: course.id }));
            await saveLessons(course.id, orderedLessons);

            toast.success("Curso e Aulas salvos com sucesso!");
            router.refresh();
        } catch (error) {
            toast.error("Erro ao salvar curso.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/academy">
                    <div className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                </Link>
                <h1 className="text-3xl font-serif text-white flex-1">Gerenciar: {details.title}</h1>
                <LuxuryButton onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </LuxuryButton>
            </div>

            {/* Course Info */}
            <GlassCard className="space-y-4 border-white/5 bg-white/[0.02]">
                <h2 className="text-xl font-medium text-white mb-4">Detalhes do Curso</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Título</label>
                        <Input value={details.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange('title', e.target.value)} className="bg-black/20 border-white/10" />

                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Preço (Centavos)</label>
                        <Input type="number" value={details.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange('price', parseInt(e.target.value))} className="bg-black/20 border-white/10" />

                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Descrição</label>
                        <Textarea value={details.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleDetailChange('description', e.target.value)} className="bg-black/20 border-white/10" />

                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={details.active}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange('active', e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-white/80">Curso Ativo (Visível para alunas)</span>
                        </label>
                    </div>
                </div>
            </GlassCard>

            {/* Lessons List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-white">Cronograma de Aulas</h2>
                    <LuxuryButton variant="outline" onClick={addLesson} className="text-xs h-8 gap-2">
                        <Plus className="w-3 h-3" /> Adicionar Aula
                    </LuxuryButton>
                </div>

                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <div key={lesson.id || index} className="flex flex-col md:flex-row gap-4 p-4 rounded bg-white/5 border border-white/10 items-start md:items-center group">
                            {/* Reorder Controls */}
                            <div className="flex flex-row md:flex-col gap-1 pr-2 border-r border-white/10 md:border-r-0 md:border-b-0">
                                <button onClick={() => moveLesson(index, -1)} className="p-1 hover:text-primary text-white/40"><MoveUp className="w-4 h-4" /></button>
                                <button onClick={() => moveLesson(index, 1)} className="p-1 hover:text-primary text-white/40"><MoveDown className="w-4 h-4" /></button>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                <div className="md:col-span-1">
                                    <Input
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                        placeholder="Título da Aula"
                                        className="bg-black/20 border-white/10 h-9"
                                    />
                                </div>
                                <div className="md:col-span-1 relative">
                                    <Video className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                                    <Input
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                        placeholder="Link do Vídeo (Vimeo/YT)"
                                        className="bg-black/20 border-white/10 h-9 pl-9"
                                    />
                                </div>
                                <div className="md:col-span-1 relative flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Clock className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                                        <Input
                                            type="number"
                                            value={lesson.duration || ''}
                                            onChange={(e) => updateLesson(index, 'duration', parseInt(e.target.value))}
                                            placeholder="Minutos"
                                            className="bg-black/20 border-white/10 h-9 pl-9"
                                        />
                                    </div>
                                    <button onClick={() => removeLesson(index)} className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-full transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {lessons.length === 0 && (
                        <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-lg text-white/30 italic">
                            Nenhuma aula cadastrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}





