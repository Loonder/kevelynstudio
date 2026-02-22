
"use client";

import { motion } from "framer-motion";

export default function LuxuryLoader() {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <motion.div
                className="relative"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <motion.div
                        className="w-12 h-12 rounded-full border-t-2 border-primary"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-primary text-xl">K</span>
                </div>
            </motion.div>
        </div>
    );
}





