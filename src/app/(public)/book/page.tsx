"use client";

import { NavBar } from "@/components/layout/nav-bar";
import { BookingProvider, useBooking } from "@/context/booking-context";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/lib/data";
import { ServiceCard } from "@/components/features/services/service-card";
import { GlassCard } from "@/components/ui/glass-card";

import { StepDateSelection } from "@/components/features/booking/step-date-selection";
import { StepClientForm } from "@/components/features/booking/step-client-form";

// Step 1: Service Selection (Simplified for Demo)
// Step 1: Service Selection (Dynamic)
import { getServicesForBooking } from "@/actions/service-actions";
import { useEffect, useState } from "react";

function StepService() {
    const { setService, nextStep } = useBooking();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getServicesForBooking().then(data => {
            setServices(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white text-center py-12">Carregando experiências...</div>;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
                <div key={service.id} onClick={() => { setService(service); nextStep(); }} className="cursor-pointer">
                    <ServiceCard service={service} index={i} />
                </div>
            ))}
        </div>
    );
}

import { StepProfessional } from "@/components/features/booking/step-professional"; // New Import


function BookPage() {
    const { state } = useBooking();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Progress Indicators */}
                <div className="flex justify-center mb-12 gap-2">
                    {[1, 2, 3, 4].map(step => (
                        <div
                            key={step}
                            className={`h-1 w-12 rounded-full transition-all duration-500 ${state.step >= step ? "bg-primary" : "bg-white/10"
                                }`}
                        />
                    ))}
                </div>

                <div className="mb-12">
                    <span className="text-primary text-xs uppercase tracking-widest">Passo {state.step} de 4</span>
                    <h1 className="text-4xl font-serif text-white mt-2">
                        {state.step === 1 && "Escolha sua Experiência"}
                        {state.step === 2 && "Escolha o Profissional"}
                        {state.step === 3 && "Data & Horário"}
                        {state.step === 4 && "Finalização"}
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {state.step === 1 && <StepService />}
                        {state.step === 2 && <StepProfessional />}
                        {state.step === 3 && <StepDateSelection />}
                        {state.step === 4 && <StepClientForm />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <BookingProvider>
            <NavBar />
            <BookPage />
        </BookingProvider>
    );
}
