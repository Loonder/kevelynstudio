"use client";

import { cn } from "@/lib/cn";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "dark" | "gold";
}

export function GlassCard({
    children,
    className,
    variant = "default",
    ...props
}: GlassCardProps) {
    const variants = {
        default: "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10",
        dark: "bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/50",
        gold: "bg-primary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/20",
    };

    return (
        <motion.div
            className={cn(
                "backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500",
                variants[variant],
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
