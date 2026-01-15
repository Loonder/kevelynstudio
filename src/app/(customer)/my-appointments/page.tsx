import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clients, appointments, professionals, services } from "@/db/schema";
import { eq, desc, and, gte, lt } from "drizzle-orm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Calendar, Clock, Star, History, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MyAppointmentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Client Profile
    const client = await db.query.clients.findFirst({
        where: eq(clients.authUserId, user.id),
    });

    if (!client) {
        // Fallback or redirect if no client profile exists (shouldn't happen with new flow)
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <p>Perfil de cliente não encontrado. Entre em contato com o suporte.</p>
            </div>
        );
    }

    // Fetch Next Appointment
    const nextAppointment = await db.query.appointments.findFirst({
        where: and(
            eq(appointments.clientId, client.id),
            // Assuming 'pending' or 'confirmed' are valid future statuses
            gte(appointments.startTime, new Date())
        ),
        orderBy: [desc(appointments.startTime)], // Actually we want the *next* one, so ascending order of future dates? 
        // Wait, "Next" usually means the closest one in the future.
        // So we want the smallest date that is >= now.
        // Use 'asc' for closest future date.
        // Let's refine the query logic below specifically.
        with: {
            professional: true,
            service: true
        }
    });

    // Correcting logic for "Next" appointment: earliest start_time >= now
    // Since Drizzle query builder might be tricky with simple findFirst sorting, 
    // I'll stick to a clearer query structure if needed, but findFirst with orderBy asc should work.

    // Actually, let's execute a clean select for better control if queries api is limited
    const futureAppointments = await db.select({
        id: appointments.id,
        startTime: appointments.startTime,
        status: appointments.status,
        professionalName: professionals.name,
        professionalImage: professionals.imageUrl,
        serviceTitle: services.title,
        price: services.price
    })
        .from(appointments)
        .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(and(
            eq(appointments.clientId, client.id),
            gte(appointments.startTime, new Date())
        ))
        .orderBy(appointments.startTime)
        .limit(1);

    const nextAppt = futureAppointments[0];


    // Fetch History (Past 3)
    const pastAppointments = await db.select({
        id: appointments.id,
        startTime: appointments.startTime,
        serviceTitle: services.title,
        price: services.price,
        status: appointments.status
    })
        .from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(and(
            eq(appointments.clientId, client.id),
            lt(appointments.startTime, new Date())
        ))
        .orderBy(desc(appointments.startTime))
        .limit(3);


    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <Link href="/" className="inline-flex items-center text-white/40 hover:text-primary transition-colors mb-4 text-xs uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Voltar para Início
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
                        Olá, <span className="text-primary">{client.fullName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-white/40 font-light tracking-wide uppercase text-xs md:text-sm">
                        Bem-vinda ao seu espaço de beleza
                    </p>
                </div>

                {/* Hero Card: Next Appointment */}
                <div className="mb-12">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Próximo Agendamento</h2>

                    {nextAppt ? (
                        <GlassCard className="p-0 overflow-hidden group border-white/10 hover:border-primary/30 transition-colors">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Date & Time */}
                                <div className="bg-primary/10 p-6 flex flex-col justify-center items-center text-center md:w-32 border-b md:border-b-0 md:border-r border-white/5">
                                    <span className="text-3xl font-serif text-primary block mb-1">
                                        {format(nextAppt.startTime, "dd")}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-white/60">
                                        {format(nextAppt.startTime, "MMM", { locale: ptBR })}
                                    </span>
                                    <div className="mt-4 flex items-center gap-1 text-white/80 text-sm font-medium">
                                        <Clock className="w-3 h-3 text-primary" />
                                        {format(nextAppt.startTime, "HH:mm")}
                                    </div>
                                </div>

                                {/* Center: Info */}
                                <div className="p-6 flex-1 flex flex-col justify-center relative">
                                    {/* Prof Image Background Blur/Overlay could be cool here, but keeping it clean */}
                                    <h3 className="text-xl font-serif text-white mb-2">{nextAppt.serviceTitle}</h3>
                                    <div className="flex items-center gap-3 text-sm text-white/50">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 relative">
                                            {nextAppt.professionalImage ? (
                                                <Image
                                                    src={nextAppt.professionalImage}
                                                    alt={nextAppt.professionalName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary text-[8px] text-black font-bold">KB</div>
                                            )}
                                        </div>
                                        <span>com {nextAppt.professionalName}</span>
                                    </div>
                                </div>

                                {/* Right: Action */}
                                <div className="p-6 md:w-48 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/5 bg-white/[0.02]">
                                    <LuxuryButton variant="outline" className="w-full text-xs h-9">
                                        Gerenciar
                                    </LuxuryButton>
                                    {/* Link to reschedule/cancel could go here */}
                                </div>
                            </div>
                        </GlassCard>
                    ) : (
                        <GlassCard className="py-16 px-8 text-center flex flex-col items-center justify-center border-white/5 bg-white/[0.02]">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center mb-6 border border-primary/20">
                                <Calendar className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-3">Seu olhar merece um destaque</h3>
                            <p className="text-white/50 mb-8 font-light text-sm max-w-sm mx-auto leading-relaxed">
                                Que tal agendar seu primeiro procedimento? Nossos especialistas estão prontos para realçar sua beleza.
                            </p>
                            <Link href="/#services">
                                <LuxuryButton className="px-10 py-6">
                                    Ver Menu de Serviços
                                </LuxuryButton>
                            </Link>
                        </GlassCard>
                    )}
                </div>

                {/* Loyalty Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-3 h-3 text-primary/60" /> Programa Fidelity
                        </h2>
                        <span className="text-xs text-primary font-medium tracking-wider">0 PONTOS</span>
                    </div>

                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                    </div>
                    <p className="text-[10px] text-white/30 mt-2 text-right uppercase tracking-widest">
                        Próxima recompensa em 100 pontos
                    </p>
                </div>

                {/* Quick History */}
                <div>
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History className="w-3 h-3" /> Histórico Recente
                    </h2>

                    <div className="space-y-2">
                        {pastAppointments.length > 0 ? (
                            pastAppointments.map((appt) => (
                                <div key={appt.id} className="flex items-center justify-between p-4 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-medium">{appt.serviceTitle}</span>
                                        <span className="text-white/30 text-xs">
                                            {format(appt.startTime, "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-white/60 text-xs font-mono">
                                            {(appt.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-primary">
                                            {appt.status === 'completed' ? 'Concluído' : appt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-white/20 italic">
                                Nenhum histórico disponível.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
