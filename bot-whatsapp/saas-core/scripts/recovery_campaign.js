// scripts/recovery_campaign.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dayjs = require('dayjs');

// Config Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Config Bot
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Mensagem de Recuperação (Carinhosa e Não-Invasiva)
const RECOVERY_MSG = (name) => `Oie ${name}, tudo bem? 🌸

Estava organizando a agenda e notei que faz um tempinho que não nos falamos.
Como você tem passado?

Se sentir que é o momento de retomar seu processo de análise, estou por aqui.
Sem pressão, apenas lembrando que meu estúdio continua sendo o melhor lugar para você se cuidar. ✨

Um abraço,
*Gabriela Kevelyn*`;

async function findInactivePatients() {
    console.log('🔍 Buscando pacientes inativos...');

    // 1. Buscar todos contatos com tag PACIENTE e sem opt_out
    const { data: patients, error } = await supabase
        .from('contacts')
        .select('*')
        .contains('tags', ['PACIENTE']) // PostgREST array filter
        .eq('opt_out', false);

    if (error) {
        console.error('Erro ao buscar contatos:', error);
        return [];
    }

    console.log(`📦 Total de pacientes na base: ${patients.length}`);

    const inactivePatients = [];
    const CUTOFF_DATE = dayjs().subtract(45, 'day'); // 45 dias sem agendamento

    for (const p of patients) {
        // 2. Verificar último agendamento no histórico (ou logs)
        // Como o log_appointments não está vinculado diretamente por FK, buscamos por telefone
        const { data: logs } = await supabase
            .from('appointment_logs')
            .select('created_at')
            .eq('phone', p.phone)
            .order('created_at', { ascending: false })
            .limit(1);

        if (logs && logs.length > 0) {
            const lastAppt = dayjs(logs[0].created_at);
            if (lastAppt.isBefore(CUTOFF_DATE)) {
                // É inativo!
                // Verifica se JÁ mandamos msg de recuperação recentemente (pra não floodar)
                // Vamos usar uma tag de controle 'RECOVERY_SENT_FEB26' ou coluna custom?
                // Simples: ver se tem tag RECOVERY_SENT_RECENT
                if (!p.tags.includes('RECOVERY_SENT')) {
                    inactivePatients.push({ ...p, lastAppt: lastAppt.format('DD/MM/YYYY') });
                }
            }
        } else {
            // Nunca agendou pelo sistema novo? Talvez seja antigo importado.
            // Ignorar por segurança ou incluir? Incluir com cuidado.
            // Decisão: Ignorar para não mandar pra quem não conhecemos o histórico real.
        }
    }

    return inactivePatients;
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot conectado para campanha!');

    const targets = await findInactivePatients();
    console.log(`🎯 Encontrados ${targets.length} pacientes para recuperação.`);

    if (targets.length === 0) {
        console.log('Ninguém para enviar hoje.');
        process.exit(0);
    }

    console.log('🚀 Iniciando envios em 5 segundos...');
    await new Promise(r => setTimeout(r, 5000));

    for (const p of targets) {
        const name = p.name ? p.name.split(' ')[0] : 'Tudo bem?';
        const msg = RECOVERY_MSG(name);
        const chatId = `${p.phone}@c.us`;

        try {
            console.log(`📤 Enviando para ${p.name} (${p.phone})...`);
            await client.sendMessage(chatId, msg);

            // Marcar que enviou para não repetir logo
            // Adiciona tag RECOVERY_SENT
            const newTags = [...(p.tags || []), 'RECOVERY_SENT'];
            await supabase.from('contacts').update({ tags: newTags }).eq('phone', p.phone);

            // Delay humano (15 a 30 seg)
            const delay = Math.floor(Math.random() * 15000) + 15000;
            await new Promise(r => setTimeout(r, delay));

        } catch (e) {
            console.error(`❌ Falha ao enviar para ${p.phone}:`, e.message);
        }
    }

    console.log('🏁 Campanha finalizada!');
    process.exit(0);
});

client.initialize();



