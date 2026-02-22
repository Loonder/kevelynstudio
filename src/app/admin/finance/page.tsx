import FinancialDashboard from "@/components/finance/FinancialDashboard";
import Link from "next/link";
import { getFinancialSummary, getRecentExpenses } from "@/actions/finance-actions";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus } from "lucide-react";
import ExpenseSheet from "@/components/admin/finance/expense-sheet"; // We will create this next

export const dynamic = "force-dynamic";

export default async function FinancePage() {
    const summary = await getFinancialSummary();
    const recentExpenses = await getRecentExpenses();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif text-primary">Inteligência Financeira</h1>
                    <p className="text-muted-foreground text-sm">Receita, comissões e despesas.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Link href="/admin/finance/commissions" className="text-sm text-white/60 hover:text-primary transition-colors uppercase tracking-widest hidden md:block">
                        Comissões
                    </Link>

                    <ExpenseSheet
                        trigger={
                            <LuxuryButton className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Despesa
                            </LuxuryButton>
                        }
                    />
                </div>
            </div>

            <FinancialDashboard summary={summary} recentExpenses={recentExpenses} />
        </div>
    );
}





