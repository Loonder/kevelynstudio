import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import dotenv from 'dotenv';
dotenv.config();

// --- CORREÇÃO REALIZADA ---
// O Site (Runtime) PRECISA usar o Pooler (DATABASE_URL - Porta 6543) para não dar Timeout.
// O DIRECT_URL (Porta 5432) deve ser usado apenas pelo drizzle-kit (migrações), não aqui.
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || 'postgres://postgres:postgres@localhost:5432/kevelyn_studio';



const client = postgres(connectionString, {
    max: 5, // Aumentando para permitir queries paralelas sem travar
    ssl: 'prefer',
    prepare: false, // OBRIGATÓRIO: O Pooler (pgbouncer) não suporta 'prepare statements'
    idle_timeout: 20,
    connect_timeout: 3, // Fail fast if DB is unreachable
});

export const db = drizzle(client, { schema });