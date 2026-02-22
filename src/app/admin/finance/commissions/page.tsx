
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCommissions } from "@/actions/finance-actions";
import CommissionsClient from "../../../../components/admin/finance/commissions-client";

export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
    const commissions = await getCommissions();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/finance" className="text-white/50 hover:text-white">← Finance</Link>
                    <h1 className="text-2xl font-serif text-white">Comissões</h1>
                </div>
            </div>

            <CommissionsClient initialCommissions={commissions} />
        </div>
    );
}





