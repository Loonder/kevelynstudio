
import { supabase } from "@/lib/supabase-client";
import { NextResponse } from "next/server";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export async function GET() {
    try {
        console.log("Checking methodology steps in Supabase...");

        const { count, error } = await supabase
            .from('methodology_steps')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', TENANT_ID);

        if (error) throw error;

        if (count === 0) {
            await supabase.from('methodology_steps').insert([
                { title: 'Visagismo Analítico', description: 'Análise da estrutura óssea e simetria facial para um design exclusivo.', display_order: 1, active: true, tenant_id: TENANT_ID },
                { title: 'Health First', description: 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', display_order: 2, active: true, tenant_id: TENANT_ID },
                { title: 'Mapping Personalizado', description: 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', display_order: 3, active: true, tenant_id: TENANT_ID },
                { title: 'Experiência Sensorial', description: 'Aromaprocedimento e conforto absoluto para um momento de desconexão total.', display_order: 4, active: true, tenant_id: TENANT_ID },
            ]);
            return NextResponse.json({ message: "Table seeded in Supabase", count: 4 });
        }

        return NextResponse.json({ message: "Supabase table has data", count });
    } catch (error: any) {
        console.error("Supabase Setup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}





