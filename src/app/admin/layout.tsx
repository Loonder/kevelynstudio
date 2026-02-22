
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Visão Geral", icon: "📊" },
    { href: "/admin/concierge", label: "Secretária", icon: "🤖" },
    { href: "/admin/services", label: "Serviços", icon: "✨" },
    { href: "/admin/clients", label: "Registro", icon: "👥" },
    { href: "/admin/finance", label: "Financeiro", icon: "💰" },
    { href: "/admin/academy", label: "Academy", icon: "🎓" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-surface flex flex-col">
                {/* Logo */}
                <div className="h-16 border-b border-white/10 flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-serif text-lg group-hover:scale-110 transition-transform">K</div>
                        <span className="font-serif text-white tracking-widest text-sm group-hover:text-primary transition-colors">Kevelyn</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {NAV_ITEMS.map(item => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ease-in-out ${isActive
                                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                    : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span className="uppercase tracking-widest text-[10px]">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 text-xs text-white/30 text-center">
                    K-BMS v2.0
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}




