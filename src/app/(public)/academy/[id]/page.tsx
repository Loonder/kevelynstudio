
import Link from "next/link";
import PublicLayout from "../../../../components/layout/PublicLayout";
import { Button } from "../../../../components/ui/button";

// Mock Course Detail
const MOCK_COURSE = {
    id: "1",
    title: "Lash Mapping Masterclass",
    description: "A comprehensive guide to creating personalized lash designs using scientific mapping techniques. Learn eye geometry, curl selection, and length distribution.",
    price: 49700,
    thumbnail: "/images/uploads/brand-3.jpg",
    lessons: [
        { id: "l1", title: "Introduction to Lash Geometry", duration: 15 },
        { id: "l2", title: "Eye Shape Classification", duration: 22 },
        { id: "l3", title: "Mapping Techniques", duration: 35 },
        { id: "l4", title: "Curl Selection Guide", duration: 18 },
        { id: "l5", title: "Final Project: Custom Map", duration: 45 },
    ]
};

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const course = MOCK_COURSE;

    return (
        <PublicLayout>
            <article className="min-h-screen bg-black">
                {/* Hero */}
                <div className="relative h-[50vh] w-full">
                    <img src={course.thumbnail} className="w-full h-full object-cover opacity-50" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                        <div className="container mx-auto px-6 pb-12">
                            <span className="text-primary text-xs uppercase tracking-widest border border-primary/20 px-3 py-1">Masterclass</span>
                            <h1 className="font-serif text-5xl text-white mt-4">{course.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Description & Lessons */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="font-serif text-2xl text-white mb-4">About This Course</h2>
                            <p className="text-white/70 leading-relaxed">{course.description}</p>
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl text-white mb-6">Curriculum</h2>
                            <div className="space-y-3">
                                {course.lessons.map((lesson, i) => (
                                    <div key={lesson.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 text-sm">{i + 1}</span>
                                            <span className="text-white">{lesson.title}</span>
                                        </div>
                                        <span className="text-white/40 text-sm">{lesson.duration} min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Enroll Card */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-gradient-to-br from-white/5 to-black border border-primary/20 p-8 space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-serif text-primary">$ {(course.price / 100).toFixed(2)}</div>
                                <div className="text-white/40 text-sm mt-1">One-time payment</div>
                            </div>
                            <Button className="w-full bg-primary text-black hover:bg-white h-12 text-sm uppercase tracking-widest">
                                Enroll Now
                            </Button>
                            <ul className="text-sm text-white/60 space-y-2">
                                <li>✓ Lifetime Access</li>
                                <li>✓ {course.lessons.length} HD Lessons</li>
                                <li>✓ Certificate of Completion</li>
                                <li>✓ Exclusive Community</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
