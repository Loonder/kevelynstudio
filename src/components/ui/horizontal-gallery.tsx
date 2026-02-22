import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryItem {
    id: string | number;
    title: string;
    description: string;
    image: string;
    price: string;
    link: string;
}

interface HorizontalGalleryProps {
    items: GalleryItem[];
}

export default function HorizontalGallery({ items }: HorizontalGalleryProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // scroll-fast
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <section className="relative w-full bg-black py-16 overflow-hidden">
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex gap-6 md:gap-8 px-6 pb-12 pt-4 overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing hide-scrollbar select-none ${isDragging ? 'snap-none' : ''}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="w-[5vw] md:w-[10vw] shrink-0" />
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="snap-center shrink-0"
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card item={item} index={index} />
                    </motion.div>
                ))}
                <div className="w-[10vw] shrink-0 flex items-center justify-center snap-center">
                    <Link href="/services" className="flex flex-col items-center gap-4 text-white/50 hover:text-white transition-all hover:scale-110 duration-300 px-12 group">
                        <span className="text-xs tracking-widest uppercase group-hover:text-primary">Ver Mais</span>
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform text-primary" />
                    </Link>
                </div>
            </div>

            {/* Visual indicator of "more" */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 opacity-60 md:opacity-100" />
        </section>
    );
}

const Card = ({ item, index }: { item: GalleryItem, index: number }) => {
    return (
        <div
            className="group relative h-[450px] w-[300px] md:h-[600px] md:w-[400px] overflow-hidden bg-neutral-900 rounded-2xl block"
        >
            <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover image-grade-cinematic"
                />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black"></div>

            <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 flex flex-col justify-end h-full">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-primary text-[10px] tracking-widest uppercase mb-2 block opacity-80 group-hover:opacity-100 transition-opacity duration-500">0{index + 1}</span>
                        <span className="text-white/80 text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 opacity-100 transition-opacity duration-500">
                            {item.price}
                        </span>
                    </div>

                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">
                        {item.title}
                    </h3>

                    <p className="text-white/70 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                        {item.description}
                    </p>

                    <Link href={item.link} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs tracking-widest uppercase">
                        Explorar <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};





