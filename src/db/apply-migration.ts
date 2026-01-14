
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function applyMigration() {
    const migrationPath = path.join(process.cwd(), "drizzle", "0002_premium_hammerhead.sql");
    console.log(`Applying migration from ${migrationPath}...`);

    if (!fs.existsSync(migrationPath)) {
        console.error("Migration file not found!");
        process.exit(1);
    }

    const migrationSql = fs.readFileSync(migrationPath, "utf-8");
    const statements = migrationSql.split("--> statement-breakpoint");

    console.log(`Found ${statements.length} statements.`);

    for (const statement of statements) {
        const query = statement.trim();
        if (!query) continue;
        try {
            await db.execute(sql.raw(query));
            console.log("✅ Executed: " + query.substring(0, 50).replace(/\n/g, ' ') + "...");
        } catch (e: any) {
            console.error("❌ Error executing: " + query.substring(0, 50).replace(/\n/g, ' ') + "...");
            console.error(`   Message: ${e.message}`);
            // We continue mostly because some parts might have been applied partially in previous failed attempts
        }
    }
    console.log("🏁 Migration process finished.");
}

const isMainModule = typeof require !== 'undefined' && require.main === module;
if (isMainModule) {
    applyMigration().then(() => {
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}
