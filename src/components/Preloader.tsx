"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula o tempo de carregamento de assets pesados (idealmente atrelado ao load real das imagens)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    {...({
                        initial: { opacity: 1 },
                        exit: { opacity: 0 },
                        transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }
                    } as any)}
                    className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Noise for consistency */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/assets/noise.svg')]"></div>

                    <div className="relative flex flex-col items-center">
                        <motion.div
                            {...({
                                initial: { scale: 0.8, opacity: 0 },
                                animate: { scale: 1, opacity: 1 },
                                transition: { duration: 0.8, ease: "easeOut" }
                            } as any)}
                            className="w-16 h-16 mb-4 relative flex items-center justify-center"
                        >
                            {/* Minimalist Animated Logo Initial */}
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white stroke-[2]">
                                <motion.path
                                    d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80"
                                    {...({
                                        initial: { pathLength: 0 },
                                        animate: { pathLength: 1 },
                                        transition: { duration: 1.5, ease: "easeInOut" }
                                    } as any)}
                                />
                            </svg>
                        </motion.div>

                        <motion.div
                            {...({
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                transition: { delay: 0.4, duration: 0.8 }
                            } as any)}
                            className="overflow-hidden"
                        >
                            <span className="font-serif text-white tracking-[0.4em] uppercase text-xs">
                                Kevelyn
                            </span>
                        </motion.div>

                        {/* Loading Line Progress */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-12 overflow-hidden bg-white/10">
                            <motion.div
                                className="w-full bg-white origin-top"
                                {...({
                                    initial: { scaleY: 0 },
                                    animate: { scaleY: 1 },
                                    transition: { duration: 2, ease: "easeOut" }
                                } as any)}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}





