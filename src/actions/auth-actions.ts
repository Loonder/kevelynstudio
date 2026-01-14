"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { clients } from "@/db/schema"
import { randomUUID } from "crypto"
import { registerSchema } from "@/lib/schemas"



export async function loginWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get("origin") || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error(error)
        redirect("/login?error=Google login failed")
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function loginWithFacebook() {
    const supabase = await createClient()
    const origin = (await headers()).get("origin") || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error(error)
        redirect("/login?error=Facebook login failed")
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signupWithEmail(formData: FormData) {
    try {
        const supabase = await createClient()
        const origin = (await headers()).get("origin") || 'http://localhost:3000'

        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        }

        // Validate with Zod
        const validatedFields = registerSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors.name?.[0] || validatedFields.error.flatten().fieldErrors.email?.[0] || "Dados inválidos." };
        }

        const { name, email, password, phone } = validatedFields.data;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: {
                    full_name: name
                }
            }
        })

        if (authError) {
            console.error("Supabase SignUp Error:", authError)
            return { error: authError.message }
        }

        console.log("Supabase SignUp Success:", {
            userId: authData.user?.id,
            hasSession: !!authData.session,
            isConfirmed: authData.user?.email_confirmed_at
        });

        if (authData.user) {
            try {
                console.log("Attempting DB Insert/Update for:", email);
                // Determine insertion ID - using auth user ID as client ID if possible, or generating one.
                // It's often better to keep them separate but linked. Schema has `authUserId`.
                await db.insert(clients).values({
                    fullName: name,
                    email: email,
                    phone: phone,
                    authUserId: authData.user.id,
                    role: 'client' // Default role, but on conflict we preserve existing role
                }).onConflictDoUpdate({
                    target: clients.email,
                    set: {
                        authUserId: authData.user.id,
                        fullName: name, // user might update name on signup
                        phone: phone,   // user might update phone on signup
                        // We do NOT update 'role', preserving 'admin' if seeded.
                    }
                });
                console.log("DB Insert/Update Successful");
            } catch (dbError: any) {
                console.error("Database Insertion Error:", dbError);
                // Optional: Delete auth user if DB fails to maintain consistency?
                // For now, allow it but log error.
                return { error: "Conta criada, mas erro ao salvar perfil. Contate o suporte." };
            }
        } else {
            console.warn("No user returned from Supabase SignUp");
        }

        if (authData.user && !authData.session) {
            return { success: true, checkEmail: true };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Unexpected Signup Error:", err)
        return { error: `Erro interno: ${err.message}` }
    }
}

export async function resetPassword(formData: FormData) {
    try {
        const supabase = await createClient()
        const origin = (await headers()).get("origin") || 'http://localhost:3000'
        const email = formData.get("email") as string

        if (!email) {
            return { error: "Email é obrigatório." }
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/update-password`,
        })

        if (error) {
            console.error("Supabase Reset Password Error:", error)
            return { error: error.message }
        }

        return { success: "Link de recuperação enviado para o seu email." }
    } catch (err: any) {
        console.error("Unexpected Reset Password Error:", err)
        return { error: `Erro interno: ${err.message}` }
    }
}
