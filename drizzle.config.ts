import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

// Fix for Supabase: Deployments/Migrations must use Direct Connection (5432)
// not Transaction Pooler (6543).
const connectionString = process.env.DATABASE_URL
    ?.replace(":6543", ":5432")
    ?.replace("?pgbouncer=true", "");

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: connectionString!,
    },
});
