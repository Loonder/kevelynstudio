"use client";

import { MapPin, Clock, Phone, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black pt-20 border-t border-white/10">
            <div className="container mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 mb-20">
                    {/* Brand & Map */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-serif text-white mb-2">KEVELYN STUDIO</h2>
                            <p className="text-white/40 text-sm max-w-xs">
                                Elevando o padrão da beleza e do olhar através de técnica, arte e sofisticação.
                            </p>
                        </div>

                        <div className="h-[250px] w-full bg-white/5 rounded-lg overflow-hidden relative border border-white/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197577019551!2d-46.652157!3d-23.563098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-white font-medium mb-6">Contato & Horários</h4>
                            <ul className="space-y-4 text-sm text-white/50">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                                    <span>Av. Paulista, 1000<br />Bela Vista, SP</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-primary shrink-0 mt-1" />
                                    <span>Seg-Sex: 09h às 20h<br />Sáb: 09h às 16h</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-primary shrink-0 mt-1" />
                                    <span>(11) 99999-9999</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6">Links Rápidos</h4>
                            <ul className="space-y-3 text-sm text-white/50">
                                <li><Link href="/book" className="hover:text-primary transition-colors">Agendar Horário</Link></li>
                                <li><Link href="/courses" className="hover:text-primary transition-colors">Kevelyn Academy</Link></li>
                                <li><Link href="/admin" className="hover:text-primary transition-colors">Área do Aluno</Link></li>
                                <li><Link href="/admin" className="hover:text-primary transition-colors">Login Admin</Link></li>
                            </ul>

                            <div className="mt-8 flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-8 border-t border-white/10 text-center text-[10px] text-white/20 uppercase tracking-widest">
                    <p>&copy; 2026 Kevelyn Studio. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
