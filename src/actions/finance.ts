"use server";

import { supabase } from "@/lib/supabase-client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

async function getRevenueForPeriod(start: Date, end: Date) {
    const { data, error } = await supabase
        .from('appointments')
        .select('total_amount')
        .eq('tenant_id', TENANT_ID)
        .eq('status', 'completed')
        .gte('start_time', start.toISOString())
        .lt('start_time', end.toISOString());

    if (error) {
        console.error("Revenue Fetch Error:", error);
        return 0;
    }

    return (data || []).reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
}

export async function getFinancialStats() {
    const now = new Date();
    const startCurrentMonth = startOfMonth(now);
    const endCurrentMonth = endOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = endOfMonth(subMonths(now, 1));

    const currentRevenue = await getRevenueForPeriod(startCurrentMonth, endCurrentMonth);
    const lastRevenue = await getRevenueForPeriod(startLastMonth, endLastMonth);

    // Growth Calculation
    const growth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

    return {
        revenue: currentRevenue,
        growth: growth.toFixed(1),
        lastMonthRevenue: lastRevenue
    };
}






