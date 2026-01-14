import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Force Direct Connection
const connectionString = process.env.DIRECT_URL || (process.env.DATABASE_URL || '')
    .replace(":6543", ":5432")
    .replace("?pgbouncer=true", "");

if (!connectionString) {
    console.error("❌ No DIRECT_URL or DATABASE_URL found.");
    process.exit(1);
}

const sql = postgres(connectionString, {
    ssl: 'prefer',
    max: 1,
    idle_timeout: 20, // Match db.ts
    connect_timeout: 10,
    debug: (connection, query, params) => {
        console.log('SQL Debug:', query);
    }
});

async function migrate() {
    console.log("🐘 Connecting to DB (Direct)...");

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "methodology_steps" (
                "id" SERIAL PRIMARY KEY,
                "title" text NOT NULL,
                "description" text NOT NULL,
                "order" integer DEFAULT 0 NOT NULL,
                "active" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            );
        `;
        console.log("✅ Table 'methodology_steps' created (or already exists).");

        // Use this same script to seed if we want
        console.log("🌱 Seeding Methodology Steps...");

        // Check if empty
        const count = await sql`SELECT count(*) FROM "methodology_steps"`;
        if (count[0].count == 0) {
            await sql`
                INSERT INTO "methodology_steps" ("title", "description", "order", "active") VALUES
                ('Visagismo Analítico', 'Análise da estrutura óssea e simetria facial para um design exclusivo.', 1, true),
                ('Health First', 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', 2, true),
                ('Mapping Personalizado', 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', 3, true),
                ('Experiência Sensorial', 'Aromaterapia e conforto absoluto para um momento de desconexão total.', 4, true);
            `;
            console.log("✅ Seeded 4 steps.");
        } else {
            console.log("ℹ️ Table already has data, skipping seed.");
        }

    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await sql.end();
    }
}

migrate();
