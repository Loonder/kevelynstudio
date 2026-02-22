
"use server";

import { db } from "../lib/db";
import { appointments, services } from "../db/schema";
import { and, eq, sql, gte, lt } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function getFinancialStats() {
    const now = new Date();
    const startCurrentMonth = startOfMonth(now);
    const endCurrentMonth = endOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = endOfMonth(subMonths(now, 1));

    // Current Month Revenue
    const currentMonthData = await db.select({
        total: sql<number>`sum(${appointments.totalAmount})`
    }).from(appointments)
        .where(and(
            gte(appointments.startTime, startCurrentMonth),
            lt(appointments.startTime, endCurrentMonth),
            eq(appointments.status, 'completed')
        ));

    const currentRevenue = currentMonthData[0]?.total || 0;

    // Previous Month (for growth)
    const lastMonthData = await db.select({
        total: sql<number>`sum(${appointments.totalAmount})`
    }).from(appointments)
        .where(and(
            gte(appointments.startTime, startLastMonth),
            lt(appointments.startTime, endLastMonth),
            eq(appointments.status, 'completed')
        ));

    const lastRevenue = lastMonthData[0]?.total || 0;

    // Growth Calculation
    const growth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

    return {
        revenue: currentRevenue,
        growth: growth.toFixed(1),
        lastMonthRevenue: lastRevenue
    };
}






