"use client";

import { MapPin, Clock, Phone } from "lucide-react";

export function LocationSection() {
    return (
        <section className="py-32 bg-black relative border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Info */}
                    <div>
                        <span className="text-gold text-xs uppercase tracking-widest mb-6 block">Localização</span>
                        <h2 className="font-serif text-4xl text-white mb-10">
                            Nosso Endereço
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Kevelyn Studio</h4>
                                    <p className="text-white/50 text-sm">
                                        Av. Paulista, 1000 - Bela Vista<br />
                                        São Paulo - SP, 01310-100
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-primary">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Horário de Atendimento</h4>
                                    <p className="text-white/50 text-sm">
                                        Segunda a Sexta: 09h às 20h<br />
                                        Sábado: 09h às 16h
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Contato</h4>
                                    <p className="text-white/50 text-sm">
                                        (11) 99999-9999<br />
                                        contato@kevelynstudio.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Iframe (Dark Mode Styled) */}
                    <div className="h-[400px] w-full bg-white/5 rounded-lg overflow-hidden relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197577019551!2d-46.652157!3d-23.563098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        {/* Overlay to darken map further if needed */}
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
}
