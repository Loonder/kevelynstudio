"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-950 border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-white font-medium text-sm mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.color }}></div>
                    <p className="text-white/80 text-sm">
                        {payload[0].value} agendamentos
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function TeamPerfChart({ data }: { data: any[] }) {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical" barSize={20}>
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}





