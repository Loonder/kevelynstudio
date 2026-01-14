import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema';
import { methodologySteps } from './src/db/schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kevelyn_studio')
    .replace(":6543", ":5432")
    .replace("?pgbouncer=true", "");

const client = postgres(connectionString, {
    max: 1,
    ssl: 'require',
    prepare: false
});
const db = drizzle(client, { schema });

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Methodology Steps
    console.log('Writing Methodology Steps...');
    await db.insert(methodologySteps).values([
        {
            title: "Visagismo Analítico",
            description: "Análise da estrutura óssea e simetria facial para um design exclusivo.",
            order: 1,
            active: true
        },
        {
            title: "Health First",
            description: "Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.",
            order: 2,
            active: true
        },
        {
            title: "Mapping Personalizado",
            description: "Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.",
            order: 3,
            active: true
        },
        {
            title: "Experiência Sensorial",
            description: "Aromaterapia e conforto absoluto para um momento de desconexão total.",
            order: 4,
            active: true
        }
    ]);

    console.log('✅ Methodology seeded.');
    console.log('🚀 Done!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
