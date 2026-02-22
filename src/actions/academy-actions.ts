"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getCourses() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Courses Error:", error);
        return [];
    }
}

export async function updateCourse(data: any) {
    try {
        const { error } = await supabase
            .from('courses')
            .update({
                title: data.title,
                price: data.price,
                description: data.description,
                active: data.active
            })
            .eq('id', data.id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;
        revalidatePath("/admin/academy");
        return { success: true };
    } catch (error) {
        console.error("Update Course Error:", error);
        return { success: false, error: "Erro ao atualizar curso." };
    }
}

export async function createCourse(data: { title: string; price: number; description?: string }) {
    try {
        const { data: newCourse, error } = await supabase
            .from('courses')
            .insert({
                title: data.title,
                price: data.price,
                description: data.description,
                active: true,
                tenant_id: TENANT_ID
            })
            .select()
            .single();

        if (error) throw error;
        revalidatePath("/admin/academy");
        return { success: true, id: newCourse.id };
    } catch (error) {
        console.error("Create Course Error:", error);
        return { success: false, error: "Erro ao criar curso." };
    }
}

export async function saveLessons(courseId: string, lessonsData: any) {
    try {
        // Implementation for Supabase lessons would go here
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Save Lessons Error:", error);
        return { success: false, error: "Erro ao salvar lições." };
    }
}

export async function editLesson(courseId: string, lessonId: string, lessonData: any) {
    try {
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao editar lição." };
    }
}

export async function deleteLesson(courseId: string, lessonId: string) {
    try {
        revalidatePath(`/admin/academy/${courseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao deletar lição." };
    }
}





