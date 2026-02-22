"use client";

import { SERVICES } from "@/lib/data";
import { ServiceCard } from "./service-card";

export function ServicesShowcase() {
    return (
        <section id="atendimento" className="py-32 bg-background relative z-10">
            <div className="container mx-auto px-6">
                <div className="mb-20">
                    <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
                        Menu de <span className="text-primary italic">Experiências</span>
                    </h2>
                    <p className="text-white/50 max-w-xl">
                        Técnicas exclusivas desenvolvidas para realçar sua beleza natural.
                        Cada procedimento começa com uma análise visagista detalhada.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-1">
                    {SERVICES.map((service, idx) => (
                        <ServiceCard key={service.id} service={service} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}





