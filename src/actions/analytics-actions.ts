"use server";

import { db } from "@/lib/db";
import { appointments, services, professionals, clients } from "@/db/schema";
import { eq, and, gte, lte, sql, desc, isNull, or } from "drizzle-orm";
import { startOfMonth, subMonths, format, startOfToday, endOfToday } from "date-fns";

// 1. CHART: Monthly Revenue (Last 6 Months)
export async function getRevenueChartData() {
    const today = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
        const date = subMonths(today, i);
        const start = startOfMonth(date);
        const nextMonth = subMonths(today, i - 1);
        const end = startOfMonth(nextMonth); // Start of next month is effectively end of this month for < query

        const result = await db.select({
            total: sql<number>`COALESCE(SUM(${services.price}), 0)`
        })
            .from(appointments)
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .where(and(
                eq(appointments.status, 'completed'),
                gte(appointments.startTime, start),
                sql`${appointments.startTime} < ${end}` // Safer than lte endOfMonth due to time precision
            ));

        data.push({
            name: format(date, 'MMM'),
            total: (result[0]?.total || 0) / 100 // Convert cents to real
        });
    }
    return data;
}

// 2. CHART: Performance by Professional (Total Appointments)
export async function getProfessionalPerformance() {
    const start = startOfMonth(new Date());

    const result = await db.select({
        name: professionals.name,
        color: professionals.color,
        count: sql<number>`count(${appointments.id})`
    })
        .from(appointments)
        .leftJoin(professionals, eq(appointments.professionalId, professionals.id))
        .where(and(
            gte(appointments.startTime, start),
            or(eq(appointments.status, 'completed'), eq(appointments.status, 'confirmed'))
        ))
        .groupBy(professionals.name, professionals.color, professionals.id);

    return result.map(r => ({
        name: r.name,
        color: r.color || '#D4AF37',
        count: Number(r.count)
    }));
}

// 3. KPIs: Average Ticket & Occupancy (Simplified)
export async function getKPIs() {
    const start = startOfMonth(new Date());

    // Avg Ticket
    const revenueResult = await db.select({
        total: sql<number>`COALESCE(SUM(${services.price}), 0)`,
        count: sql<number>`count(*)`
    })
        .from(appointments)
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(and(
            gte(appointments.startTime, start),
            eq(appointments.status, 'completed')
        ));

    const totalRevenue = (revenueResult[0]?.total || 0) / 100;
    const count = revenueResult[0]?.count || 1; // Avoid div by zero
    const avgTicket = count > 0 ? totalRevenue / count : 0;

    // Occupancy (Simplified: Total Hours Booked / (40h week * 4 weeks * Number of Pros))
    // Let's do a simpler metric for now: Hours Booked This Month
    const durationResult = await db.select({
        mins: sql<number>`COALESCE(SUM(${services.durationMinutes}), 0)`
    })
        .from(appointments)
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(and(
            gte(appointments.startTime, start),
            or(eq(appointments.status, 'completed'), eq(appointments.status, 'confirmed'))
        ));

    const hoursBooked = (durationResult[0]?.mins || 0) / 60;

    // Estimation: 3 Pros * 8h * 22 days = ~528h capacity
    const totalCapacity = 528;
    const occupancyRate = Math.min((hoursBooked / totalCapacity) * 100, 100).toFixed(1);

    return {
        avgTicket,
        occupancyRate,
        hoursBooked
    };
}

// 4. CHURN RISK: Clients inactive > 45 days with NO future appointments
export async function getChurnRiskClients() {
    const churnDate = new Date();
    churnDate.setDate(churnDate.getDate() - 45);

    // This is a complex query. 
    // Logic:
    // 1. Last visit < 45 days ago OR Has Future Appointment -> Active (Not in risk)
    // 2. We want the opposite: Last Visit > 45 days ago AND No Future Appointments.

    // Let's fetch clients who haven't visited since churnDate
    // And filter out those who have future set.

    // Easier approach with query builder might be fetching all and filtering, but for performance let's try SQL logic
    // Or: Select clients where LastVisit < ChurnDate AND id NOT IN (Select clientId from appointments where startTime > NOW)

    // NOTE: client table has 'lastVisit' column! This makes it much easier if it is maintained.
    // Assuming 'lastVisit' is accurate (we should ensure it updates on appointment completion).

    const now = new Date();

    // Find clients with lastVisit older than 45 days (or null if they just registered and never came? maybe ignore nulls for churn)
    const riskyClients = await db.select({
        id: clients.id,
        name: clients.fullName,
        phone: clients.phone,
        lastVisit: clients.lastVisit
    })
        .from(clients)
        .where(
            lte(clients.lastVisit, churnDate)
        )
        .limit(50); // Cap for UI

    // Now filter out those with future appointments
    const reallyRisky = [];
    for (const c of riskyClients) {
        const futureAppt = await db.query.appointments.findFirst({
            where: and(
                eq(appointments.clientId, c.id),
                gte(appointments.startTime, now)
            )
        });

        if (!futureAppt) {
            reallyRisky.push(c);
        }
    }

    return reallyRisky.slice(0, 5); // Return top 5 for dashboard card
}


// 5. COMMAND PALETTE: Search Clients
export async function searchClients(query: string) {
    if (!query || query.length < 2) return [];

    const results = await db.select({
        id: clients.id,
        name: clients.fullName,
        email: clients.email
    })
        .from(clients)
        .where(sql`${clients.fullName} ILIKE ${`%${query}%`}`)
        .limit(5);

    return results;
}
