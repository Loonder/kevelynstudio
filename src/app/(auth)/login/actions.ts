'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Por favor, preencha todos os campos.' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Credenciais inválidas. Tente novamente.' }
    }

    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
        // Fetch user role from clients table
        // Note: We might need a more robust way to link auth_users to clients if not already 1:1 linked via trigger
        // For now assuming we can find by email or authUserId if linked.
        // Let's rely on finding client by email which is unique.

        const { data: clientData } = await supabase
            .from('clients')
            .select('role')
            .eq('email', email)
            .single()

        revalidatePath('/', 'layout')

        const role = clientData?.role || 'client'

        switch (role) {
            case 'admin':
                redirect('/admin')
            case 'reception':
                redirect('/dashboard')
            default:
                redirect('/book') // Or /profile 
        }
    }

    revalidatePath('/', 'layout')
    redirect('/book') // Default safety
}
