const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Precisa da SERVICE_ROLE_KEY para criar usuários (não a anon key)
// Se não tiver no .env, avisa.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY; // Fallback (perigoso se for anon, mas tenta)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Necessário SUPABASE_URL e SUPABASE_SERVICE_KEY (ou SUPABASE_KEY) no .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createTenantUser() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Uso: node scripts/create_user.js <email> <senha> <tenant_id>');
        console.log('Ex: node scripts/create_user.js kevelyn@loja.com 123456 kevelyn_beauty');
        process.exit(1);
    }

    const [email, password, tenantId] = args;

    console.log(`\n👷 Criando usuário para Tenant: [${tenantId}]...`);

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Confirma automaticamente
        user_metadata: {
            tenant_id: tenantId,
            role: 'admin'
        }
    });

    if (error) {
        console.error('❌ Erro ao criar usuário:', error.message);
        return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log(`📧 Email: ${data.user.email}`);
    console.log(`🆔 ID: ${data.user.id}`);
    console.log(`🏷️ Tenant: ${data.user.user_metadata.tenant_id}`);
    console.log('\nAgora esse usuário pode fazer login no painel (se habilitado) ou acessar via API.');
}

createTenantUser();



