
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { createExpense } from "@/actions/finance-actions";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseSheetProps {
    trigger?: React.ReactNode;
}

export default function ExpenseSheet({ trigger }: ExpenseSheetProps) {
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const result = await createExpense(data);
            if (!result.success) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            toast.success("Despesa registrada com sucesso!");
            setOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Erro ao registrar despesa.");
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            title: formData.get("title") as string,
            amount: Math.round(Number(formData.get("amount")) * 100), // convert to cents
            category: formData.get("category") as string,
            date: new Date(formData.get("date") as string),
        };

        mutation.mutate(data);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent className="bg-[#0A0A0A] border-l border-white/10 text-white w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-serif text-2xl text-red-500">
                        Nova Despesa
                    </SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Título</label>
                        <Input
                            name="title"
                            required
                            className="bg-white/5 border-white/10 text-white focus:border-red-500"
                            placeholder="Ex: Aluguel do Estúdio"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-widest">Valor (R$)</label>
                            <Input
                                name="amount"
                                type="number"
                                step="0.01"
                                required
                                className="bg-white/5 border-white/10 text-white focus:border-red-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-widest">Data</label>
                            <Input
                                name="date"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="bg-white/5 border-white/10 text-white focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-widest">Categoria</label>
                        <Select name="category" defaultValue="Fixa">
                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-red-500">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                                <SelectItem value="Fixa" className="focus:bg-white/10 focus:text-white">Despesa Fixa (Aluguel, Net)</SelectItem>
                                <SelectItem value="Insumos" className="focus:bg-white/10 focus:text-white">Insumos/Produtos</SelectItem>
                                <SelectItem value="Marketing" className="focus:bg-white/10 focus:text-white">Marketing/Ads</SelectItem>
                                <SelectItem value="Pessoal" className="focus:bg-white/10 focus:text-white">Pessoal/Equipe</SelectItem>
                                <SelectItem value="Outros" className="focus:bg-white/10 focus:text-white">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4">
                        <LuxuryButton type="submit" isLoading={mutation.isPending} className="w-full justify-center bg-red-500 text-white hover:bg-red-600 border-none">
                            Registrar Saída
                        </LuxuryButton>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}





