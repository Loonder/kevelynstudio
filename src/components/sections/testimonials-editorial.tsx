"use client";

import { Star } from "lucide-react";

const REVIEWS = [
    {
        name: "Amanda S.",
        role: "Advogada",
        text: "Nunca vi um trabalho tão minucioso. O ambiente é surreal, parece que você sai de São Paulo. Minha autoestima mudou completamente."
    },
    {
        name: "Beatriz M.",
        role: "Médica",
        text: "A higiene e a técnica são impecáveis. Como médica, sou chata com biossegurança, e o Kevelyn Studio superou todas as expectativas."
    },
    {
        name: "Carol P.",
        role: "Empresária",
        text: "Faço meus cílios há 5 anos e nunca duraram tanto. O visagismo que elas fazem antes realmente muda o olhar. Virei fã."
    }
];

export function TestimonialsEditorial() {
    return (
        <section className="py-32 bg-black border-y border-white/5 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="text-gold text-xs uppercase tracking-widest mb-4 block">Depoimentos</span>
                        <h2 className="font-serif text-4xl md:text-6xl text-white">
                            Love Notes
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                        <span className="text-white/40 text-sm ml-2">5.0 de 5.0 em avaliações</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, i) => (
                        <div key={i} className="bg-surface p-10 border border-white/5 hover:border-primary/30 transition-colors duration-500 group relative">
                            <span className="text-6xl font-serif text-white/5 absolute top-6 right-8">"</span>
                            <p className="text-white/70 leading-relaxed mb-8 relative z-10 font-light italic">
                                "{review.text}"
                            </p>
                            <div>
                                <h4 className="text-white font-serif text-xl">{review.name}</h4>
                                <p className="text-primary text-xs uppercase tracking-widest mt-1">{review.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
