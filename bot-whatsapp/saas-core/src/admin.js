// =====================================================
// ADMIN — Comandos da Gabriela Kevelyn via WhatsApp
// =====================================================

const {
    parseAdminScheduleCommand,
    parseAdminCloseCommand,
    parseAdminAgendaCommand,
    formatDateTimeBR,
    formatDateBR,
} = require('./utils');
const {
    createAvailabilitySlots,
    removeSlot,
    getAppointments,
    getAvailableSlots,
    formatAppointmentsForAdmin,
    formatSlotsForWhatsApp,
} = require('./calendar');
const { log } = require('./logger');
const { sendBroadcast } = require('./broadcast');

const { getConfig, saveConfig } = require('./configLoader');

/**
 * @returns {boolean} Se o bot está pausado
 */
function isBotPaused() {
    const config = getConfig();
    return !!config.botPaused;
}

/**
 * Processa um comando da admin.
 * @param {string} text - Texto da mensagem
 * @param {object} client - Cliente do WhatsApp (necessário para broadcast)
 * @returns {string|null} Resposta, ou null se não for um comando
 */
async function handleAdminCommand(text, client, phone) {
    const cmd = text.trim().toLowerCase();

    // ─── /ajuda ───
    if (cmd === '/ajuda' || cmd === '/help') {
        return getHelpMessage();
    }

    // ─── /status ───
    if (cmd === '/status') {
        return getStatusMessage();
    }

    // ─── /pausa ───
    if (cmd === '/pausa' || cmd === '/pausar') {
        saveConfig({ botPaused: true }, process.env.TENANT_ID);
        log.info('⏸️ Bot pausado pela admin');
        return '⏸️ *Bot pausado.* Mensagens de Clientes não serão respondidas automaticamente.\n\nDigite /retomar para voltar ao modo automático.';
    }

    // ─── /retomar ───
    if (cmd === '/retomar' || cmd === '/resumir') {
        saveConfig({ botPaused: false }, process.env.TENANT_ID);
        log.info('▶️ Bot retomado pela admin');
        return '▶️ *Bot retomado!* Atendimento automático ativo novamente. 🌸';
    }

    // ─── /abrir DD/MM HH:MM-HH:MM local ───
    if (cmd.startsWith('/abrir')) {
        return await handleOpenSlots(text);
    }

    // ─── /fechar DD/MM HH:MM ───
    if (cmd.startsWith('/fechar')) {
        return await handleCloseSlot(text);
    }

    // ─── /agenda [DD/MM] ───
    if (cmd.startsWith('/agenda')) {
        return await handleViewAgenda(text);
    }

    // ─── /slots ───
    if (cmd === '/slots') {
        return await handleViewSlots();
    }

    // ─── /Clientes ───
    if (cmd === '/Clientes') {
        return '📊 *Resumo de atendimentos:*\nEsta funcionalidade será ampliada em breve.\nPor enquanto, consulte os logs no Supabase.';
    }

    // ─── /aviso [TAG] [MSG] ───
    if (cmd.startsWith('/aviso') || cmd.startsWith('/broadcast')) {
        return await handleBroadcast(text, client);
    }

    // ─── /recuperar ou /recovery ───
    if (cmd === '/recuperar' || cmd === '/recovery') {
        const { handleRecoveryCommand } = require('./handlers/adminHandler');
        // Executa em background para não travar o bot, mas avisa que começou
        handleRecoveryCommand(client, { reply: (msg) => client.sendMessage(`${phone}@c.us`, msg) }, phone);
        return '🚀 *Campanha de Recuperação Iniciada!* Vou te avisar do progresso por aqui.';
    }

    // ─── /recibo NOME [VALOR] ───
    if (cmd.startsWith('/recibo')) {
        return await handleReceiptCommand(text, client, phone);
    }

    return null; // Não é um comando reconhecido
}

/**
 * Verificar se uma mensagem é um comando do admin.
 */
function isAdminCommand(text) {
    if (!text) return false;
    return text.trim().startsWith('/');
}

// ─── Handlers de Comandos ───

async function handleReceiptCommand(text, client, adminPhone) {
    // Formato: /recibo Nome do Cliente 180
    // Ou: /recibo Nome do Cliente (usa valor default 180)

    const parts = text.split(' ');
    if (parts.length < 2) {
        return '❌ Use: `/recibo [Nome Cliente] [Valor Opcional]`\nEx: `/recibo Maria Silva 200`';
    }

    // Tentar extrair valor do final
    let amount = 180.00; // Valor default
    let nameParts = parts.slice(1);

    const lastPart = nameParts[nameParts.length - 1];
    if (!isNaN(parseFloat(lastPart))) {
        amount = parseFloat(lastPart);
        nameParts.pop();
    }

    const patientName = nameParts.join(' ');

    // Gerar PDF
    const { generateReceipt } = require('./utils/pdfGenerator');
    const { MessageMedia } = require('whatsapp-web.js');

    try {
        const filePath = await generateReceipt(patientName, null, amount, 'Sessão de Lash Design');

        // Enviar para o ADMIN (que solicitou) para ele encaminhar
        const media = MessageMedia.fromFilePath(filePath);

        await client.sendMessage(adminPhone + '@c.us', media, { caption: `🧾 Recibo gerado para *${patientName}*` });

        return `✅ Recibo gerado com sucesso! Envie para o Cliente.`;
    } catch (e) {
        console.error(e);
        return '❌ Erro ao gerar recibo: ' + e.message;
    }
}

async function handleOpenSlots(text) {
    const parsed = parseAdminScheduleCommand(text);

    if (!parsed) {
        return [
            '❌ Formato incorreto. Use:',
            '',
            '`/abrir DD/MM HH:MM-HH:MM local`',
            '',
            '*Exemplos:*',
            '`/abrir 14/02 10:00-18:00 online`',
            '`/abrir 15/02 08:00-12:00 itapecerica`',
            '`/abrir 16/02 14:00-20:00 taboao`',
            '',
            '*Locais válidos:* itapecerica, taboao, online',
        ].join('\n');
    }

    const slots = await createAvailabilitySlots(
        parsed.date,
        parsed.startTime,
        parsed.endTime,
        parsed.location
    );

    if (slots.length === 0) {
        return '❌ Não foi possível criar os horários. Verifique a conexão com o Google Calendar.';
    }

    return `✅ *${slots.length} horários criados!*\n\n📅 Data: ${formatDateBR(parsed.date)}\n🕐 Horário: ${parsed.startTime} — ${parsed.endTime}\n📍 Local: ${parsed.location}\n\nOs Clientes já podem agendar nesses horários.`;
}

async function handleCloseSlot(text) {
    const parsed = parseAdminCloseCommand(text);

    if (!parsed) {
        return [
            '❌ Formato incorreto. Use:',
            '',
            '`/fechar DD/MM HH:MM`',
            '',
            '*Exemplo:*',
            '`/fechar 14/02 14:00`',
        ].join('\n');
    }

    const removed = await removeSlot(parsed.dateTime);

    if (!removed) {
        return '❌ Não encontrei esse horário disponível para remover.';
    }

    return `✅ Horário removido com sucesso!`;
}

async function handleViewAgenda(text) {
    const parsed = parseAdminAgendaCommand(text);

    if (!parsed) {
        return '❌ Formato incorreto. Use: `/agenda` ou `/agenda DD/MM`';
    }

    const appointments = await getAppointments(parsed.date);
    return formatAppointmentsForAdmin(appointments);
}

async function handleViewSlots() {
    const slots = await getAvailableSlots(null, 30);

    if (slots.length === 0) {
        return '📭 Nenhum horário disponível aberto.\n\nUse `/abrir DD/MM HH:MM-HH:MM local` para criar horários.';
    }

    return formatSlotsForWhatsApp(slots);
}

async function handleBroadcast(text, client) {
    if (!client) return '❌ Erro interno: Cliente WhatsApp não disponível.';

    // /aviso TAG mensagem...
    const parts = text.split(' ');
    if (parts.length < 3) {
        return '❌ Formato incorreto. Use: `/aviso [TAG] [mensagem]`\nEx: `/aviso LISTA_ESPERA Olá, abri novos horários!`';
    }

    const tag = parts[1].toUpperCase();
    const message = parts.slice(2).join(' ');

    const count = await sendBroadcast(client, tag, message);

    if (count === 0) {
        return `⚠️ Nenhuma mensagem enviada. Verifique se a tag *${tag}* existe ou se há contatos com ela.`;
    }

    return `✅ Broadcast finalizado!\nMensagem enviada para *${count}* contatos da tag *${tag}*.`;
}

function getStatusMessage() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const paused = isBotPaused();

    return [
        '🤖 *Status da Secretária Online*',
        '',
        `📊 Estado: ${paused ? '⏸️ Pausado' : '✅ Ativo'}`,
        `⏱️ Online há: ${hours}h ${minutes}min`,
        `💾 Memória: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        `📅 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    ].join('\n');
}

function getHelpMessage() {
    return [
        '📖 *Comandos da Secretária Online*',
        '',
        '📅 *Gerenciar Horários:*',
        '`/abrir DD/MM HH:MM-HH:MM local` — Abrir horários',
        '`/fechar DD/MM HH:MM` — Fechar um horário',
        '`/slots` — Ver horários disponíveis',
        '',
        '📋 *Agenda:*',
        '`/agenda` — Agendamentos da semana',
        '`/agenda DD/MM` — Agendamentos de uma data',
        '',
        '⚙️ *Bot:*',
        '`/status` — Status do bot',
        '`/pausa` — Pausar atendimento automático',
        '`/retomar` — Retomar atendimento',
        '`/Clientes` — Resumo de Clientes',
        '',
        '💡 _Dica: Você também pode gerenciar horários diretamente pelo app Google Calendar!_',
    ].join('\n');
}

module.exports = {
    handleAdminCommand,
    isAdminCommand,
    isBotPaused,
};








