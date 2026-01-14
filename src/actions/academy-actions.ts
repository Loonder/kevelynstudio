'use server';

import { db } from "@/lib/db";
import { courses, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCourse(title: string) {
    try {
        const [newCourse] = await db.insert(courses).values({
            title,
            price: 0,
            active: false
        }).returning();

        return { success: true, id: newCourse.id };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateCourse(data: any) {
    try {
        await db.update(courses).set({
            title: data.title,
            description: data.description,
            price: data.price,
            active: data.active,
            thumbnail: data.thumbnail
        }).where(eq(courses.id, data.id));

        revalidatePath("/admin/academy");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveLessons(courseId: string, lessonsData: any[]) {
    try {
        // Simple strategy: Delete all old lessons for this course and re-insert?
        // Risky if preserving IDs is important (e.g. user progress tracking).
        // Better: Upsert or diff.
        // For current scope speed: We will assume edit mode simply overrides the list structure.
        // BUT, to keep history safer for future, let's try to update existing and insert new.

        // Actually, for simplicity and since we don't have progress tracking active yet:
        // We will process the list.

        /* 
           Ideal real-world: 
           1. Get existing IDs.
           2. Determine deleted IDs.
           3. Update matched IDs.
           4. Insert new items (ones with 'temp-' IDs).
        */

        // Delete all for this course? No, foreign keys might break or logs lost.
        // Let's iterate.

        for (const lesson of lessonsData) {
            if (lesson.id && lesson.id.startsWith('temp-')) {
                // Insert
                await db.insert(lessons).values({
                    courseId: courseId,
                    title: lesson.title,
                    order: lesson.order,
                    videoUrl: lesson.videoUrl,
                    duration: lesson.duration
                });
            } else {
                // Update
                await db.update(lessons).set({
                    title: lesson.title,
                    order: lesson.order,
                    videoUrl: lesson.videoUrl,
                    duration: lesson.duration
                }).where(eq(lessons.id, lesson.id));
            }
        }

        // Check for deletions? Not implemented in this simple loop.
        // If a user removed a lesson in UI, it won't be in `lessonsData`.
        // So we should find lessons in DB that are NOT in `lessonsData` IDs.

        // This is getting complex for a "simple" task, but let's do it right.
        const currentIds = lessonsData.filter(l => !l.id.startsWith('temp-')).map(l => l.id);

        const dbLessons = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.courseId, courseId));
        const dbIds = dbLessons.map(l => l.id);

        const toDelete = dbIds.filter(id => !currentIds.includes(id));

        if (toDelete.length > 0) {
            // In Drizzle we can't use `inArray` easily strictly inside a loop without importing it, 
            // but let's assume we loop delete for safety
            for (const id of toDelete) {
                await db.delete(lessons).where(eq(lessons.id, id));
            }
        }

        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Save Lessons Error:", error);
        return { error: error.message };
    }
}
