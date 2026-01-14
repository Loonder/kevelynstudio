"use client";

import { motion, AnimatePresence } from "framer-motion";

export function WelcomeOverlay({
    isVisible,
    clientName,
    sensoryPrefs,
    onClose
}: {
    isVisible: boolean;
    clientName: string;
    sensoryPrefs?: {
        favoriteMusic?: string;
        drinkPreference?: string;
    };
    onClose?: () => void
}) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden"
                    onClick={onClose}
                >
                    {/* Background Atmosphere - Moving Gradients */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black animate-pulse" />

                    <motion.div
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center relative z-10 max-w-4xl"
                    >
                        <motion.span
                            initial={{ letterSpacing: "1em", opacity: 0 }}
                            animate={{ letterSpacing: "0.5em", opacity: 1 }}
                            transition={{ delay: 0.5, duration: 2 }}
                            className="text-primary text-sm md:text-base uppercase mb-12 block font-light"
                        >
                            O Seu Momento Começou
                        </motion.span>

                        <h1 className="font-serif text-6xl md:text-9xl text-white mb-8 leading-tight">
                            {clientName}
                        </h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="flex flex-col items-center gap-4 text-white/60 font-serif italic text-xl md:text-2xl"
                        >
                            {sensoryPrefs?.favoriteMusic && (
                                <p>Sua playlist de <span className="text-primary">{sensoryPrefs.favoriteMusic}</span> já está tocando...</p>
                            )}
                            {sensoryPrefs?.drinkPreference && (
                                <p>Seu <span className="text-primary">{sensoryPrefs.drinkPreference}</span> favorito está sendo preparado.</p>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
