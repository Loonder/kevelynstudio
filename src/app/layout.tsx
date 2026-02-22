import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
import Preloader from "@/components/Preloader";
import Providers from "@/components/Providers";
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
  title: {
    default: "Kevelyn Company | Elite Beauty & Academy",
    template: "%s | Kevelyn Company"
  },
  description: "A premier destination for world-class lash artistry, brow mapping, and elite beauty mentorship. Experience the gold standard in beauty.",
  keywords: ["Lashes", "Brows", "Beauty Academy", "Kevelyn", "Luxury Beauty", "Sao Paulo"],
  authors: [{ name: "Kevelyn Company" }],
  creator: "Kevelyn Company",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://kevelyn.com.br",
    title: "Kevelyn Company | Elite Beauty & Academy",
    description: "Transforming beauty into art. Specialized strategies for lashes, brows, and professional mentorship.",
    siteName: "Kevelyn Company",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kevelyn Company Elite Beauty",
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={cn(
          "relative min-h-screen font-sans bg-background text-text-primary selection:bg-primary/30 selection:text-white flex flex-col",
          cormorant.variable,
          outfit.variable
        )}>
        {/* Global Cinematic Noise */}
        <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/assets/noise.svg')]"></div>

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}




