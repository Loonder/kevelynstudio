const supabase = require('./db');
const { log } = require('./logger');
const { delay } = require('./utils');

// Configuração de segurança
const BATCH_SIZE = 5; // Pessoas por lote
const DELAY_BETWEEN_MSGS = 2000; // 2s min entre mensagens
const JITTER = 1000; // +0 a 1s aleatório

/**
 * Envia mensagem para todos os contatos com uma determinada tag.
 * @param {object} client - Instância do Wwebjs
 * @param {string} tag - Tag alvo (ex: 'LISTA_ESPERA', 'Cliente')
 * @param {string} message - Conteúdo da mensagem
 */
async function sendBroadcast(client, tag, message) {
    try {
        log.info(`📢 Iniciando Broadcast para tag [${tag}]...`);

        // 1. Buscar contatos
        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('phone')
            .contains('tags', [tag.toUpperCase()])
            .eq('opt_out', false); // Ignora quem pediu para sair

        if (error || !contacts || contacts.length === 0) {
            log.warn(`⚠️ Nenhum contato encontrado para a tag [${tag}].`);
            return 0;
        }

        log.info(`👥 Total de destinatários: ${contacts.length}`);

        let sentCount = 0;

        // 2. Enviar com atraso (rate limit)
        for (const contact of contacts) {
            const chatId = `${contact.phone}@c.us`;

            try {
                await client.sendMessage(chatId, message);
                sentCount++;

                // Delay aleatório para parecer humano
                const waitTime = DELAY_BETWEEN_MSGS + Math.random() * JITTER;
                await delay(waitTime);

            } catch (sendErr) {
                log.error(`Erro ao enviar para ${contact.phone}:`, sendErr.message);
            }
        }

        log.info(`✅ Broadcast finalizado. Enviado para ${sentCount}/${contacts.length} contatos.`);
        return sentCount;

    } catch (err) {
        log.error('Erro crítico no Broadcast:', err);
        return 0;
    }
}

module.exports = { sendBroadcast };







