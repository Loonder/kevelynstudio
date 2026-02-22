import { createClient } from "@/lib/supabase/server";
import { supabase as supabaseAdmin } from "@/lib/supabase-client";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Calendar, Clock, Star, History, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function MyAppointmentsPage() {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Client Profile from unified 'contacts' table
    const { data: client } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (!client) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <p>Perfil de cliente não encontrado. Entre em contato com o suporte.</p>
            </div>
        );
    }

    // Fetch Future Appointments
    const now = new Date().toISOString();
    const { data: futureAppts } = await supabaseAdmin
        .from('appointments')
        .select(`
            id,
            start_time,
            status,
            services!service_id (title, price),
            professionals!professional_id (name, image_url)
        `)
        .eq('contact_id', client.id)
        .eq('tenant_id', TENANT_ID)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(1);

    const nextApptData = (futureAppts || [])[0];
    const nextAppt = nextApptData ? {
        id: nextApptData.id,
        startTime: nextApptData.start_time,
        status: nextApptData.status,
        serviceTitle: (Array.isArray(nextApptData.services) ? nextApptData.services[0] : nextApptData.services)?.title,
        professionalName: (Array.isArray(nextApptData.professionals) ? nextApptData.professionals[0] : nextApptData.professionals)?.name,
        professionalImage: (Array.isArray(nextApptData.professionals) ? nextApptData.professionals[0] : nextApptData.professionals)?.image_url,
    } : null;

    // Fetch History (Past 3)
    const { data: pastAppts } = await supabaseAdmin
        .from('appointments')
        .select(`
            id,
            start_time,
            status,
            services!service_id (title, price)
        `)
        .eq('contact_id', client.id)
        .eq('tenant_id', TENANT_ID)
        .lt('start_time', now)
        .order('start_time', { ascending: false })
        .limit(3);

    const history = (pastAppts || []).map(appt => ({
        id: appt.id,
        startTime: appt.start_time,
        status: appt.status,
        serviceTitle: (Array.isArray(appt.services) ? appt.services[0] : appt.services)?.title,
        price: (Array.isArray(appt.services) ? appt.services[0] : appt.services)?.price || 0,
    }));

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <Link href="/" className="inline-flex items-center text-white/40 hover:text-[#D4AF37] transition-colors mb-4 text-xs uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Voltar para Início
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
                        Olá, <span className="text-[#D4AF37]">{(client.full_name || '').split(' ')[0]}</span>
                    </h1>
                    <p className="text-white/40 font-light tracking-wide uppercase text-xs md:text-sm">
                        Bem-vinda ao seu espaço de beleza
                    </p>
                </div>

                {/* Hero Card: Next Appointment */}
                <div className="mb-12">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Próximo Agendamento</h2>

                    {nextAppt ? (
                        <GlassCard className="p-0 overflow-hidden group border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Date & Time */}
                                <div className="bg-[#D4AF37]/10 p-6 flex flex-col justify-center items-center text-center md:w-32 border-b md:border-b-0 md:border-r border-white/5">
                                    <span className="text-3xl font-serif text-[#D4AF37] block mb-1">
                                        {format(new Date(nextAppt.startTime), "dd")}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-white/60">
                                        {format(new Date(nextAppt.startTime), "MMM", { locale: ptBR })}
                                    </span>
                                    <div className="mt-4 flex items-center gap-1 text-white/80 text-sm font-medium">
                                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                                        {format(new Date(nextAppt.startTime), "HH:mm")}
                                    </div>
                                </div>

                                {/* Center: Info */}
                                <div className="p-6 flex-1 flex flex-col justify-center relative">
                                    <h3 className="text-xl font-serif text-white mb-2">{nextAppt.serviceTitle}</h3>
                                    <div className="flex items-center gap-3 text-sm text-white/50">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 relative">
                                            {nextAppt.professionalImage ? (
                                                <Image
                                                    src={nextAppt.professionalImage}
                                                    alt={nextAppt.professionalName || 'Profissional'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#D4AF37] text-[8px] text-black font-bold">KB</div>
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
                                </div>
                            </div>
                        </GlassCard>
                    ) : (
                        <GlassCard className="py-16 px-8 text-center flex flex-col items-center justify-center border-white/5 bg-white/[0.02]">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#D4AF37]/20 to-transparent flex items-center justify-center mb-6 border border-[#D4AF37]/20">
                                <Calendar className="w-8 h-8 text-[#D4AF37]" />
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
                            <Star className="w-3 h-3 text-[#D4AF37]/60" /> Programa Fidelity
                        </h2>
                        <span className="text-xs text-[#D4AF37] font-medium tracking-wider">0 PONTOS</span>
                    </div>

                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4AF37] w-[0%] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
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
                        {history.length > 0 ? (
                            history.map((appt) => (
                                <div key={appt.id} className="flex items-center justify-between p-4 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-medium">{appt.serviceTitle}</span>
                                        <span className="text-white/30 text-xs">
                                            {format(new Date(appt.startTime), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-white/60 text-xs font-mono">
                                            {(appt.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">
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






