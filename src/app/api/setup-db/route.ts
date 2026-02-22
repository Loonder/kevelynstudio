// @ts-nocheck
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Creating table...");

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "methodology_steps" (
                "id" SERIAL PRIMARY KEY,
                "title" text NOT NULL,
                "description" text NOT NULL,
                "order" integer DEFAULT 0 NOT NULL,
                "active" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            );
        `);

        // Check count
        const result = await db.execute(sql`SELECT count(*) as count FROM "methodology_steps"`);
        const count = Number(result[0].count);

        if (count === 0) {
            await db.execute(sql`
                INSERT INTO "methodology_steps" ("title", "description", "order", "active") VALUES
                ('Visagismo Analítico', 'Análise da estrutura óssea e simetria facial para um design exclusivo.', 1, true),
                ('Health First', 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', 2, true),
                ('Mapping Personalizado', 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', 3, true),
                ('Experiência Sensorial', 'Aromaprocedimento e conforto absoluto para um momento de desconexão total.', 4, true);
            `);
            return NextResponse.json({ message: "Table created and seeded", count: 4 });
        }

        return NextResponse.json({ message: "Table checked/created", count });
    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}





