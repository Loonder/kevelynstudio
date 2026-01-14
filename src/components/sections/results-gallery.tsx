"use client";

import { BeforeAfterSlider } from "@/components/features/results/before-after-slider";
import { motion } from "framer-motion";

const MOCK_RESULTS = [
    {
        id: "1",
        before: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600",
        after: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
        label: "Lash Design - Volume Russo Premium"
    },
    {
        id: "2",
        before: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600",
        label: "Micropigmentação Labial - Neutralização"
    },
    {
        id: "3",
        before: "https://images.unsplash.com/photo-1596130107244-84d5c4d1d497?q=80&w=600",
        after: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600",
        label: "Visagismo de Sobrancelhas"
    }
];

export function ResultsGallery() {
    return (
        <section className="py-32 bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary text-[10px] uppercase tracking-[0.5em] mb-4 block"
                    >
                        Autoridade & Resultados
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-serif text-white mb-8"
                    >
                        Transformações <span className="text-primary italic">Reais.</span>
                    </motion.h2>
                    <div className="w-24 h-[1px] bg-primary mx-auto opacity-30" />
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {MOCK_RESULTS.map((res, i) => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <BeforeAfterSlider {...res} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
