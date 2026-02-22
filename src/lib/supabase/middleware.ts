import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // --- TEMPORARY BYPASS FOR DEBUGGING ---
    /*
    if ((request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard')) && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Role Protection
    if (user) {
        if (request.nextUrl.pathname.startsWith('/admin')) {
            const { data: client } = await supabase
                .from('clients')
                .select('role')
                .eq('email', user.email!)
                .single()

            if (client?.role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/book'
                return NextResponse.redirect(url)
            }
        }

        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            const { data: client } = await supabase
                .from('clients')
                .select('role')
                .eq('email', user.email!)
                .single()

            if (client?.role !== 'reception' && client?.role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/book'
                return NextResponse.redirect(url)
            }
        }
    }
    */
    // --- END BYPASS ---

    return supabaseResponse
}






