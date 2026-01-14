"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/auth/register-form";


export default function RegisterPage() {


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
                        <UserPlus className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h1 className="font-serif text-3xl text-gold tracking-wide">KEVELYN STUDIO</h1>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
                        Crie sua Conta
                    </p>
                </div>

                <RegisterForm />

            </GlassCard>

            <div className="text-center mt-8 text-[10px] text-white/20 tracking-[0.3em] font-serif uppercase">
                Kevelyn Studio © {new Date().getFullYear()}
            </div>
        </div>
    );
}
