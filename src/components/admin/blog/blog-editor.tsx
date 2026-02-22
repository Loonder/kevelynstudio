'use client';

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon, Type, Quote, X, MoveUp, MoveDown, Save } from "lucide-react";
import { createBlogPost, updateBlogPost } from "@/actions/blog-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type BlockType = 'paragraph' | 'h2' | 'h3' | 'blockquote' | 'image' | 'list';

interface ContentBlock {
    type: BlockType;
    text?: string;
    url?: string;
    alt?: string;
    caption?: string;
    items?: string[];
    author?: string; // for blockquote
}

interface BlogEditorProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        coverImage: string | null;
        content: any;
        published: boolean | null;
    };
}

export function BlogEditor({ initialData }: BlogEditorProps = {}) {
    const router = useRouter();
    const [postId] = useState(initialData?.id);
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
    const [blocks, setBlocks] = useState<ContentBlock[]>(initialData?.content || []);
    const [isSaving, setIsSaving] = useState(false);

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { type, text: "", items: [] }]);
    };

    const updateBlock = (index: number, field: string, value: any) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setBlocks(newBlocks);
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        if ((index === 0 && direction === -1) || (index === blocks.length - 1 && direction === 1)) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setBlocks(newBlocks);
    };

    const handleSave = async (published: boolean) => {
        if (!title || !slug) {
            toast.error("Título e Slug são obrigatórios.");
            return;
        }

        setIsSaving(true);
        try {
            const postData = {
                title,
                slug,
                excerpt,
                coverImage,
                content: blocks,
                published
            };

            const result = postId
                ? await updateBlogPost(postId, postData)
                : await createBlogPost(postData);

            if (result.success) {
                toast.success(published ? "Artigo publicado!" : "Rascunho salvo!");
                router.push("/admin/blog");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Erro ao salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Meta Data */}
            <GlassCard className="space-y-4 border-white/5 bg-white/[0.02]">
                <h2 className="text-xl font-medium text-white mb-4">Metadados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Título</label>
                        <Input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                // Auto-slug
                                if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }}
                            className="bg-black/20 border-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Slug (URL)</label>
                        <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-black/20 border-white/10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Resumo</label>
                    <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">URL da Imagem de Capa</label>
                    <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="bg-black/20 border-white/10" placeholder="https://..." />
                </div>
            </GlassCard>

            {/* Blocks Editor */}
            <div className="space-y-4">
                <h2 className="text-xl font-medium text-white">Conteúdo</h2>
                {blocks.map((block, index) => (
                    <div key={index} className="group relative p-4 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        {/* Block Controls */}
                        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded backdrop-blur-sm p-1">
                            <button onClick={() => moveBlock(index, -1)} className="p-1 hover:text-primary text-white/60"><MoveUp className="w-3 h-3" /></button>
                            <button onClick={() => moveBlock(index, 1)} className="p-1 hover:text-primary text-white/60"><MoveDown className="w-3 h-3" /></button>
                            <div className="w-[1px] h-3 bg-white/20 mx-1" />
                            <button onClick={() => removeBlock(index)} className="p-1 hover:text-red-400 text-white/60"><X className="w-3 h-3" /></button>
                        </div>

                        <div className="mb-2 text-[10px] uppercase tracking-widest text-primary/70 font-bold">{block.type}</div>

                        {/* Fields based on type */}
                        {block.type === 'paragraph' && (
                            <Textarea
                                value={block.text}
                                onChange={(e) => updateBlock(index, 'text', e.target.value)}
                                placeholder="Escreva seu parágrafo..."
                                className="bg-transparent border-0 focus:ring-0 p-0 text-white/80 leading-relaxed font-sans"
                            />
                        )}
                        {(block.type === 'h2' || block.type === 'h3') && (
                            <Input
                                value={block.text}
                                onChange={(e) => updateBlock(index, 'text', e.target.value)}
                                placeholder={`Título ${block.type.toUpperCase()}`}
                                className={`bg-transparent border-0 focus:ring-0 p-0 font-serif text-primary ${block.type === 'h2' ? 'text-2xl' : 'text-xl'}`}
                            />
                        )}
                        {block.type === 'blockquote' && (
                            <div className="pl-4 border-l-2 border-primary/50">
                                <Textarea
                                    value={block.text}
                                    onChange={(e) => updateBlock(index, 'text', e.target.value)}
                                    placeholder="Citação..."
                                    className="bg-transparent border-0 focus:ring-0 p-0 text-lg italic text-white/90 mb-2"
                                />
                                <Input
                                    value={block.author}
                                    onChange={(e) => updateBlock(index, 'author', e.target.value)}
                                    placeholder="Autor"
                                    className="bg-transparent border-0 focus:ring-0 p-0 text-sm text-white/50 h-auto"
                                />
                            </div>
                        )}
                        {block.type === 'image' && (
                            <div className="space-y-2">
                                <Input
                                    value={block.url}
                                    onChange={(e) => updateBlock(index, 'url', e.target.value)}
                                    placeholder="URL da Imagem"
                                    className="bg-black/20 border-white/10"
                                />
                                <Input
                                    value={block.caption}
                                    onChange={(e) => updateBlock(index, 'caption', e.target.value)}
                                    placeholder="Legenda (opcional)"
                                    className="bg-black/20 border-white/10 text-xs"
                                />
                                {block.url && (
                                    <div className="relative aspect-video w-40 rounded overflow-hidden border border-white/10 bg-black/40">
                                        <img src={block.url} alt="" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Block Bar */}
                <div className="flex items-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-lg justify-center hover:border-primary/30 transition-colors">
                    <span className="text-xs text-white/40 mr-2 uppercase tracking-wider">Adicionar Bloco:</span>
                    <button onClick={() => addBlock('paragraph')} className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded transition-colors text-white/60" title="Parágrafo"><Type className="w-4 h-4" /></button>
                    <button onClick={() => addBlock('h2')} className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded transition-colors text-white/60 font-serif font-bold">H2</button>
                    <button onClick={() => addBlock('image')} className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded transition-colors text-white/60" title="Imagem"><ImageIcon className="w-4 h-4" /></button>
                    <button onClick={() => addBlock('blockquote')} className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded transition-colors text-white/60" title="Citação"><Quote className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Actions */}
            <div className="fixed bottom-0 left-64 right-0 p-4 bg-[#050505]/95 border-t border-white/10 backdrop-blur flex justify-end gap-4 z-40">
                {/* Adjust left-64 to match sidebar width approximately */}
                <LuxuryButton variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                    Salvar Rascunho
                </LuxuryButton>
                <LuxuryButton onClick={() => handleSave(true)} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Publicar'}
                </LuxuryButton>
            </div>
        </div>
    );
}





