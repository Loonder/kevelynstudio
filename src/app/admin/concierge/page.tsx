
import { db } from "@/lib/db";
import { appointments, clients, services } from "@/db/schema";
import { eq, and, sql, desc, lt, gte, lte } from "drizzle-orm";
import { GlassCard } from "@/components/ui/glass-card";
import { MessageCircle, Cake, CalendarClock, UserMinus } from "lucide-react";
import { startOfTomorrow, endOfTomorrow, subDays, startOfDay, endOfDay } from "date-fns";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

function WhatsAppButton({ phone, message, label }: { phone: string, message: string, label: string }) {
    // Format phone: remove non-digits, ensure country code 55 if missing (assuming BR)
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${finalPhone}?text=${encodedMessage}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
        >
            <MessageCircle className="w-3 h-3" /> {label}
        </a>
    );
}

export default async function ConciergePage() {
    const tomorrowStart = startOfTomorrow();
    const tomorrowEnd = endOfTomorrow();
    const thirtyDaysAgo = subDays(new Date(), 30);

    // 1. Confirmations (Appointments Tomorrow)
    const tomorrowAppointments = await db.select({
        id: appointments.id,
        clientName: clients.fullName,
        clientPhone: clients.phone,
        startTime: appointments.startTime,
        serviceTitle: services.title
    })
        .from(appointments)
        .innerJoin(clients, eq(appointments.clientId, clients.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(and(
            gte(appointments.startTime, tomorrowStart),
            lte(appointments.startTime, tomorrowEnd)
        ));

    // 2. Retention Risks (Last appointment > 30 days ago)
    // Complex query: Find clients whose LATEST appointment is older than 30 days.
    // For MVP/Drizzle, simpler approach: Get all clients, filter manually or use a subquery if possible.
    // Let's grab latest appointments per client.

    // Efficient raw SQL approach for "Last Visit"
    /*
    SELECT c.id, c.full_name, c.phone, MAX(a.start_time) as last_visit
    FROM clients c
    JOIN appointments a ON c.id = a.client_id
    GROUP BY c.id
    HAVING MAX(a.start_time) < thirtyDaysAgo
    */
    // Implementing simplified version: Fetch clients and their last appointment
    const inactiveClients = await db.select({
        id: clients.id,
        fullName: clients.fullName,
        phone: clients.phone,
        lastVisit: sql<string>`MAX(${appointments.startTime})`
    })
        .from(clients)
        .leftJoin(appointments, eq(clients.id, appointments.clientId))
        .groupBy(clients.id)
        .having(sql`MAX(${appointments.startTime}) < ${thirtyDaysAgo.toISOString()}`)
        .limit(20); // Limit to avoid chaos

    // 3. Birthdays (Month/Day match)
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // SQL is usually 1-indexed for date parts or depends on extract
    const currentDay = today.getDate();

    // Drizzle doesn't have a portable 'extract' in core easily, using raw sql check
    // Assuming birthDate is stored.

    const birthdayClients = await db.select()
        .from(clients)
        .where(sql`EXTRACT(MONTH FROM ${clients.birthDate}) = ${currentMonth} AND EXTRACT(DAY FROM ${clients.birthDate}) = ${currentDay}`);

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-serif text-white mb-2">Concierge Inteligente</h1>
                <p className="text-white/50">Ações diárias recomendadas para maximizar retenção e fidelidade.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* 1. Confirmations */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <CalendarClock className="w-5 h-5" />
                        <h2 className="text-lg font-serif">Confirmar Amanhã</h2>
                    </div>
                    {tomorrowAppointments.length > 0 ? tomorrowAppointments.map(appt => (
                        <GlassCard key={appt.id} className="p-4">
                            <div className="mb-3">
                                <p className="text-white font-medium">{appt.clientName}</p>
                                <p className="text-white/40 text-xs">{appt.serviceTitle} às {format(appt.startTime, 'HH:mm')}</p>
                            </div>
                            <WhatsAppButton
                                phone={appt.clientPhone}
                                message={`Olá ${appt.clientName.split(' ')[0]}! Tudo bem? Passando para confirmar seu horário amanhã às ${format(appt.startTime, 'HH:mm')} para ${appt.serviceTitle} no Kevelyn Studio. Podemos confirmar? ✨`}
                                label="Enviar Confirmação"
                            />
                        </GlassCard>
                    )) : (
                        <div className="p-6 border border-white/5 rounded-2xl text-center text-white/20 text-sm">
                            Nenhum agendamento para amanhã.
                        </div>
                    )}
                </section>

                {/* 2. Retention (Win-back) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-yellow-500 mb-2">
                        <UserMinus className="w-5 h-5" />
                        <h2 className="text-lg font-serif">Reativar Sumidas</h2>
                    </div>
                    {inactiveClients.length > 0 ? inactiveClients.map(client => (
                        <GlassCard key={client.id} className="p-4">
                            <div className="mb-3">
                                <p className="text-white font-medium">{client.fullName}</p>
                                <p className="text-white/40 text-xs">
                                    Última visita: {client.lastVisit ? format(new Date(client.lastVisit), 'dd/MM/yyyy') : 'Nunca'}
                                </p>
                            </div>
                            <WhatsAppButton
                                phone={client.phone}
                                message={`Oi ${client.fullName.split(' ')[0]}! 💖 Estamos com saudades de você aqui no Kevelyn Studio! Percebi que faz um tempinho que não vem cuidar do seu olhar. Que tal agendar um horário essa semana? Temos novidades!`}
                                label="Convite de Retorno"
                            />
                        </GlassCard>
                    )) : (
                        <div className="p-6 border border-white/5 rounded-2xl text-center text-white/20 text-sm">
                            Nenhuma cliente inativa encontrada.
                        </div>
                    )}
                </section>

                {/* 3. Birthdays */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-pink-500 mb-2">
                        <Cake className="w-5 h-5" />
                        <h2 className="text-lg font-serif">Aniversariantes do Dia</h2>
                    </div>
                    {birthdayClients.length > 0 ? birthdayClients.map(client => (
                        <GlassCard key={client.id} className="p-4">
                            <div className="mb-3">
                                <p className="text-white font-medium">{client.fullName}</p>
                                <p className="text-white/40 text-xs">{client.email}</p>
                            </div>
                            <WhatsAppButton
                                phone={client.phone}
                                message={`Parabéns ${client.fullName.split(' ')[0]}! 🎂🎈 Desejamos um dia lindo e cheio de luz! Como presente, você tem 10% de desconto no seu próximo procedimento no mês do seu aniversário. Venha celebrar conosco!`}
                                label="Enviar Parabéns"
                            />
                        </GlassCard>
                    )) : (
                        <div className="p-6 border border-white/5 rounded-2xl text-center text-white/20 text-sm">
                            Nenhuma aniversariante hoje.
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
