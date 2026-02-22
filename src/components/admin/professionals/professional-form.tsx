"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfessional, updateProfessional, deleteProfessional, ProfessionalInput } from "@/actions/professional-actions";
import { ArrowLeft, Save, Trash2, Loader2, Instagram, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface ProfessionalFormProps {
    initialData?: ProfessionalInput;
    isEditing?: boolean;
}

export function ProfessionalForm({ initialData, isEditing = false }: ProfessionalFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProfessionalInput>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        role: initialData?.role || "Lash Artist",
        bio: initialData?.bio || "",
        instagramHandle: initialData?.instagramHandle || "",
        imageUrl: initialData?.imageUrl || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Auto-generate slug if empty
        const payload = { ...formData };
        if (!payload.slug) {
            payload.slug = payload.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        }

        let result;
        if (isEditing && initialData?.id) {
            result = await updateProfessional(initialData.id, payload);
        } else {
            result = await createProfessional(payload);
        }

        if (result.success) {
            // alert(isEditing ? "Profissional atualizada!" : "Profissional criada!");
            router.push("/admin/team");
            router.refresh();
        } else {
            alert("Erro: " + result.error);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!initialData?.id || !confirm("Tem certeza que deseja remover esta profissional?")) return;
        setIsLoading(true);
        const result = await deleteProfessional(initialData.id);
        if (result.success) {
            router.push("/admin/team");
            router.refresh();
        } else {
            alert("Erro ao excluir.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <header className="flex justify-between items-center mb-6">
                <Link href="/admin/team" className="text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Remover Profissional
                    </button>
                )}
            </header>

            <GlassCard className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Nome Completo</label>
                        <Input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Ex: Kevelyn Costa"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Cargo / Especialidade</label>
                        <Input
                            required
                            type="text"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Ex: Master Artist"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Instagram (sem @)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                                <Instagram className="w-4 h-4" />
                            </span>
                            <Input
                                type="text"
                                value={formData.instagramHandle || ''}
                                onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })}
                                className="bg-white/5 border-white/10 text-white pl-10"
                                placeholder="kevelynstudio"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Foto de Perfil (URL)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                                <LinkIcon className="w-4 h-4" />
                            </span>
                            <Input
                                type="text"
                                value={formData.imageUrl || ''}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="bg-white/5 border-white/10 text-white pl-10"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Bio / Descrição</label>
                        <textarea
                            rows={3}
                            value={formData.bio || ''}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none"
                            placeholder="Breve descrição sobre a profissional..."
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-black font-medium px-8 py-3 rounded-full transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEditing ? "Salvar Alterações" : "Cadastrar Profissional"}
                    </button>
                </div>
            </GlassCard>
        </form>
    );
}





