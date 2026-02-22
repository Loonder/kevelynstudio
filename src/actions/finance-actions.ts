"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function getFinancialSummary() {
    try {
        // 1. Calculate Total Revenue (Completed Appointments)
        const { data: completedAppointments, error: revenueError } = await supabase
            .from('appointments')
            .select('total_amount')
            .eq('status', 'completed')
            .eq('tenant_id', TENANT_ID);

        if (revenueError) throw revenueError;
        const totalRevenue = (completedAppointments || []).reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

        // 2. Calculate Total Expenses
        const { data: allExpenses, error: expensesError } = await supabase
            .from('expenses')
            .select('amount')
            .eq('tenant_id', TENANT_ID);

        if (expensesError) throw expensesError;
        const totalExpenses = (allExpenses || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // 3. Calculate Pending Commissions
        const { data: pendingCommissions, error: commissionsError } = await supabase
            .from('commissions')
            .select('amount')
            .eq('status', 'pending')
            .eq('tenant_id', TENANT_ID);

        if (commissionsError) throw commissionsError;
        const totalCommissions = (pendingCommissions || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // 4. Calculate Net Profit
        const netProfit = totalRevenue - totalExpenses - totalCommissions;

        // 5. Avg Ticket (Revenue / Count)
        const avgTicket = completedAppointments && completedAppointments.length > 0 ? totalRevenue / completedAppointments.length : 0;

        return {
            revenue: totalRevenue,
            expenses: totalExpenses,
            commissions: totalCommissions,
            netProfit,
            avgTicket
        };
    } catch (error) {
        console.error("Financial Summary Error (Supabase):", error);
        return {
            revenue: 0,
            expenses: 0,
            commissions: 0,
            netProfit: 0,
            avgTicket: 0
        };
    }
}

export async function getRecentExpenses() {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('date', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching recent expenses:", error);
        return [];
    }
}

export async function createExpense(data: { title: string; amount: number; category: string; date: Date }) {
    try {
        const { error } = await supabase
            .from('expenses')
            .insert({
                title: data.title,
                amount: data.amount,
                category: data.category,
                date: data.date.toISOString(),
                tenant_id: TENANT_ID
            });

        if (error) throw error;

        revalidatePath("/admin/finance");
        revalidatePath("/admin/finance/expenses");
        return { success: true };
    } catch (error) {
        console.error("Create Expense Error:", error);
        return { success: false, error: "Erro ao criar despesa." };
    }
}

export async function getAllExpenses() {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('tenant_id', TENANT_ID)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching all expenses:", error);
        return [];
    }
}

export async function getCommissions() {
    try {
        const { data, error } = await supabase
            .from('commissions')
            .select(`
                id,
                amount,
                status,
                created_at,
                paid_at,
                professionals ( name )
            `)
            .eq('tenant_id', TENANT_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((c: any) => ({
            id: c.id,
            professionalName: c.professionals?.name || 'Desconhecido',
            amount: c.amount,
            status: c.status,
            createdAt: c.created_at,
            paidAt: c.paid_at
        }));
    } catch (error) {
        console.error("Get Commissions Error (Supabase):", error);
        return [];
    }
}

export async function markCommissionPaid(id: string) {
    try {
        const { error } = await supabase
            .from('commissions')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        revalidatePath("/admin/finance/commissions");
        return { success: true };
    } catch (error) {
        console.error("Mark Commission Paid Error:", error);
        return { success: false, error: "Erro ao atualizar comissão." };
    }
}






