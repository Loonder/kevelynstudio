import { Suspense } from "react";
import dynamic from 'next/dynamic';

// Componentes Críticos (Carregamento Imediato)
// Mantemos estáticos para garantir LCP (Largest Contentful Paint) rápido
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { HeroCinematic } from "@/components/sections/hero-cinematic";
import { BrandManifesto } from "@/components/sections/brand-manifesto";
import { WhatsAppBubble } from "@/components/ui/whatsapp-bubble";

// Componentes "Abaixo da Dobra" (Carregamento Sob Demanda)
// Otimização: Adicionei ssr: true (padrão) mas com loading states visuais melhores
const ServicesList = dynamic(() => import("@/components/sections/services-list").then(mod => mod.ServicesList), {
  loading: () => <SectionSkeleton height="h-[600px]" />
});

const StudioGallery = dynamic(() => import("@/components/sections/studio-gallery").then(mod => mod.StudioGallery), {
  loading: () => <SectionSkeleton height="h-[500px]" />
});

const AcademyPromo = dynamic(() => import("@/components/sections/academy-promo").then(mod => mod.AcademyPromo));
const ResultsSection = dynamic(() => import("@/components/features/results/results-section").then(mod => mod.ResultsSection));
const TeamEditorial = dynamic(() => import("@/components/sections/team-editorial").then(mod => mod.TeamEditorial));
const FAQSection = dynamic(() => import("@/components/sections/faq-section").then(mod => mod.FAQSection));
const MethodologySectionWrapper = dynamic(() => import("@/components/sections/methodology-wrapper").then(mod => mod.MethodologySectionWrapper));
const ContactSection = dynamic(() => import("@/components/sections/contact-section").then(mod => mod.ContactSection));
const BlogPreview = dynamic(() => import("@/components/sections/blog-preview").then(mod => mod.BlogPreview));
const TestimonialsEditorial = dynamic(() => import("@/components/sections/testimonials-editorial").then(mod => mod.TestimonialsEditorial));

// Skeleton Reutilizável para evitar Layout Shift (CLS)
const SectionSkeleton = ({ height }: { height: string }) => (
  <div className={`w-full ${height} bg-neutral-900/50 animate-pulse border-y border-white/5`} />
);

export default async function Home() {
  // DICA DE OURO: Se os componentes abaixo buscam dados do DB, 
  // o ideal seria buscar TUDO aqui em paralelo (Promise.all) e passar via props.
  // Por enquanto, mantive a estrutura original para não quebrar sua lógica interna.

  return (
    <>
      <NavBar />
      <WhatsAppBubble />

      <main className="min-h-screen bg-background selection:bg-primary/30">
        {/* Renderização Prioritária (Acima da dobra) */}
        <HeroCinematic />
        <BrandManifesto />

        {/* Renderização Progressiva (Abaixo da dobra) */}
        <div className="flex flex-col gap-0">
          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <ServicesList />
          </Suspense>

          <ResultsSection />
          <AcademyPromo />
          <TeamEditorial />
          <StudioGallery />

          <Suspense fallback={
            <div className="py-32 flex flex-col items-center justify-center bg-[#050505]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/20 text-xs tracking-widest uppercase">Carregando Metodologia...</p>
            </div>
          }>
            <MethodologySectionWrapper />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
            <BlogPreview />
          </Suspense>

          <TestimonialsEditorial />
          <ContactSection />
          <FAQSection />
        </div>
      </main>

      <Footer />
    </>
  );
}