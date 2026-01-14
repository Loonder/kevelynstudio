import { AcademyPlayer } from "@/components/features/courses/academy-player";
import { SalesPage } from "@/components/features/courses/sales-page";
import { db } from "@/lib/db";
import { courses, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AcademyCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Course with Lessons (Flat structure)
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
            lessons: {
                orderBy: [asc(lessons.order)]
            }
        }
    });

    if (!course) {
        notFound();
    }

    // Check Access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let hasAccess = false;

    // Logic for access: For now, if active, show sales page. If enrolled (logic TBD), show player.
    // Since we don't have enrollments table yet, we'll auto-grant access to logged in users for Testing OR show Sales Page if not logged in.
    // Actually, let's keep it simple: Show Sales Page if not "enrolled".
    // For MVP/Demo: If user is logged in, let's assume they have access or just show it.
    // Or stricter: Only admin has access?
    // Let's Stub: If user exists, hasAccess = true (Free for all logged in for now, or just admin)

    // TEMPORARY: Allow all logged in users
    if (user) {
        hasAccess = true;
    }

    if (!hasAccess) {
        return <SalesPage course={course} />;
    }

    // Adapt flat lessons to modules structure if Player expects modules
    // Or update Player to accept lessons.
    // Assuming Player expects modules, lets create a dummy module
    const virtualModule = {
        id: 'default',
        title: 'Aulas',
        lessons: course.lessons
    };

    // We need to cast or adapt types. 
    // The player likely expects { id, title, lessons: [] }[]
    const modulesAdapter = [virtualModule];

    return (
        <AcademyPlayer
            courseId={course.id}
            courseTitle={course.title}
            description={course.description || ""}
            modules={modulesAdapter as any}
        />
    );
}
