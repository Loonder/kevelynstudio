import { NavBar } from "@/components/layout/nav-bar";
import { CourseCard } from "@/components/features/courses/course-card";

// Placeholder Data until we have real seeded data
const COURSES = [
    {
        id: '1',
        slug: 'master-lash-design',
        title: 'Master Lash Design',
        description: 'Domine a arte da extensão de cílios com técnicas internacionais de visagismo e saúde ocular.',
        price: 199700, // 1997.00
        coverImageUrl: null, // Test Placeholder
        duration: '12h',
        lessonsCount: 24,
        rating: 4.9
    },
    {
        id: '2',
        slug: 'micropigmentacao-labial',
        title: 'Micropigmentação Labial Premium',
        description: 'Aprenda a técnica de revitalização e neutralização labial mais desejada do mercado.',
        price: 249700,
        coverImageUrl: null,
        duration: '16h',
        lessonsCount: 32,
        rating: 5.0
    },
    {
        id: '3',
        slug: 'marketing-para-beauty',
        title: 'Marketing para Beauty Artists',
        description: 'Estratégias de posicionamento e vendas para profissionais da beleza que querem cobrar alto ticket.',
        price: 99700,
        coverImageUrl: null,
        duration: '6h',
        lessonsCount: 10,
        rating: 4.8
    }
];

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-black pb-20">
            <NavBar />

            {/* Header */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto text-center relative z-10">
                    <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 animate-fade-in">Educação & Excelência</p>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
                        Academy <span className="text-primary">.</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Eleve sua carreira com métodos exclusivos desenvolvidos por Kevelyn.
                        Técnica, Arte e Negócios em um só lugar.
                    </p>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Course Grid */}
            <section className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map(course => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            </section>
        </main>
    );
}
