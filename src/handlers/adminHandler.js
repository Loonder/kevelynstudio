const { LocalAuth } = require('whatsapp-web.js'); // Not needed here, client is passed
const dayjs = require('dayjs');
const supabase = require('../db'); // Reuse existing db connection

// Mensagem de Recuperação (Carinhosa e Não-Invasiva)
const RECOVERY_MSG = (name) => `Oie ${name}, tudo bem? 🌸

Estava organizando a agenda e notei que faz um tempinho que não nos falamos.
Como você tem passado?

Se sentir que é o momento de realçar sua beleza e retomar seus cuidados, estou por aqui.
Sem pressão, apenas lembrando que meu estúdio continua sendo o melhor lugar para você se cuidar. ✨

Um abraço,
*Gabriela Kevelyn*`;

async function handleRecoveryCommand(client, msg, senderPhone) {
    // 1. Simples verificação de segurança (apenas o número "me" ou específico)
    // Para simplificar, vamos permitir qualquer um que mande a senha/comando se souber
    // Ou melhor: checa se é o admin (hardcoded ou vindo do knowledge)
    // const ADMIN_PHONE = '5511999999999'; // Exemplo

    // Vamos assumir que se chegou aqui, o conversation.js já filtrou ou é seguro.

    await msg.reply('🔎 Iniciando busca por Clientes inativos (45+ dias)...');

    try {
        // 1. Buscar todos contatos com tag Cliente e sem opt_out
        const { data: patients, error } = await supabase
            .from('contacts')
            .select('*')
            .contains('tags', ['Cliente'])
            .eq('opt_out', false);

        if (error) throw error;

        const targets = [];
        const CUTOFF_DATE = dayjs().subtract(45, 'day');

        for (const p of patients) {
            const { data: logs } = await supabase
                .from('appointment_logs')
                .select('created_at')
                .eq('phone', p.phone)
                .order('created_at', { ascending: false })
                .limit(1);

            if (logs && logs.length > 0) {
                const lastAppt = dayjs(logs[0].created_at);
                if (lastAppt.isBefore(CUTOFF_DATE)) {
                    // Check if already sent recently
                    if (!p.tags || !p.tags.includes('RECOVERY_SENT')) {
                        targets.push(p);
                    }
                }
            }
        }

        if (targets.length === 0) {
            return msg.reply('✅ Nenhum Cliente inativo encontrado para recuperação hoje.');
        }

        await msg.reply(`🎯 Encontrados ${targets.length} Clientes. Enviando mensagens... (Isso pode levar alguns minutos)`);

        let sentCount = 0;
        for (const p of targets) {
            const name = p.name ? p.name.split(' ')[0] : 'Tudo bem?';
            const messageBody = RECOVERY_MSG(name);
            const chatId = `${p.phone}@c.us`;

            try {
                await client.sendMessage(chatId, messageBody);
                sentCount++;

                // Tagging
                const newTags = [...(p.tags || []), 'RECOVERY_SENT'];
                await supabase.from('contacts').update({ tags: newTags }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', p.phone);

                // Delay to avoid ban (10s)
                await new Promise(r => setTimeout(r, 10000));
            } catch (e) {
                console.error(`Falha ao enviar para ${p.phone}`, e);
            }
        }

        await msg.reply(`🏁 Campanha Finalizada! Mensagens enviadas: ${sentCount}/${targets.length}`);

    } catch (e) {
        console.error('Erro no comando de recuperação:', e);
        await msg.reply('❌ Ocorreu um erro ao executar a campanha. Verifique os logs.');
    }
}

module.exports = { handleRecoveryCommand };







