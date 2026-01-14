"use client";

import { useTransition, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { login } from "./actions";
import { loginWithGoogle, loginWithFacebook, signupWithEmail } from "@/actions/auth-actions";
import { KeyRound, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    // const [mode, setMode] = useState<"login" | "signup">("login"); // REMOVED
    // const [success, setSuccess] = useState<string | null>(null); // REMOVED

    async function handleSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <div className="w-full">
            <GlassCard className="w-full p-8 border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl">
                {/* Header Section */}
                <div className="text-center space-y-2 mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 bg-gradient-to-br from-primary/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    >
                        <KeyRound className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h1 className="font-serif text-3xl text-gold tracking-wide">KEVELYN STUDIO</h1>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
                        Acesso Exclusivo
                    </p>
                </div>

                {/* Social Auth */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <form action={loginWithGoogle}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                    </form>
                    <form action={loginWithFacebook}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" className="text-[#1877F2]" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-[#0a0a0a]/80 backdrop-blur px-2 text-white/20 tracking-widest">
                            Ou email
                        </span>
                    </div>
                </div>

                {/* Email Form */}
                <form action={handleSubmit} className="space-y-6">

                    <div className="group relative flex items-center h-14">
                        <Mail className="absolute left-0 w-5 h-5 text-white/30 group-focus-within:text-[#D4AF37] transition-colors" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="pl-8 h-full w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 focus:ring-0 focus:border-[#D4AF37] focus-visible:ring-0 placeholder:text-white/20 text-lg text-white/90 transition-all shadow-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="group relative flex items-center h-14">
                            <Lock className="absolute left-0 w-5 h-5 text-white/30 group-focus-within:text-[#D4AF37] transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Senha"
                                required
                                className="pl-8 h-full w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 focus:ring-0 focus:border-[#D4AF37] focus-visible:ring-0 placeholder:text-white/20 text-lg text-white/90 transition-all shadow-none"
                            />
                        </div>
                        <div className="flex justify-end pt-1">
                            <a href="/forgot-password" className="text-[10px] text-white/40 hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-xs text-center bg-red-500/5 p-2 rounded border border-red-500/10"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <LuxuryButton
                        isLoading={isPending}
                        type="submit"
                        className="w-full justify-center mt-6"
                    >
                        Entrar
                    </LuxuryButton>

                    <div className="text-center pt-2">
                        <p className="text-xs text-white/30">
                            Nova aqui? <a href="/register" className="text-primary hover:underline transition-colors">Criar conta</a>
                        </p>
                    </div>
                </form>
            </GlassCard>

            <div className="text-center mt-8 text-[10px] text-white/20 tracking-[0.3em] font-serif uppercase">
                Kevelyn Studio © {new Date().getFullYear()}
            </div>
        </div>
    );
}
