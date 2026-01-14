import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

console.log('🔍 Testing database connection...');
console.log('📍 Connecting to:', connectionString?.split('@')[1]?.split('?')[0]);

const sql = postgres(connectionString!, {
    ssl: 'prefer',
    prepare: false,
});

async function testConnection() {
    try {
        // Test 1: Check connection
        const version = await sql`SELECT version()`;
        console.log('✅ Connection successful!');
        console.log('Database version:', version[0]?.version?.substring(0, 50));

        // Test 2: List all tables in public schema
        const tables = await sql`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
        `;

        console.log(`\n📊 Found ${tables.length} tables in 'public' schema:`);
        tables.forEach(t => console.log(`  - ${t.tablename}`));

        // Test 3: Try to query methodology_steps
        try {
            const methodologyCount = await sql`SELECT COUNT(*) as count FROM methodology_steps`;
            console.log(`\n✅ methodology_steps table exists!`);
            console.log(`   Rows: ${methodologyCount[0].count}`);
        } catch (err: any) {
            console.log(`\n❌ methodology_steps table NOT found`);
            console.log(`   Error: ${err.message}`);
        }

        await sql.end();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection failed:', error.message);
        await sql.end();
        process.exit(1);
    }
}

testConnection();
