
"use client";

import { motion } from "framer-motion";

interface AnimatedCardProps {
    children: React.ReactNode;
    index?: number;
    className?: string;
}

export default function AnimatedCard({ children, index = 0, className = "" }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}





