import { PROFESSIONALS } from "@/lib/data-professionals";
import { ProfessionalProfile } from "@/components/features/professionals/professional-profile";
import { NavBar } from "@/components/layout/nav-bar";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return PROFESSIONALS.map((prof) => ({
        slug: prof.id,
    }));
}

export default function ProfessionalPage({ params }: { params: { slug: string } }) {
    const professional = PROFESSIONALS.find((p) => p.id === params.slug);

    if (!professional) {
        notFound();
    }

    return (
        <>
            <NavBar />
            <main>
                <ProfessionalProfile professional={professional} />
            </main>
        </>
    );
}
