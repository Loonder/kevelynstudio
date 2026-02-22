"use client";

import { useTransition, useState } from "react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signupWithEmail } from "@/actions/auth-actions";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    // Phone mask handler
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);

        let formatted = value;
        if (value.length > 2) {
            formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 7) {
            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }

        e.target.value = formatted;
    };

    async function handleSubmit(formData: FormData) {
        setError(null);
        setSuccess(null);

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        startTransition(async () => {
            const result = await signupWithEmail(formData);
            if (result?.error) {
                setError(result.error);
                toast.error(result.error);
            }
            if (result?.success) {
                if (result.checkEmail) {
                    setSuccess("Conta criada! Verifique seu email para confirmar e ativar o acesso.");
                    toast.success("Verifique seu email!");
                    // Do not redirect, let them read the message
                } else {
                    setSuccess("Conta criada com sucesso!");
                    toast.success("Bem-vinda ao Kevelyn Studio!");
                    router.push("/dashboard");
                }
            }
        });
    }


    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                {/* Name */}
                <div className="group relative flex items-center">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <Input
                        name="name"
                        type="text"
                        placeholder="Nome Completo"
                        required
                        className="pl-10 pr-4 bg-transparent border-b border-white/10 rounded-none py-3 focus:ring-0 focus:border-primary placeholder:text-white/20 text-base md:text-lg text-white transition-all"
                    />
                </div>

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

                {/* Phone */}
                <div className="group relative flex items-center">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="Telefone (WhatsApp)"
                        required
                        onChange={handlePhoneChange}
                        maxLength={15}
                        className="pl-10 pr-4 bg-transparent border-b border-white/10 rounded-none py-3 focus:ring-0 focus:border-primary placeholder:text-white/20 text-base md:text-lg text-white transition-all"
                    />
                </div>

                {/* Password */}
                <div className="group relative flex items-center">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Senha"
                        required
                        className="pl-10 pr-4 bg-transparent border-b border-white/10 rounded-none py-3 focus:ring-0 focus:border-primary placeholder:text-white/20 text-base md:text-lg text-white transition-all"
                    />
                </div>

                {/* Confirm Password */}
                <div className="group relative flex items-center">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirmar Senha"
                        required
                        className="pl-10 pr-4 bg-transparent border-b border-white/10 rounded-none py-3 focus:ring-0 focus:border-primary placeholder:text-white/20 text-base md:text-lg text-white transition-all"
                    />
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error"
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
                        key="success"
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
                Criar Conta
            </LuxuryButton>

            <div className="text-center pt-4">
                <Link
                    href="/login"
                    className="text-xs text-white/30 hover:text-white transition-colors"
                >
                    Já tem uma conta? <span className="text-primary hover:underline">Entre aqui</span>
                </Link>
            </div>
        </form>
    );
}





