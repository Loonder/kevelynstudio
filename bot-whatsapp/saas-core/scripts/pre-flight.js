/**
 * PRE-FLIGHT CHECK
 * 
 * Este script verifica se o ambiente está pronto para produção.
 * Executar via: node scripts/pre-flight.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function check() {
    console.log('\n🚀 Iniciando Verificação Pré-Voo...\n');
    let errors = 0;

    // 1. Verificar .env
    if (!fs.existsSync('.env')) {
        console.error('❌ ERRO: Arquivo .env não encontrado!');
        errors++;
    } else {
        console.log('✅ Arquivo .env encontrado.');
    }

    // 2. Verificar Variáveis Obrigatórias
    const required = ['SUPABASE_URL', 'SUPABASE_KEY', 'ADMIN_PHONE', 'QR_TOKEN'];
    required.forEach(v => {
        if (!process.env[v]) {
            console.error(`❌ ERRO: Variável ${v} não definida no .env!`);
            errors++;
        } else {
            console.log(`✅ Variável ${v} detectada.`);
        }
    });

    // 3. Verificar Google Credentials
    const credPath = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json';
    if (!fs.existsSync(credPath)) {
        console.warn('⚠️ AVISO: google-credentials.json não encontrado. Agendamento será desativado.');
    } else {
        console.log('✅ google-credentials.json encontrado.');
    }

    // 4. Testar Conexão Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        try {
            const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
            const { data, error } = await supabase.from('appointment_settings').select('count').limit(1);
            if (error) throw error;
            console.log('✅ Conexão com Supabase estabelecida com sucesso.');
        } catch (err) {
            console.error('❌ ERRO: Falha ao conectar no Supabase:', err.message);
            errors++;
        }
    }

    console.log('\n' + '='.repeat(35));
    if (errors === 0) {
        console.log('🎊 TUDO PRONTO PARA O DEPLOY! 🎊');
        console.log('Pode rodar: pm2 start ecosystem.config.js');
    } else {
        console.error(`🛑 FORAM ENCONTRADOS ${errors} ERROS.`);
        console.error('Corrija os erros acima antes de prosseguir.');
        process.exit(1);
    }
}

check();



