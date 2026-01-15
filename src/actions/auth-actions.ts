'use server';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function loginWithGoogle(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    // Add fallback for origin if not present (e.g., during build or server-side calls without request)
    // Though usually actions are triggered by requests.
    const redirectTo = origin ? `${origin}/api/auth/callback` : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo,
        },
    });

    if (error) {
        console.error(error);
        redirect("/login?error=GoogleLoginError");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function loginWithFacebook(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const redirectTo = origin ? `${origin}/api/auth/callback` : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: redirectTo,
        },
    });

    if (error) {
        console.error(error);
        redirect("/login?error=FacebookLoginError");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signupWithEmail(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                phone: phone,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Check if email confirmation is required
    if (data.user && !data.user.identities?.length) {
        return { error: "Este email já está em uso." };
    }

    if (data.session) {
        // Logged in immediately (email confirm disabled)
        return { success: true };
    } else if (data.user) {
        // User created but needs email confirmation
        return { success: true, checkEmail: true };
    }

    return { error: "Erro desconhecido ao criar conta." };
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const origin = (await headers()).get("origin");
    const redirectTo = origin ? `${origin}/auth/callback?next=/profile` : undefined; // Or separate reset password page

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Verifique seu email para redefinir a senha." };
}
