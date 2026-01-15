"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, Sparkles, Users, Store } from "lucide-react";

const tabs = [
    { name: "Serviços & Menu", href: "/admin/settings/services", icon: Sparkles },
    { name: "Equipe", href: "/admin/settings/team", icon: Users },
    { name: "Geral", href: "/admin/settings/general", icon: Store },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
                        <Settings className="w-6 h-6 text-[#D4AF37]" />
                        Configurações
                    </h2>
                    <p className="text-white/50">Gerencie a estrutura do seu negócio.</p>
                </div>
            </header>

            <div className="border-b border-white/10">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    isActive
                                        ? "border-[#D4AF37] text-[#D4AF37]"
                                        : "border-transparent text-white/50 hover:text-white/70 hover:border-white/20",
                                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors"
                                )}
                            >
                                <tab.icon
                                    className={cn(
                                        isActive ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white/60",
                                        "-ml-0.5 mr-2 h-5 w-5"
                                    )}
                                    aria-hidden="true"
                                />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <main className="min-h-[60vh]">
                {children}
            </main>
        </div>
    );
}
