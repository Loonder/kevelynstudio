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
  title: "Kevelyn Studio | Excellence in Beauty",
  description: "Premium Lash & Brow Design Studio. Experience the art of beauty.",
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