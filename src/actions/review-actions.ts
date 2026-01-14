'use server';

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createReview(data: any) {
    try {
        await db.insert(reviews).values({
            clientName: data.clientName,
            rating: data.rating,
            comment: data.comment,
            photoUrl: data.photoUrl,
            approved: data.approved
        });
        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function approveReview(id: string) {
    try {
        await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteReview(id: string) {
    try {
        await db.delete(reviews).where(eq(reviews.id, id));
        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
