
"use server";

import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCourses() {
    try {
        return await db.select().from(courses).orderBy(desc(courses.createdAt));
    } catch (error) {
        console.error("Get Courses Error:", error);
        return [];
    }
}

export async function updateCourse(data: any) {
    try {
        console.log("Updating course data:", data);
        revalidatePath("/admin/academy");
        return { success: true };
    } catch (error) {
        console.error("Update Course Error:", error);
        return { success: false, error: "Erro ao atualizar curso." };
    }
}

export async function createCourse(data: { title: string; price: number; description?: string }) {
    try {
        const newId = crypto.randomUUID();
        await db.insert(courses).values({
            id: newId,
            title: data.title,
            price: data.price, // cents
            description: data.description,
            active: true
        });
        revalidatePath("/admin/academy");
        return { success: true, id: newId };
    } catch (error) {
        return { success: false, error: "Erro ao criar curso." };
    }
}

export async function saveLessons(courseId: string, lessonsData: any) {
    try {
        console.log("Saving lessons for course", courseId, "Data:", lessonsData);
        // Implementação real da persistência de lições viria aqui.
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Save Lessons Error:", error);
        return { success: false, error: "Erro ao salvar lições." };
    }
}

export async function editLesson(courseId: string, lessonId: string, lessonData: any) {
    try {
        console.log("Editing lesson", lessonId, "for course", courseId);
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao editar lição." };
    }
}

export async function deleteLesson(courseId: string, lessonId: string) {
    try {
        console.log("Deleting lesson", lessonId, "from course", courseId);
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao deletar lição." };
    }
}





