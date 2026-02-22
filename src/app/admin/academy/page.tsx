
import { getCourses } from "@/actions/academy-actions";
import AcademyClient from "../../../components/admin/academy/academy-page-client";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const coursesVar = await getCourses();
    return <AcademyClient initialCourses={coursesVar} />;
}




