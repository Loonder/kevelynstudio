"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Image from "next/image";

// Mock Data for the grid
const INSTAGRAM_POSTS = [
    "/assets/images/hero-parallax-fg.jpg",
    "/assets/images/services-header.jpg",
    "/assets/images/reveal-portrait.jpg",
    "/assets/images/studio-ambiance.jpg",
    "/assets/images/branding-detail.jpg"
];

export function InstagramFeed({ handle }: { handle: string }) {
    return (
        <div className="py-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 rounded-full">
                        <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-serif text-lg tracking-wide">Últimas do Instagram</h4>
                        <p className="text-white/40 text-xs tracking-wider uppercase">{handle}</p>
                    </div>
                </div>
                <button className="text-xs text-primary uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-colors">
                    Seguir
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {INSTAGRAM_POSTS.slice(0, 4).map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                        <Image
                            src={src}
                            alt="Instagram Post"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            priority={src.includes('reveal-portrait.jpg')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Instagram className="w-6 h-6 text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}





