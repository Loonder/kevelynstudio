"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Calendar, Users, DollarSign, Plus, LayoutDashboard, Calculator, User, FileText } from "lucide-react";
import { searchClients } from "@/actions/client-actions";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this exists or I will create it inline
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Using basic dialog to host it

function useDebounceValue<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function AdminCommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const debouncedQuery = useDebounceValue(query, 300);
    const [results, setResults] = React.useState<any[]>([]);
    const router = useRouter();

    // Toggle with Ctrl+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Search Clients
    React.useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            return;
        }

        async function search() {
            const data = await searchClients(debouncedQuery);
            setResults(data);
        }
        search();
    }, [debouncedQuery]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <Command label="Command Menu" className="bg-transparent">
                    <div className="flex items-center border-b border-white/5 px-4" cmdk-input-wrapper="">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-white/50" />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="O que você precisa?"
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none text-white placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm text-white/30">
                            Nenhum resultado encontrado.
                        </Command.Empty>

                        {query.length > 0 && results.length > 0 && (
                            <Command.Group heading="Clientes">
                                {results.map((client) => (
                                    <Command.Item
                                        key={client.id}
                                        onSelect={() => runCommand(() => router.push(`/admin/clients/edit/${client.id}`))}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{client.name}</span>
                                        <span className="ml-2 text-xs opacity-50">({client.email})</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        <Command.Group heading="Navegação">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/dashboard"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/calendar"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Agenda</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/clients"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                <span>Clientes</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Ações Rápidas">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/calendar?new=true"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Novo Agendamento</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/clients/new"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>Novo Cliente</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/admin/blog/new"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-white/70 aria-selected:bg-[#D4AF37] aria-selected:text-black transition-colors"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Novo Post Blog</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}





