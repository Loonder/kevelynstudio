
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import PublicLayout from "../../../components/layout/PublicLayout";

export default function ProfessionalsPage() {
    const professionals = [
        {
            id: "kevelyn",
            name: "Gabriella Kevelyn",
            role: "Master Artist & Fundadora",
            bio: "A visionária por trás da Experiência Power Woman. Gabriella combina maestria técnica com uma compreensão intuitiva da estética facial.",
            image: "/images/uploads/brand-1.jpg",
            specialties: ["Lash Mapping", "Visagismo"]
        },
        // Mock data for others
        {
            id: "sarah",
            name: "Sarah Miller",
            role: "Lash Artist Sênior",
            bio: "Especialista em técnicas de volume e estilização natural.",
            image: "/images/uploads/brand-2.jpg",
            specialties: ["Volume Russo"]
        }
    ];

    return (
        <PublicLayout>
            <section className="pt-32 pb-20 px-6 bg-black min-h-screen">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-20 space-y-4">
                        <h1 className="font-serif text-5xl text-white">As Artistas</h1>
                        <p className="text-muted-foreground max-w-xl font-light">conheça as mãos por trás da perfeição.</p>
                    </div>

                    <div className="grid gap-20">
                        {professionals.map((pro, idx) => (
                            <div key={pro.id} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-1/2 aspect-[3/4] relative group overflow-hidden border border-white/5">
                                    <img src={pro.image} alt={pro.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-primary/10 group-hover:ring-primary/50 transition-all" />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className="space-y-2">
                                        <span className="text-primary text-xs uppercase tracking-widest">{pro.role}</span>
                                        <h2 className="font-serif text-4xl text-white">{pro.name}</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed font-light">{pro.bio}</p>

                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {pro.specialties.map(s => (
                                            <span key={s} className="px-3 py-1 border border-white/10 text-xs text-white/60 rounded-full hover:border-primary/50 transition-colors cursor-default">
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-8">
                                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-black uppercase tracking-widest text-xs h-12 px-8">
                                            Agendar com {pro.name.split(' ')[0]}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}





