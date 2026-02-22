"use client";

import dynamic from 'next/dynamic';
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialDashboardProps {
    summary: {
        revenue: number;
        expenses: number;
        commissions: number;
        netProfit: number;
        avgTicket: number;
    };
    recentExpenses: any[]; // Type properly if possible
}

export default function FinancialDashboard({ summary, recentExpenses }: FinancialDashboardProps) {
    // Mock chart data for now as we didn't implement time-series aggregation yet
    const CHART_DATA = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
    ];

    return (
        <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-primary/20 relative overflow-hidden text-white rounded-none">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white/50 text-sm uppercase tracking-widest font-sans">Faturamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-white">{formatCurrency(summary.revenue)}</div>
                        <div className="text-green-400 text-xs mt-2 flex items-center gap-1">
                            <span>↑ Calculado</span> via Agendamentos
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 text-white rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white/50 text-sm uppercase tracking-widest font-sans">Ticket Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-white">{formatCurrency(summary.avgTicket)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 text-white rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white/50 text-sm uppercase tracking-widest font-sans">Comissões Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-white">{formatCurrency(summary.commissions)}</div>
                        <div className="text-white/30 text-xs mt-2">Valor reservado</div>
                    </CardContent>
                </Card>
            </div>

            {/* Expenses Quick View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <Card className="bg-white/5 border-white/10 text-white rounded-none">
                    <CardHeader>
                        <CardTitle className="font-serif text-xl">Tendência de Receita</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CHART_DATA}>
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '0' }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Expenses */}
                <Card className="bg-white/5 border-white/10 text-white rounded-none">
                    <CardHeader>
                        <CardTitle className="font-serif text-xl">Últimas Despesas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentExpenses.length === 0 ? (
                            <p className="text-white/30 text-sm">Nenhuma despesa registrada.</p>
                        ) : (
                            recentExpenses.map((expense) => (
                                <div key={expense.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <div className="text-white font-medium">{expense.title}</div>
                                        <div className="text-xs text-white/40">{new Date(expense.date).toLocaleDateString()} • {expense.category}</div>
                                    </div>
                                    <div className="text-red-400 font-mono">
                                        - {formatCurrency(expense.amount)}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}






