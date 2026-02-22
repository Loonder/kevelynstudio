"use client";

import { cn } from "@/lib/cn";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type ButtonProps = HTMLMotionProps<"button"> & {
    href?: never;
};

type LinkProps = Omit<HTMLMotionProps<"a">, "href"> & {
    href: string;
};

type LuxuryButtonProps = (ButtonProps | LinkProps) & {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost";
    isLoading?: boolean;
};

export function LuxuryButton({
    children,
    className,
    variant = "primary",
    isLoading,
    href,
    ...props
}: LuxuryButtonProps) {
    const baseStyles = "relative px-8 py-4 rounded-full text-sm tracking-widest uppercase font-semibold transition-all duration-300 overflow-hidden group inline-block";

    const variants = {
        primary: "bg-gradient-to-r from-primary-dark via-primary to-primary-light text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
        outline: "border border-primary/50 text-primary hover:bg-primary/10",
        ghost: "text-white/70 hover:text-primary hover:bg-white/5"
    };

    const content = (
        <>
            {/* Shine Effect Overlay */}
            {variant === "primary" && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}

            <span className="relative flex items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <Link href={href} className={cn(baseStyles, variants[variant], className)}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading}
            {...(props as ButtonProps)}
        >
            {content}
        </motion.button>
    );
}





