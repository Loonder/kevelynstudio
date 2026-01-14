import { GlassCard } from "@/components/ui/glass-card";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Suspense } from "react";
import { getRevenueChartData, getProfessionalPerformance, getKPIs, getChurnRiskClients } from "@/actions/analytics-actions";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { TeamPerfChart } from "@/components/admin/dashboard/team-perf-chart";
import { ChurnRiskCard } from "@/components/admin/dashboard/churn-card";
import { AdminCommandMenu } from "@/components/admin/admin-command-menu";
import { UpcomingTable } from "@/components/admin/dashboard/upcoming-table"; // Would need to extract table to separate file or keep here
import { TrendingUp, Users, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

function SkeletonCard() {
    return <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />;
}

async function DashboardKPIs() {
    const { avgTicket, occupancyRate, hoursBooked } = await getKPIs();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Ticket Médio</p>
                <p className="text-3xl font-serif text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(avgTicket)}
                </p>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Taxa de Ocupação</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-serif text-[#D4AF37]">{occupancyRate}%</p>
                    <span className="text-xs text-white/40 mb-1.5">{Math.round(hoursBooked)}h vendidas</span>
                </div>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-10 h-10 text-blue-400" />
                </div>
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Performance</p>
                <p className="text-sm text-white/70 mt-2">
                    Sua equipe está performando <span className="text-green-400">12% melhor</span> que o mês passado.
                </p>
            </GlassCard>
        </div>
    );
}

async function AnalyticsSection() {
    const [revenueData, prodData, churnClients] = await Promise.all([
        getRevenueChartData(),
        getProfessionalPerformance(),
        getChurnRiskClients()
    ]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Revenue Chart */}
                <GlassCard className="p-6">
                    <h3 className="text-lg font-serif text-white mb-6 pl-2 border-l-2 border-[#D4AF37]">Faturamento Semestral</h3>
                    <RevenueChart data={revenueData} />
                </GlassCard>

                {/* Team Chart */}
                <GlassCard className="p-6">
                    <h3 className="text-lg font-serif text-white mb-6 pl-2 border-l-2 border-zinc-500">Performance da Equipe</h3>
                    <TeamPerfChart data={prodData} />
                </GlassCard>
            </div>

            <div className="space-y-8">
                {/* Churn Risk */}
                <ChurnRiskCard clients={churnClients} />

                {/* Insight Card (Static for now/Motivational) */}
                <GlassCard className="p-8 flex flex-col justify-center items-center text-center relative overflow-hidden h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
                    <span className="text-6xl text-[#D4AF37]/10 mb-4 font-serif absolute top-4 left-4">"</span>
                    <p className="text-xl text-white font-serif italic max-w-xs leading-relaxed relative z-10">
                        A excelência não é um ato, mas um hábito.
                    </p>
                    <p className="mt-6 text-xs text-[#D4AF37] uppercase tracking-[0.3em]">Kevelyn Studio</p>
                </GlassCard>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <AdminCommandMenu />

            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Dashboard Executivo</h2>
                    <p className="text-white/50">Visão estratégica do seu negócio.</p>
                </div>
                <div>
                    <span className="text-sm text-white/40 bg-white/5 border border-white/10 px-4 py-2 rounded-full font-serif">
                        {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </span>
                </div>
            </header>

            <Suspense fallback={<SkeletonCard />}>
                <DashboardKPIs />
            </Suspense>

            <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl animate-pulse" />}>
                <AnalyticsSection />
            </Suspense>
        </div>
    );
}