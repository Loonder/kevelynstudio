"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
    name: string;
    role: string;
    quote: string;
    rating: number;
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const handleNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const handlePrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, handleNext]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div
            className="w-full max-w-5xl mx-auto relative px-4 md:px-12"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="absolute top-0 right-8 text-8xl text-primary/5 font-serif pointer-events-none z-0">
                "
            </div>

            <div className="relative h-[300px] md:h-[250px] w-full flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        {...({
                            custom: direction,
                            variants: variants,
                            initial: "enter",
                            animate: "center",
                            exit: "exit",
                            transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }
                        } as any)}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8"
                    >
                        <div className="flex gap-1 mb-6">
                            {[...Array(testimonials[currentIndex].rating)].map((_, j) => (
                                <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                            ))}
                        </div>

                        <p className="text-xl md:text-3xl text-white/90 font-light leading-relaxed mb-8 italic">
                            "{testimonials[currentIndex].quote}"
                        </p>

                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-white font-medium tracking-wide flex items-center gap-2" title="Cliente Verificada">
                                {testimonials[currentIndex].name}
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            </span>
                            <span className="text-primary text-xs uppercase tracking-widest">
                                {testimonials[currentIndex].role}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-6 mt-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    onClick={handlePrev}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    onClick={handleNext}
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}





