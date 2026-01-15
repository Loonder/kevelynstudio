import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackButton } from "@/components/ui/back-button";


import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // ADICIONADO: 'selection:bg-primary/30' para a cor de seleção do texto ficar na marca
        // REMOVIDO: 'select-none' para permitir copiar dados
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <Toaster richColors position="top-right" theme="dark" />

            {/* --- AMBIENT BACKGROUND (Otimizado para GPU) --- */}
            {/* z-0 e pointer-events-none garantem que não atrapalhe cliques */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full opacity-60 will-change-transform translate-z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full opacity-40 will-change-transform translate-z-0" />
            </div>

            {/* --- MOBILE HEADER --- */}
            <div className="md:hidden sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur border-b border-white/5 p-4 flex items-center justify-between">
                <span className="font-serif text-lg tracking-widest text-[#D4AF37]">KEVELYN<span className="text-white">.</span></span>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="text-white p-2">
                            <Menu className="w-6 h-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r border-white/10 bg-[#050505] w-64">
                        {/* Pass className="relative" to override fixed positioning */}
                        <AdminSidebar className="relative w-full h-full" />
                    </SheetContent>
                </Sheet>
            </div>

            {/* --- SIDEBAR (Desktop) --- */}
            {/* Adicionei 'border-r' e 'backdrop-blur' para o efeito vidro */}
            <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl">
                {/* AQUI ESTÁ O SCROLLAREA: Garante rolagem elegante no menu */}
                <ScrollArea className="h-full">
                    <AdminSidebar />
                </ScrollArea>
            </div>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            {/* md:ml-64 empurra o conteúdo só no desktop. No mobile fica tela cheia (ml-0 default). */}
            <main className="flex-1 md:ml-64 min-h-screen relative z-10 transition-all duration-300">
                <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto text-white relative">
                    <BackButton />
                    {children}
                </div>
            </main>
        </div>
    );
}