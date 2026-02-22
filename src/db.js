const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Falha ao carregar credenciais do Supabase. Verifique o .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

module.exports = { supabase, TENANT_ID };






