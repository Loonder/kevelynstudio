import { db } from "@/lib/db";
import { courses, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CourseManager } from "@/components/admin/academy/course-manager";

interface CoursePageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function AdminCoursePage({ params }: CoursePageProps) {
    const { id } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!course) notFound();

    const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, id)).orderBy(asc(lessons.order));

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <CourseManager course={course} initialLessons={courseLessons} />
        </div>
    );
}
