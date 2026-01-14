"use client";

import { BeforeAfterSlider } from "./before-after-slider";

const MOCK_RESULTS = [
    {
        id: '1',
        before: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600",
        after: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
    },
    {
        id: '2',
        before: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600",
    }
];

export function ResultsSection() {
    return (
        <section className="py-32 bg-[#050505] border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
                    <div>
                        <span className="text-primary text-[10px] uppercase tracking-[0.5em] mb-4 block">Precisão Técnica</span>
                        <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">
                            Onde a Arte <br />
                            <span className="text-primary italic">Encontra a Ciência.</span>
                        </h2>
                        <p className="text-white/50 text-xl font-light leading-relaxed max-w-xl">
                            Nossos procedimentos são um equilíbrio entre visagismo avançado e saúde ocular.
                            Cada fio é colocado com a precisão de quem entende que a beleza está nos detalhes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {MOCK_RESULTS.map(res => (
                            <BeforeAfterSlider key={res.id} {...res} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
