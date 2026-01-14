import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { clientColumns } from "@/components/admin/clients/client-columns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function AdminClientsPage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {
    // Await searchParams before using properties
    const { search } = await searchParams;
    let whereClause = undefined;

    if (search) {
        whereClause = or(
            ilike(clients.fullName, `%${search}%`),
            ilike(clients.phone, `%${search}%`),
            ilike(clients.email, `%${search}%`)
        );
    }

    const data = await db.select().from(clients).where(whereClause).orderBy(desc(clients.createdAt));

    return (
        <div className="p-8 space-y-8 min-h-screen bg-[#050505] text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Clientes</h1>
                    <p className="text-white/40">Gerencie sua base de clientes e visualize históricos.</p>
                </div>

                {/* Search Form */}
                <form className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        name="search"
                        defaultValue={search}
                        placeholder="Buscar por nome, telefone..."
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-primary"
                    />
                </form>
            </div>

            <DataTable columns={clientColumns} data={data} />
        </div>
    );
}
