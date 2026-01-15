"use client";

import { useTransition, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/auth-actions";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await resetPassword(formData);
            if (result?.error) setError(result.error);
            if (result?.success) setSuccess(result.success);
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
                    <h1 className="font-serif text-3xl text-gold tracking-wide">Recuperar Senha</h1>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium max-w-[250px] mx-auto">
                        Enviaremos um link de recuperação para o seu email
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="group relative flex items-center">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="pl-10 pr-4 bg-transparent border-b border-white/10 rounded-none py-3 focus:ring-0 focus:border-primary placeholder:text-white/20 text-base md:text-lg text-white transition-all"

                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-xs text-center bg-red-500/5 p-2 rounded border border-red-500/10 mt-4"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-green-400 text-xs text-center bg-green-500/5 p-2 rounded border border-green-500/10 mt-4"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <LuxuryButton
                        isLoading={isPending}
                        type="submit"
                        className="w-full justify-center mt-8"
                    >
                        Enviar Link
                    </LuxuryButton>

                    <div className="text-center pt-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            <span>Voltar ao Login</span>
                        </Link>
                    </div>
                </form>
            </GlassCard>

            <div className="text-center mt-8 text-[10px] text-white/20 tracking-[0.3em] font-serif uppercase">
                Kevelyn Studio © {new Date().getFullYear()}
            </div>
        </div>
    );
}
