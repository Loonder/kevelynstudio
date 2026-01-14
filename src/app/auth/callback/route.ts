import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // SYNC AUTH USER WITH PUBLIC.CLIENTS
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // We use Supabase direct access here or Drizzle. 
                // Using Supabase client for simplicity in this edge/server route context if DB is not edge-ready
                // But we have 'db' from drizzle available. Let's try to use Supabase client first to avoid connection pool issues on redirects

                const { error: upsertError } = await supabase
                    .from('clients')
                    .upsert({
                        auth_user_id: user.id,
                        email: user.email!,
                        full_name: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || 'Cliente',
                        // Ensure role is preserved if exists, otherwise default to client is handled by DB default
                        // But upsert might overwrite role if we don't exclude it?
                        // Better to use ON CONFLICT DO NOTHING for creation, or only update details.
                        // Let's just ensure existence.
                        role: 'client' // Default role. If they are admin, they should be manually updated in DB or via separate Admin invite flow.
                    }, { onConflict: 'email', ignoreDuplicates: true }) // ignoreDuplicates to prevent overwriting Admin role

                if (upsertError) {
                    console.error("Failed to sync client record:", upsertError)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocal = origin.includes('localhost')
            if (isLocal) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('Auth Code Exchange Error:', error)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not login with provider`)
}
