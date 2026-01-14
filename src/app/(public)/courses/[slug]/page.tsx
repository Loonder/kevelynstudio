import { NavBar } from "@/components/layout/nav-bar";
import { CourseHero } from "@/components/features/courses/course-hero";
import { CourseLevels } from "@/components/features/courses/course-levels";
import { ArrowRight } from "lucide-react";

// Mock Data Database using the slugs from the listing page
const COURSE_DATA: Record<string, any> = {
    'master-lash-design': {
        title: "Master Lash Design",
        subtitle: "A formação mais completa do mercado para quem deseja se tornar referência em extensões de cílios.",
        levels: [
            {
                id: "iniciante",
                title: "Iniciante (Classic)",
                description: "Domine os fundamentos. Anatomia ocular, segurança, e a técnica Clássica Fio a Fio com perfeição.",
                features: ["Apostila Completa", "Kit Inicial Premium", "Prática em Modelo Real", "Certificado Classic"]
            },
            {
                id: "intermediario",
                title: "Intermediário (Volume)",
                description: "Avance para o Volume Russo. Aprenda a criar fans perfeitos e entregar densidade com leveza.",
                features: ["Geometria dos Fans", "Wrapping", "Mapping Avançado", "Retenção de 30+ dias"]
            },
            {
                id: "avancado",
                title: "Advanced Artistry",
                description: "Visagismo, Wispy, e Efeito Molhado. Técnicas artísticas para cobrar alto ticket.",
                features: ["Visagismo Ocular", "Marketing de Luxo", "Edição de Fotos", "Mentoria de Carreira"]
            }
        ]
    },
    'micropigmentacao-labial': {
        title: "Micropigmentação Labial",
        subtitle: "A arte da revitalização. Transforme lábios com naturalidade e sofisticação.",
        levels: [
            {
                id: "iniciante",
                title: "Fundamentos (Revita)",
                description: "Colorimetria aplicada, estrutura da pele e a técnica de Revitalização (Lip Blush).",
                features: ["Colorimetria Universal", "Anestésicos e Segurança", "Neutralização Básica", "Treino em Pele Sintética"]
            },
            {
                id: "avancado",
                title: "Master Lips (Neutralização)",
                description: "Domine lábios escuros e cicatrizes. Técnicas avançadas de neutralização e efeitos de borda infinita.",
                features: ["Lábios Étnicos", "Correção de Assimetria", "Efeito Batom", "Prática Intensiva"]
            }
        ]
    }
};

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {

    // In Next.js 15+, params is a Promise. We must await it. 
    // Wait, check Next.js version in package.json... it is 16.1.1 (Canary/RC?) -> Wait, Next 15 is latest stable.
    // Assuming standard Next.js 14 behavior for now, but user might be on 15 where params is a promise.
    // Let's safe-guard:
    const { slug } = await params;

    // Fetch data (Mock)
    const course = COURSE_DATA[slug] || COURSE_DATA['master-lash-design']; // Fallback

    return (
        <main className="min-h-screen bg-black">
            <NavBar />

            <CourseHero
                title={course.title}
                subtitle={course.subtitle}
            />

            <CourseLevels levels={course.levels} />

            {/* Sticky CTA / Footer Area */}
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">
                        Vagas Limitadas para a próxima turma.
                    </h2>
                    <p className="text-white/60 mb-12 max-w-xl mx-auto">
                        Garanta seu lugar e inicie sua transformação profissional em um ambiente de alto padrão.
                    </p>

                    <a
                        href="https://wa.me/5500000000000?text=Olá,%20tenho%20interesse%20no%20curso..." // Replace with real number later
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-[#25D366] text-black px-10 py-5 rounded-full text-lg font-bold hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105"
                    >
                        Chamar no WhatsApp <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </main>
    );
}
