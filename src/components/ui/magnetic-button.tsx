"use client";

import { HTMLMotionProps, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/cn";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    magneticStrength?: number;
}

export default function MagneticButton({
    children,
    className,
    magneticStrength = 20,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * (magneticStrength / 100));
        y.set(middleY * (magneticStrength / 100));
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            className={cn(className)}
            {...props}
            onMouseMove={(e) => {
                handleMouseMove(e);
                props.onMouseMove?.(e);
            }}
            onMouseLeave={(e) => {
                handleMouseLeave();
                props.onMouseLeave?.(e);
            }}
        >
            <motion.span
                style={{
                    x: useTransform(mouseXSpring, (v) => v * 0.5),
                    y: useTransform(mouseYSpring, (v) => v * 0.5),
                    display: "inline-block"
                }}
            >
                {children}
            </motion.span>
        </motion.button>
    );
}





