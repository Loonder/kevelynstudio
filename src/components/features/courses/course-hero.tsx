"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CourseHeroProps {
    title: string;
    subtitle: string;
    videoUrl?: string | null;
}

export function CourseHero({ title, subtitle, videoUrl }: CourseHeroProps) {
    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {videoUrl ? (
                    <video
                        src={videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-50"
                    />
                ) : (
                    // Cinematic Abstract Background (Gold/Black)
                    <div className={cn(
                        "w-full h-full",
                        "bg-[radial-gradient(circle_at_center,_var(--color-surface)_0%,_#000_100%)]"
                    )}>
                        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-primary text-sm md:text-base uppercase tracking-[0.4em] mb-6 font-medium"
                >
                    Formação Presencial
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight drop-shadow-2xl"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-2xl mx-auto text-lg text-white/70 font-light"
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
            </motion.div>
        </section>
    );
}
