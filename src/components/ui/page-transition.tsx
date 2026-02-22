
"use client";

import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const pageTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.3
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}





