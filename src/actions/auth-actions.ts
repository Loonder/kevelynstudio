"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function loginWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        console.error("Google login error:", error.message);
        return redirect("/login?error=falha_google");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function loginWithFacebook() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: `${SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        console.error("Facebook login error:", error.message);
        return redirect("/login?error=falha_facebook");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signupWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                phone: phone,
            },
            emailRedirectTo: `${SITE_URL}/auth/callback`,
        }
    });

    if (error) {
        console.error("Signup error:", error.message);
        return { error: "Erro ao criar conta: " + error.message };
    }

    // Note: If email confirmation is enabled, data.user will be present but session might be null
    return {
        success: true,
        checkEmail: data.session === null
    };
}

export async function resetPassword(formData: FormData) {
    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/auth/callback?next=/admin/reset-password`,
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
