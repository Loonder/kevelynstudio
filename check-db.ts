import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres({
    host: 'db.ynfvfwdhrtqbkmrmigol.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres.ynfvfwdhrtqbkmrmigol', // Note: "username" in postgres.js, or "user"
    user: 'postgres.ynfvfwdhrtqbkmrmigol',
    pass: 'Kevelyn@estudio1',
    ssl: 'prefer',
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    debug: (conn, query) => console.log('Executing:', query)
});

async function main() {
    console.log("Connecting...");
    try {
        const result = await sql`SELECT now()`;
        console.log("Connected! Time:", result[0].now);
        // ... rest of the code is implicitly kept if I structure replace properly, but here I'm replacing the config block and start of main.
        // Wait, replace_file_content works on chunks. I need to be careful not to delete the rest of main.


        console.log("Checking table...");
        const tableCheck = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'methodology_steps'
        `;

        if (tableCheck.length === 0) {
            console.log("Table 'methodology_steps' MISSING. Creating...");
            await sql`
                CREATE TABLE "methodology_steps" (
                    "id" SERIAL PRIMARY KEY,
                    "title" text NOT NULL,
                    "description" text NOT NULL,
                    "order" integer DEFAULT 0 NOT NULL,
                    "active" boolean DEFAULT true,
                    "created_at" timestamp DEFAULT now(),
                    "updated_at" timestamp DEFAULT now()
                );
            `;
            console.log("Table CREATED.");

            console.log("Seeding data...");
            await sql`
                INSERT INTO "methodology_steps" ("title", "description", "order", "active") VALUES
                ('Visagismo Analítico', 'Análise da estrutura óssea e simetria facial para um design exclusivo.', 1, true),
                ('Health First', 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', 2, true),
                ('Mapping Personalizado', 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', 3, true),
                ('Experiência Sensorial', 'Aromaterapia e conforto absoluto para um momento de desconexão total.', 4, true);
            `;
            console.log("Data SEEDED.");

        } else {
            console.log("Table EXISTS.");
        }

    } catch (err: any) {
        console.error("Error full:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } finally {
        await sql.end();
        console.log("Done.");
    }
}

main();
