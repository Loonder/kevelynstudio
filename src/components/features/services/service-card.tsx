"use client";

import { motion } from "framer-motion";
import { Service } from "@/lib/data";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function ServiceCard({ service, index }: { service: Service, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative h-[400px] w-full overflow-hidden border border-white/10 bg-white/5 cursor-pointer"
        >
            {/* Background Image (Darkened) */}
            {/* Background Image or Premium Placeholder */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                {service.image && !service.image.includes("placeholder") ? (
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover opacity-40 group-hover:opacity-20 transition-opacity duration-500"
                    />
                ) : (
                    // Premium Abstract Placeholder
                    <div className={cn(
                        "w-full h-full bg-gradient-to-br from-[#111] to-[#050505]",
                        index % 2 === 0 ? "via-[#151515]" : "via-[#080808]"
                    )}>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,_#D4AF37,_transparent_70%)] group-hover:opacity-30 transition-opacity duration-700" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary text-xs tracking-widest uppercase mb-2 block font-semibold">
                        {service.category}
                    </span>
                    <h3 className="font-serif text-3xl text-white mb-2">{service.title}</h3>
                    <p className="text-white/60 text-sm max-w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {service.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 border-t border-white/10 pt-4">
                        <span className="text-white font-medium">{service.price}</span>
                        <span className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Agendar <ArrowUpRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover Border Shine */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 transition-colors duration-500" />
        </motion.div>
    );
}





