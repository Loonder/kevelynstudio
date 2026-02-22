"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import BookingWidget from "@/components/BookingWidget";
import { ArrowRight, Star, Shield, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import MagneticButton from "@/components/ui/magnetic-button";
import HorizontalGallery from "@/components/ui/horizontal-gallery";
import { AcademyDeepDive } from "@/components/ui/academy-deep-dive";
import { StudioExperience } from "@/components/ui/studio-experience";
import TestimonialCarousel from "@/components/ui/testimonial-carousel";

// Componente para revelação de texto atrelada ao scroll (Efeito Apple)
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90%", "end center"]
    });

    // Suavizamos o progresso para que a animação não pareça "dura"
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Mapeamos o progresso do scroll do usuário (0 a 1) para a opacidade e eixo Y
    const opacity = useTransform(smoothProgress, [0, 1], [0.2, 1]);
    const y = useTransform(smoothProgress, [0, 1], [40, 0]);

    return (
        <motion.div ref={ref} {...({ style: { opacity, y } } as any)}>
            {children}
        </motion.div>
    );
};

// Fade-in animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
};

const stagger = {
    animate: {
        transition: { staggerChildren: 0.15 }
    }
};

// Services Data (Localized)
const SERVICES = [
    {
        id: "1",
        title: "Volume Russo",
        description: "Volume intenso e sofisticado para um olhar marcante. Nossa técnica exclusiva cria profundidade e dimensão.",
        image: "/images/generated/hero_lashes_1769449267789.png",
        price: "R$ 350",
        link: "/services"
    },
    {
        id: "2",
        title: "Arquitetura de Sobrancelhas",
        description: "Microblading e lamiinação de precisão. Esculpimos sobrancelhas que emolduram sua beleza única.",
        image: "/images/generated/hero_brows_1769449308418.png",
        price: "R$ 280",
        link: "/services"
    },
    {
        id: "3",
        title: "Lash Mapping",
        description: "Design personalizado baseado na geometria dos seus olhos. Precisão científica encontra arte.",
        image: "/images/generated/lash_mapping_1769449336290.png",
        price: "R$ 180",
        link: "/services"
    }
];

// Testimonials Data (Localized)
const TESTIMONIALS = [
    {
        name: "Maria Santos",
        role: "CEO, Tech Startup",
        quote: "A Kevelyn transformou minha rotina matinal. Acordo me sentindo confiante e pronta para conquistar o mundo.",
        rating: 5
    },
    {
        name: "Ana Costa",
        role: "Designer de Moda",
        quote: "A atenção aos detalhes é incomparável. Cada visita parece uma escapada de luxo.",
        rating: 5
    },
    {
        name: "Julia Lima",
        role: "Banqueira de Investimentos",
        quote: "Finalmente, um estúdio que entende as necessidades de mulheres profissionais ocupadas. Serviço impecável.",
        rating: 5
    },
];

export default function Home() {
    const heroRef = useRef(null);
    const [serviceHover, setServiceHover] = useState<string | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <SmoothScrollProvider>
            <div className="bg-black text-white overflow-hidden">
                {/* ========== CINEMATIC HERO SECTION ========== */}
                <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-black">
                    {/* Background Shader/Noise */}
                    <div className="absolute inset-0 z-20 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {/* Main Image - Full Bleed with Parallax & Slow Zoom */}
                    <motion.div
                        className="absolute inset-0 z-0 opacity-60"
                        {...({
                            style: { y: heroY },
                            initial: { scale: 1.1 },
                            animate: { scale: 1 },
                            transition: { duration: 2, ease: "easeOut" }
                        } as any)}
                    >
                        <picture>
                            {/* Ideally, add a mobile-cropped version here: <source media="(max-width: 768px)" srcSet="/images/generated/hero_lashes_mobile.png" /> */}
                            <Image
                                src="/images/generated/hero_lashes_1769449267789.png"
                                alt="Kevelyn Company Editorial"
                                fill
                                className="object-cover object-[center_30%] image-grade-cinematic"
                                priority
                                fetchPriority="high"
                            />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Editorial Content - Left Aligned */}
                    <motion.div
                        className="relative z-30 container mx-auto px-6 pt-20"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="max-w-4xl">
                            <motion.div
                                {...({
                                    initial: { opacity: 0, x: -40 },
                                    animate: { opacity: 1, x: 0 },
                                    transition: { duration: 1, delay: 0.2 }
                                } as any)}
                                className="flex items-center gap-6 mb-12"
                            >
                                <div className="h-[1px] w-24 bg-white/30"></div>
                                <span className="text-white/80 text-[10px] tracking-editorial font-medium">Est. 2017 • São Paulo</span>
                            </motion.div>

                            <RevealText>
                                <h1 className="font-serif text-6xl md:text-[100px] leading-[0.85] text-white tracking-title mb-12">
                                    <span className="block text-white/40">A Arquitetura</span>
                                    do Seu Olhar<span className="text-primary">.</span>
                                </h1>
                            </RevealText>

                            <motion.div
                                {...({
                                    initial: { opacity: 0, y: 40 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { duration: 1, delay: 0.6 }
                                } as any)}
                                className="flex flex-col md:flex-row gap-8 items-start md:items-center max-w-2xl"
                            >
                                <p className="text-white/60 text-lg font-light leading-relaxed flex-1">
                                    Não criamos apenas cílios. Criamos <span className="text-white">identidade visual</span>.
                                    Um estúdio de arquitetura facial para mulheres que lideram.
                                </p>
                                <div className="flex gap-4">
                                    <div className="h-14 font-sans">
                                        <Button
                                            className="rounded-none bg-primary text-black hover:bg-white h-full px-8 text-xs uppercase tracking-widest transition-all"
                                            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            Agendar
                                        </Button>
                                    </div>

                                    <div className="h-14 font-sans">
                                        <Button
                                            variant="ghost"
                                            className="btn-premium text-white hover:bg-transparent h-full px-8 text-xs uppercase tracking-widest border border-white/20 rounded-none"
                                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            <span className="relative z-10">Explorar</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Minimalist Scroll Indicator */}
                    <motion.div
                        {...({
                            initial: { opacity: 0 },
                            animate: { opacity: 1 },
                            transition: { delay: 1.2, duration: 1 }
                        } as any)}
                    >
                        <span className="text-white/30 text-[10px] tracking-editorial rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll to Explore</span>
                        <div className="h-24 w-[1px] bg-white/20 overflow-hidden">
                            <motion.div
                                className="h-full w-full bg-white"
                                {...({
                                    animate: { y: ['-100%', '100%'] },
                                    transition: { repeat: Infinity, duration: 2, ease: "linear" }
                                } as any)}
                            />
                        </div>
                    </motion.div>
                </section>

                {/* ========== BOOKING WIDGET SECTION ========== */}
                {/* ========== BOOKING WIDGET SECTION ========== */}
                <section id="booking" className="relative z-30 -mt-24 pb-20 px-6">
                    <div className="container mx-auto max-w-5xl">
                        <BookingWidget />
                    </div>
                </section>

                <AcademyDeepDive />

                {/* ========== FOUNDER / PHILOSOPHY SECTION ========== */}
                <section className="py-32 px-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
                    <div className="container mx-auto max-w-6xl relative">
                        <motion.div
                            {...({
                                initial: { opacity: 0 },
                                whileInView: { opacity: 1 },
                                viewport: { once: true },
                                transition: { duration: 1 }
                            } as any)}
                        >
                            <div className="space-y-8">
                                <span className="text-primary text-[10px] tracking-editorial font-medium">A Força por trás da Marca</span>
                                <h2 className="font-serif text-5xl md:text-6xl tracking-title">
                                    <span className="text-white/30">Conheça a</span><br />
                                    <span className="text-primary">Gabriela Kevelyn</span>
                                </h2>
                                <p className="text-white/50 text-lg leading-relaxed font-light">
                                    Com mais de <span className="text-white font-medium">7 anos de experiência</span> no mercado de alto padrão, Gabriela Kevelyn consolidou-se como uma das maiores referências em arquitetura de cílios e design de sobrancelhas em São Paulo.
                                </p>
                                <p className="text-white/70 text-lg leading-relaxed font-light">
                                    Mais do que transformar olhares, sua missão é elevar a auto-estima de mulheres poderosas através da precisão técnica e do luxo intencional. Como mentora, ela também lidera a <span className="text-primary hover:underline cursor-pointer italic">Academy</span>, formando a próxima geração de especialistas de elite.
                                </p>
                                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                                    <div>
                                        <div className="text-4xl font-serif text-primary">7+</div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-wider leading-tight">Anos de<br />Excelência</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-serif text-primary">5k+</div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-wider leading-tight">Clientes<br />Poderosas</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-serif text-primary">1k+</div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-wider leading-tight">Alunas<br />Mentoradas</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-br from-white/20 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02] shadow-premium">
                                    <Image
                                        src="/images/founder-black-white.jpg"
                                        alt="Gabriela Kevelyn - Founder"
                                        width={600}
                                        height={800}
                                        className="w-full aspect-[4/5] object-cover image-grade-cinematic"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <p className="text-white/90 text-sm italic font-serif leading-relaxed">
                                            "A beleza é o reflexo da sua força interior."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ========== SERVICES HIGHLIGHT CTA ========== */}
                <section id="services" className="py-32 px-6 bg-black relative border-y border-white/5 overflow-hidden">
                    {/* Dynamic Background */}
                    <AnimatePresence>
                        {serviceHover && (
                            <motion.div
                                key={serviceHover}
                                {...({
                                    initial: { opacity: 0 },
                                    animate: { opacity: 0.3 },
                                    exit: { opacity: 0 },
                                    transition: { duration: 0.5 }
                                } as any)}
                                className="absolute inset-0 z-0"
                            >
                                <Image
                                    src={serviceHover === 'lashes' ? "/images/services/lashes-elite.png" : "/images/services/brows-elite.png"}
                                    alt="Background Service"
                                    fill
                                    sizes="100vw"
                                    className="object-cover grayscale"
                                />
                                <div className="absolute inset-0 bg-black/60" />
                            </motion.div>
                        )}
                    </AnimatePresence>                    <div className="container mx-auto max-w-4xl text-center relative z-10">
                        <span className="text-primary text-[10px] tracking-editorial block mb-6">A Arte do Olhar</span>
                        <h2 className="font-serif text-5xl md:text-6xl text-white mb-8">
                            Sua Assinatura Visual
                        </h2>
                        <p className="text-white/60 text-lg font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            Descubra a verdadeira expressão do seu poder através de intervenções estéticas milimetricamente calculadas para destacar a sua força.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left max-w-4xl mx-auto">
                            <div
                                className="p-6 border-l border-white/10 hover:border-primary/50 transition-colors group cursor-pointer"
                                onMouseEnter={() => setServiceHover('lashes')}
                                onMouseLeave={() => setServiceHover(null)}
                            >
                                <h3 className="text-white font-serif text-2xl mb-2 group-hover:text-primary transition-colors">Cílios</h3>
                                <p className="text-white/40 text-sm">Volume Russo, Brasileiro e Fio a Fio.</p>
                            </div>
                            <div
                                className="p-6 border-l border-white/10 hover:border-primary/50 transition-colors group cursor-pointer"
                                onMouseEnter={() => setServiceHover('brows')}
                                onMouseLeave={() => setServiceHover(null)}
                            >
                                <h3 className="text-white font-serif text-2xl mb-2 group-hover:text-primary transition-colors">Sobrancelhas</h3>
                                <p className="text-white/40 text-sm">Design, Brow Lamination e Micropigmentação.</p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="btn-premium h-16 px-12 border-white/20 text-white bg-transparent uppercase tracking-widest transition-all duration-500 rounded-none group relative overflow-hidden"
                            asChild
                        >
                            <Link href="/services">
                                <span className="relative z-10 flex items-center">
                                    Ver Menu Completo <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </section>
                <section className="bg-gradient-to-b from-black via-stone-950 to-black overflow-hidden relative border-y border-white/5">
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="pt-32 pb-12 px-6 relative z-20 pointer-events-none">
                        <div className="container mx-auto max-w-7xl">
                            <motion.div
                                {...({
                                    initial: { opacity: 0, y: 40 },
                                    whileInView: { opacity: 1, y: 0 },
                                    viewport: { once: true },
                                    transition: { duration: 0.8 }
                                } as any)}
                            >
                                <span className="text-primary text-[10px] tracking-editorial">Alta Performance Estética</span>
                                <h2 className="font-serif text-5xl md:text-7xl mt-4 text-white tracking-title">
                                    Experiências Assinadas
                                </h2>
                            </motion.div>
                        </div>
                    </div>
                    <HorizontalGallery items={SERVICES} />
                </section>


                <StudioExperience />

                {/* ========== TESTIMONIALS SECTION ========== */}
                <section className="py-32 px-6 bg-gradient-to-b from-black to-stone-950">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            {...({
                                initial: { opacity: 0, y: 40 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true },
                                transition: { duration: 0.8 }
                            } as any)}
                        >
                            <span className="text-primary text-[10px] tracking-editorial">Depoimentos</span>
                            <h2 className="font-serif text-5xl md:text-6xl mt-4 text-white tracking-title">
                                O Que Nossas Clientes Dizem
                            </h2>
                        </motion.div>

                        <TestimonialCarousel testimonials={TESTIMONIALS} />
                    </div>
                </section>

                {/* ========== BOTTOM CTA SECTION ========== */}
                <section className="py-32 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

                    <motion.div
                        {...({
                            initial: { opacity: 0, scale: 0.95 },
                            whileInView: { opacity: 1, scale: 1 },
                            viewport: { once: true },
                            transition: { duration: 0.8 }
                        } as any)}
                    >
                        <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">
                            Pronta para <span className="text-primary italic font-light">Elevar</span><br />
                            Sua Presença?
                        </h2>
                        <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto">
                            Agende sua atendimento hoje e descubra como podemos realçar sua beleza natural
                            com precisão e arte.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                            <div className="h-16 font-sans">
                                <Button className="bg-primary text-black hover:bg-white h-full px-12 text-sm uppercase tracking-widest transition-all duration-300 rounded-none" asChild>
                                    <Link href="#booking">
                                        Agendar Experiência
                                    </Link>
                                </Button>
                            </div>

                            <div className="h-16 font-sans">
                                <Button variant="outline" className="btn-premium bg-transparent border-white/30 text-white hover:text-black h-full px-12 text-sm uppercase tracking-widest transition-all duration-300 rounded-none" asChild>
                                    <Link href="/services">
                                        <span className="relative z-10">Ver Menu Completo</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ========== LUXURY FOOTER ========== */}
                <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5 relative z-10">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-4 gap-12 mb-24">
                            <div className="md:col-span-2">
                                <h2 className="font-serif text-3xl text-white mb-6">Kevelyn Company</h2>
                                <p className="text-white/40 max-w-sm font-light leading-relaxed">
                                    O destino premier de arquitetura facial e beleza em São Paulo.
                                    Onde a precisão técnica encontra a arte da transformação pessoal.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white/40 text-[10px] tracking-editorial mb-6">Menu</h3>
                                <ul className="space-y-4">
                                    <li><Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">Início</Link></li>
                                    <li><Link href="/services" className="text-white/70 hover:text-white transition-colors text-sm">Serviços</Link></li>
                                    <li><a href="#academy" className="text-white/70 hover:text-white transition-colors text-sm">Academy</a></li>
                                    <li><Link href="/blog" className="text-white/70 hover:text-white transition-colors text-sm">Journal (Blog)</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white/40 text-[10px] tracking-editorial mb-6">Contato</h3>
                                <ul className="space-y-4">
                                    <li>
                                        <a href="https://wa.me/5511967422133" target="_blank" className="text-white/70 hover:text-white transition-colors text-sm">
                                            WhatsApp Concierge
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://instagram.com/kevelyn_beauty" target="_blank" className="text-white/70 hover:text-white transition-colors text-sm">
                                            @kevelyn_beauty
                                        </a>
                                    </li>
                                    <li className="text-white/40 text-sm pt-4">
                                        São Paulo, SP<br />Brasil
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-end pt-12 border-t border-white/5 gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-white/20 text-[10px] tracking-widest uppercase">
                                    © 2026 Kevelyn Company. All Rights Reserved.
                                </span>
                                <a href="https://paulomoraes.cloud" target="_blank" className="text-white/10 hover:text-white/30 transition-colors text-[9px] tracking-widest uppercase font-light">
                                    Powered by Paulo Moraes
                                </a>
                            </div>
                            <div className="flex gap-6">
                                <Link href="/privacy" className="text-white/20 hover:text-white transition-colors text-[10px] tracking-widest uppercase">Privacy</Link>
                                <Link href="/terms" className="text-white/20 hover:text-white transition-colors text-[10px] tracking-widest uppercase">Terms</Link>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* ========== WHATSAPP FLOATER ========== */}
                <motion.a
                    href="https://wa.me/5511967422133"
                    target="_blank"
                    {...({
                        initial: { scale: 0, opacity: 0 },
                        animate: { scale: 1, opacity: 1 },
                        transition: { delay: 2, type: "spring" }
                    } as any)}
                    className="fixed bottom-8 right-8 z-50 bg-white text-black w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] mix-blend-difference"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </motion.a>
            </div>
        </SmoothScrollProvider>
    );
}





