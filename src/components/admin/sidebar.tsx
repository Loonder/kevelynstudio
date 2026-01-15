'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    GraduationCap,
    Star,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Agenda",
        href: "/admin/calendar",
        icon: Calendar,
    },
    {
        title: "Clientes",
        href: "/admin/clients",
        icon: Users,
    },
    {
        title: "Profissionais",
        href: "/admin/professionals",
        icon: Users,
    },
    {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText,
    },
    {
        title: "Academy",
        href: "/admin/academy",
        icon: GraduationCap,
    },
    {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
];

export function AdminSidebar() {
    return (
        <aside className="w-64 bg-[#050505] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6">
                <h1 className="text-2xl font-serif text-white tracking-widest">
                    KEVELYN<span className="text-primary">.</span>
                </h1>
                <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] mt-1">Admin Console</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                <SidebarNav />
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => {
                        // In a real app, call signOut() server action here
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
}

function SidebarNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only calculating active state on client
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {sidebarItems.map((item) => {
                // Only calculate isActive after component is mounted on client
                const isActive = mounted && (
                    item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)
                );

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}
                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-primary transition-colors")} />
                        <span className="text-sm font-medium tracking-wide">{item.title}</span>
                    </Link>
                )
            })}
        </>
    )
}
