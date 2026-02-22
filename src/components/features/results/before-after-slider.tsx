"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";

export function BeforeAfterSlider({ before, after, label }: { before: string, after: string, label?: string }) {
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
            x.set(containerRef.current.offsetWidth / 2);
        }
    }, [x]);

    const clipPath = useTransform(x, (value) => `inset(0 ${width - value}px 0 0)`);

    return (
        <div ref={containerRef} className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/5">
            {/* Before Image (Background) */}
            <div className="absolute inset-0">
                <Image
                    src={before}
                    alt="Before Procedure"
                    fill
                    className="object-cover grayscale brightness-75 contrast-50"
                    unoptimized
                />
                <div className="absolute top-6 left-6 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-white">Antes</span>
                </div>
            </div>

            {/* After Image (Foreground) - Clipped */}
            <motion.div style={{ clipPath }} className="absolute inset-0">
                <Image
                    src={after}
                    alt="After Procedure"
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div className="absolute top-6 right-6 bg-primary/80 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-black font-bold">Depois</span>
                </div>
            </motion.div>

            {/* Slider Handle */}
            <motion.div
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                style={{ x }}
                className="absolute top-0 bottom-0 w-[2px] bg-white/50 cursor-ew-resize z-10 flex items-center justify-center hover:bg-white transition-colors"
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-black/10">
                    <GripVertical className="w-5 h-5 text-black" />
                </div>
            </motion.div>
        </div>
    );
}





