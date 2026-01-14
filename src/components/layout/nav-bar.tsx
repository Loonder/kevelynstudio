"use client";

import { cn } from "@/lib/cn";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User as UserIcon, ShieldCheck, CalendarHeart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function NavBar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Controle de hidratação e usuário
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // ✅ MANEIRA CORRETA: Fetch dentro do useEffect
    useEffect(() => {
        setIsMounted(true);

        const supabase = createClient();

        async function getUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user?.email) {
                    const { data: clientData } = await supabase
                        .from('clients')
                        .select('role')
                        .eq('email', user.email)
                        .single();

                    if (clientData) {
                        setRole(clientData.role);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            } finally {
                setLoading(false);
            }
        }

        getUser();
    }, []);

    // Styles for the CTA button - Gold Border, Gold Text, Subtle Fill
    const ctaStyles = "px-6 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-all duration-300 font-medium tracking-wide flex items-center gap-2";

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-500",
                    isScrolled ? "py-4 bg-background/80 backdrop-blur-md border-b border-white/5" : "py-8 bg-transparent"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="group">
                        <h1 className="font-serif text-3xl font-bold tracking-widest text-white">
                            KEVELYN <span className="text-primary italic font-light group-hover:text-white transition-colors duration-300">STUDIO</span>
                        </h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-light text-white/80">
                        <Link href="/#atendimento" className="hover:text-primary transition-colors hover:font-normal">Atendimento</Link>
                        <Link href="/team" className="hover:text-primary transition-colors hover:font-normal">Time</Link>
                        <Link href="/#cursos" className="hover:text-primary transition-colors hover:font-normal">Cursos</Link>
                        <Link href="/#contato" className="hover:text-primary transition-colors hover:font-normal">Contato</Link>

                        {/* Só renderiza lógica de usuário se estiver montado no cliente para evitar erro de hidratação */}
                        {isMounted && (
                            <>
                                {loading ? (
                                    <div className="w-24 h-10 bg-white/5 rounded-full animate-pulse" />
                                ) : user ? (
                                    role === 'admin' ? (
                                        <Link
                                            href="/admin"
                                            className={ctaStyles}
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href="/my-appointments"
                                                className={ctaStyles}
                                            >
                                                <CalendarHeart className="w-4 h-4" />
                                                Meus Agendamentos
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <Link
                                        href="/login"
                                        className={ctaStyles}
                                    >
                                        Entrar
                                    </Link>
                                )}
                            </>
                        )}

                        {!isMounted && (
                            <div className="w-24 h-10 bg-white/5 rounded-full animate-pulse" />
                        )}
                    </nav>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-40 bg-black/95 pt-32 px-6 md:hidden"
                >
                    <nav className="flex flex-col gap-8 text-center text-xl uppercase tracking-widest font-light text-white/80">
                        <Link href="/#atendimento" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Atendimento</Link>
                        <Link href="/team" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Time</Link>
                        <Link href="/#cursos" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Cursos</Link>
                        <Link href="/#contato" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Contato</Link>

                        {isMounted && (
                            <>
                                {user ? (
                                    role === 'admin' ? (
                                        <Link
                                            href="/admin"
                                            className={`${ctaStyles} justify-center w-full max-w-xs mx-auto`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Painel Admin
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/my-appointments"
                                            className={`${ctaStyles} justify-center w-full max-w-xs mx-auto`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <CalendarHeart className="w-4 h-4" />
                                            Meus Agendamentos
                                        </Link>
                                    )
                                ) : (
                                    <Link
                                        href="/login"
                                        className={`${ctaStyles} justify-center w-full max-w-xs mx-auto`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Entrar
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </motion.div>
            )}
        </>
    );
}
