"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetPassword(formData: FormData) {
    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/admin/reset-password`,
    });

    if (error) {
        console.error("Reset password error:", error.message);
        return { error: "Erro ao enviar email de recuperação. Verifique o endereço informado." };
    }

    return { success: "Email de recuperação enviado com sucesso! Verifique sua caixa de entrada." };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
}
