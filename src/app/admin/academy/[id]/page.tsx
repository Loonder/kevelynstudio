import { supabase } from "@/lib/supabase-client";
import { notFound } from "next/navigation";
import { CourseManager } from "@/components/admin/academy/course-manager";

interface CoursePageProps {
    params: Promise<{
        id: string;
    }>
}

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function AdminCoursePage({ params }: CoursePageProps) {
    const { id } = await params;

    // Fetch Course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (courseError || !course) notFound();

    // Fetch Lessons
    const { data: courseLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .eq('tenant_id', TENANT_ID)
        .order('display_order', { ascending: true });

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <CourseManager course={course} initialLessons={courseLessons || []} />
        </div>
    );
}
