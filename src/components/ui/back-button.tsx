"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/admin") return null;

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-all mb-4 group"
        >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Voltar</span>
        </button>
    );
}





