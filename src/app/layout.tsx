import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
// AJUSTE 1: Importando da pasta 'ui' (Certifique-se que o arquivo está lá!)
import { SmoothScrolling } from "@/components/ui/smooth-scrolling";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Kevelyn Studio | Lash Design e Sobrancelhas",
  description: "Studio especializado em Lash Design e Sobrancelhas. Realce sua beleza natural com nossas especialistas de alto padrão.",
  icons: {
    icon: "/favicon.png", // Fallback
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Kevelyn Studio | Lash Design e Sobrancelhas",
    description: "Studio especializado em Lash Design e Sobrancelhas.",
    url: "https://kevelynstudio.paulomoraes.cloud",
    siteName: "Kevelyn Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kevelyn Studio Banner",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // AJUSTE 2: Removi 'data-scroll-behavior' para não brigar com o Lenis
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={cn(
          "relative min-h-screen font-sans bg-background text-text-primary selection:bg-primary/30 selection:text-white",
          cormorant.variable,
          outfit.variable
        )}>
        <SmoothScrolling>
          {/* AJUSTE 3: Removi o <main> daqui. O page.tsx já cuida disso. */}
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}