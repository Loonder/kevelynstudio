
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllExpenses } from "@/actions/finance-actions";
import { formatCurrency } from "@/lib/utils";
import ExpenseSheet from '../../../../components/admin/finance/expense-sheet';
import { Card, CardContent } from "@/components/ui/card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
    const expenses = await getAllExpenses();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/finance" className="text-white/50 hover:text-white">← Finance</Link>
                    <h1 className="text-2xl font-serif text-white">Despesas</h1>
                </div>
                <ExpenseSheet
                    trigger={
                        <LuxuryButton className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Despesa
                        </LuxuryButton>
                    }
                />
            </div>

            <div className="grid gap-4">
                {expenses.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-white/30">
                        Nenhuma despesa registrada.
                    </div>
                ) : (
                    expenses.map(expense => (
                        <Card key={expense.id} className="bg-white/5 border-white/10 hover:border-primary/30 transition-colors rounded-xl overflow-hidden">
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-medium text-lg">{expense.title}</h3>
                                    <div className="text-xs text-white/40 flex gap-4 mt-1">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-white/60">{expense.category}</span>
                                        <span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl text-red-400 font-serif font-medium">- {formatCurrency(expense.amount)}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}





