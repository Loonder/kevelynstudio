"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// Define the Client type
export type ClientColumn = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    lastVisit: Date | null;
    totalVisits: number | null;
    technicalNotes: string | null;
    notes: string | null;
};

export const clientColumns: ColumnDef<ClientColumn>[] = [
    {
        accessorKey: "fullName",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Telefone",
    },
    {
        accessorKey: "lastVisit",
        header: "Última Visita",
        cell: ({ row }) => {
            const date = row.getValue("lastVisit") as Date | null;
            return date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "-";
        },
    },
    {
        accessorKey: "totalVisits",
        header: "Visitas",
        cell: ({ row }) => {
            return <span className="font-mono">{row.getValue("totalVisits")}</span>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;
            return (
                <Sheet>
                    <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/clients/edit/${client.id}`}>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary" title="Editar">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </Link>

                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-white/20 hover:text-white" title="Visualizar Detalhes">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </SheetTrigger>
                    </div>
                    <SheetContent className="bg-zinc-950 border-white/10 text-white overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-gold font-serif text-2xl">{client.fullName}</SheetTitle>
                            <SheetDescription className="text-white/60">
                                Detalhes e histórico do cliente.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-2 border border-white/5">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Contato</h3>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Email:</span>
                                        <span>{client.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Telefone:</span>
                                        <span>{client.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-center">
                                    <span className="block text-2xl font-bold text-primary">{client.totalVisits}</span>
                                    <span className="text-xs text-white/60 uppercase">Visitas</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-center">
                                    <span className="block text-lg font-bold text-white">
                                        {client.lastVisit ? format(client.lastVisit, "dd/MM", { locale: ptBR }) : "-"}
                                    </span>
                                    <span className="text-xs text-white/60 uppercase">Última Visita</span>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Notas Técnicas</h3>
                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {client.technicalNotes || "Sem notas registradas."}
                                </p>
                            </div>

                            {/* General Logs/Notes */}
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Observações Gerais</h3>
                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {client.notes || "Nenhuma observação."}
                                </p>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            );
        },
    },
];
