"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        q: "Qual a durabilidade dos procedimentos?",
        a: "A extensão de cílios dura em média 20 a 30 dias com a manutenção correta. O Brow Lamination permanece por até 45 dias, dependendo do ciclo de crescimento dos seus fios."
    },
    {
        q: "Os procedimentos danificam os fios naturais?",
        a: "Absolutamente não. Nossa metodologia 'Health First' prioriza a integridade dos seus fios. Utilizamos isolamento perfeito e pesos calculados para não sobrecarregar a raiz."
    },
    {
        q: "Preciso fazer algum preparo antes de ir?",
        a: "Pedimos apenas que venha sem maquiagem na região dos olhos/sobrancelhas. Evite cafeína 3 horas antes para reduzir a tremedeira das pálpebras, garantindo uma aplicação mais precisa."
    },
    {
        q: "Posso molhar as extensões?",
        a: "Sim! Utilizamos adesivos de alta tecnologia que permitem molhar após 24h. A higiene diária é, inclusive, fundamental para a durabilidade e saúde ocular."
    },
    {
        q: "Existe contraindicação?",
        a: "Gestantes (com autorização médica), pessoas com alergias a acrilatos ou infecções oculares ativas devem evitar. Faremos uma ficha de anamnese detalhada antes do seu atendimento."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 bg-surface">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-20">
                    <span className="text-gold text-xs uppercase tracking-widest mb-4 block">Dúvidas Frequentes</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-white">
                        Você pergunta, <br /> nós explicamos.
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border border-white/5 bg-white/[0.02] rounded-lg overflow-hidden transition-all hover:border-white/10">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                            >
                                <span className={`font-serif text-lg md:text-xl transition-colors ${openIndex === i ? 'text-primary' : 'text-white'}`}>
                                    {faq.q}
                                </span>
                                <Plus className={`w-5 h-5 text-white/50 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : 'rotate-0'}`} />
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 md:p-8 pt-0 text-white/50 leading-relaxed border-t border-white/5">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
