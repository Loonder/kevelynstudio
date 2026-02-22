
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export default defineConfig({
    schema: "./db/schema.ts",
    out: "../drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "../sqlite.db",
    },
});





