
import Link from "next/link";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Global Glassmorphic Header */}
            <header className="fixed top-0 w-full z-50 glass border-b-0 py-4 transition-all duration-300">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="font-serif text-2xl tracking-widest uppercase text-white cursor-pointer transition-opacity hover:opacity-80">
                        Kevelyn
                    </Link>
                    <nav className="hidden md:flex gap-8 text-[10px] tracking-editorial uppercase text-white/70">
                        <Link href="/#booking" className="hover:text-white transition-colors">Agendar</Link>
                        <Link href="/services" className="hover:text-white transition-colors">Serviços</Link>
                        <Link href="/academy" className="hover:text-white transition-colors">Academy</Link>
                    </nav>
                </div>
            </header>
            <div className="pt-20"> {/* Add padding top to account for fixed header */}
                {children}
            </div>
        </>
    );
}





