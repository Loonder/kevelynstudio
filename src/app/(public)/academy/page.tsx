
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock Courses
const MOCK_COURSES = [
    { id: "1", title: "Masterclass de Lash Mapping", description: "Aprenda a arte da geometria ocular e crie designs de cílios personalizados.", price: 49700, thumbnail: "/images/uploads/brand-3.jpg" },
    { id: "2", title: "Arquitetura de Sobrancelhas 101", description: "Domine a proporção áurea e a teoria das cores para sobrancelhas impecáveis.", price: 39700, thumbnail: "/images/uploads/brand-4.jpg" },
    { id: "3", title: "Design de Experiência Sensorial", description: "Construa uma atmosfera de luxo que as clientes nunca esquecerão.", price: 29700, thumbnail: "/images/uploads/brand-1.jpg" },
];

export default function CoursesPage() {
    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20">
            <div className="container mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="font-serif text-6xl text-white">Kevelyn Academy</h1>
                    <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">Domine a Arte. Eleve seu Nível.</p>
                    <div className="w-px h-12 bg-primary/50 mx-auto mt-8" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_COURSES.map(course => (
                        <div key={course.id} className="group border border-white/10 bg-black hover:border-primary/30 transition-all duration-500">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            </div>
                            <div className="p-6 space-y-4">
                                <h2 className="font-serif text-xl text-white group-hover:text-primary transition-colors">{course.title}</h2>
                                <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="text-primary font-serif text-lg">R$ {(course.price / 100).toFixed(2).replace('.', ',')}</span>
                                    <Link href={`/academy/${course.id}`}>
                                        <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/10">
                                            Ver Curso
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}





