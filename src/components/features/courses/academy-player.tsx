"use client";

import { useState, useEffect } from "react";
import { Play, CheckCircle, Lock, ArrowLeft, Download, MessageSquare, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface Lesson {
    id: string;
    title: string;
    videoUrl: string | null;
    durationMinutes: number | null;
    isFreePreview: boolean | null;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface AcademyPlayerProps {
    courseId: string;
    courseTitle: string;
    description: string;
    modules: Module[];
}

export function AcademyPlayer({ courseId, courseTitle, description, modules = [] }: AcademyPlayerProps) {
    // Default to first lesson of first module if available
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(
        modules?.[0]?.lessons?.[0] || null
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // If activeLesson changes (e.g. from props update), ensure state tracks it if needed
    // but usually user click drives it.

    return (
        <div className="flex h-screen bg-[#020202] text-white overflow-hidden">
            {/* Sidebar for Navigation */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="w-[350px] bg-[#080808] border-r border-white/5 flex flex-col z-20 shrink-0"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <Link href="/academy" className="flex items-center gap-2 text-white/30 hover:text-white mb-2 text-xs uppercase tracking-widest transition-colors">
                                    <ArrowLeft className="w-3 h-3" /> Voltar
                                </Link>
                                <h1 className="text-xl font-serif text-primary truncate w-56">{courseTitle}</h1>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-white/20 hover:text-white lg:hidden">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-8">
                            {modules.length > 0 ? modules.map((mod) => (
                                <div key={mod.id}>
                                    <h3 className="text-[11px] uppercase tracking-widest text-primary/60 mb-4 px-2 font-medium">
                                        {mod.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {mod.lessons.map((lesson) => {
                                            const isActive = activeLesson?.id === lesson.id;
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => setActiveLesson(lesson)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border border-primary/20"
                                                            : "hover:bg-white/5 text-white/60"
                                                    )}
                                                >
                                                    <div className="shrink-0">
                                                        {isActive ? <Play className="w-4 h-4 fill-primary" /> : <Play className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                                                        <p className="text-[10px] opacity-40">{lesson.durationMinutes || 0} min</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-white/30 text-center text-sm italic mt-10">
                                    Nenhum módulo disponível ainda.
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content: The Player */}
            <main className="flex-1 flex flex-col relative w-full">
                {/* Top Nav */}
                <nav className="h-20 border-b border-white/5 px-8 flex items-center justify-between z-10 bg-[#020202]">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg mr-4 hover:bg-white/10 transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-white font-serif italic text-lg truncate max-w-md">
                            {activeLesson?.title || "Bem-vinda ao Curso"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
                            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Material PDF</span>
                        </button>
                        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
                            <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">Suporte</span>
                        </button>
                    </div>
                </nav>

                {/* Player Area */}
                <div className="flex-1 overflow-y-auto">
                    {activeLesson ? (
                        <>
                            <div className="aspect-video w-full bg-[#050505] relative group">
                                {/* Video Player Mockup / Embed */}
                                {activeLesson.videoUrl ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p>Video Embed Here: {activeLesson.videoUrl}</p>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <Play className="w-20 h-20 text-primary/20 mb-4 mx-auto" strokeWidth={1} />
                                            <p className="text-white/20 font-serif italic text-2xl">Visualização Indisponível (Demo)</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Details */}
                            <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                    <div>
                                        <span className="text-primary text-xs uppercase tracking-[0.3em] block mb-2">Agora Assistindo</span>
                                        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">{activeLesson.title}</h1>
                                        <div className="flex items-center gap-4 text-white/40 text-sm">
                                            <span>Duração: {activeLesson.durationMinutes || 0} min</span>
                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                            <span>Curso Presencial</span>
                                        </div>
                                    </div>
                                    <button className="shrink-0 bg-white text-black px-8 py-3 rounded-full font-serif hover:bg-primary transition-all text-sm uppercase tracking-widest">
                                        Próxima Aula
                                    </button>
                                </div>

                                <div className="w-full h-px bg-white/5 mb-8" />

                                <div className="prose prose-invert prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed max-w-none">
                                    <h3 className="text-white font-serif text-xl mb-4">Sobre esta aula</h3>
                                    <p>{description || "Conteúdo exclusivo para alunas do método presencial."}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Play className="w-8 h-8 text-white/20" />
                            </div>
                            <h2 className="text-2xl font-serif text-white mb-2">Selecione uma aula</h2>
                            <p className="text-white/30 max-w-md">
                                Escolha um módulo e uma aula no menu lateral para começar sua jornada de aprendizado.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
