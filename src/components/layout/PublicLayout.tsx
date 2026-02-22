import Link from "next/link";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/20">
            {/* Cinematic Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 backdrop-blur-md transition-all duration-300 border-b border-white/5 bg-black/50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 transition-colors group-hover:border-primary/50 text-white">
                        <span className="font-serif text-xl italic font-light text-primary">K</span>
                    </div>
                    <span className="font-serif text-lg tracking-widest text-white uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                        Kevelyn Company
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/team" className="text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase">
                        Equipe
                    </Link>
                    <Link href="/blog" className="text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase">
                        Journal
                    </Link>
                    <Link href="/academy" className="text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase">
                        Academy
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="hidden md:flex border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-none h-10 px-6 uppercase tracking-widest text-xs">
                        Agendar Horário
                    </Button>
                    <Button size="icon" variant="ghost" className="md:hidden text-white">
                        {/* Mobile Menu Icon */}
                        <span className="sr-only">Menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20">
                {children}
            </main>

            {/* Luxury Footer */}
            <footer className="border-t border-white/5 bg-black py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-serif text-2xl text-primary">Kevelyn Company</h3>
                            <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xs">
                                Redefinindo o padrão de serviços de beleza com foco em experiência sensorial, precisão técnica e privacidade.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 mb-6">Explorar</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li><Link href="/team" className="hover:text-primary transition-colors">Equipe</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
                                <li><Link href="/academy" className="hover:text-primary transition-colors">Academy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 mb-6">Contato</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li><a href="https://www.instagram.com/kevelynbeauty_" target="_blank" className="hover:text-primary transition-colors">Instagram</a></li>
                                <li><a href="https://wa.me/5511967422133" target="_blank" className="hover:text-primary transition-colors">WhatsApp</a></li>
                                <li>R. Marajó, 9 - Jd Santa Julia</li>
                                <li>Itapecerica da Serra - SP</li>
                                <li>Cep: 06867-440</li>
                                <li>(11) 96742-2133</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50">
                        <p>© 2026 Kevelyn Company. Todos os direitos reservados.</p>
                        <p>Powered by <a href="https://paulomoraes.cloud" target="_blank" className="hover:text-primary transition-colors">Paulo Moraes</a></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}





