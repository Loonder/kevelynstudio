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

// Estado do bot (pode ser pausado/retomado pela admin)
let botPaused = false;

/**
 * @returns {boolean} Se o bot está pausado
 */
function isBotPaused() {
    return botPaused;
}

/**
 * Processa um comando da admin.
 * @param {string} text - Texto da mensagem
 * @returns {string|null} Resposta, ou null se não for um comando
 */
async function handleAdminCommand(text) {
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
        botPaused = true;
        log.info('⏸️ Bot pausado pela admin');
        return '⏸️ *Bot pausado.* Mensagens de pacientes não serão respondidas automaticamente.\n\nDigite /retomar para voltar ao modo automático.';
    }

    // ─── /retomar ───
    if (cmd === '/retomar' || cmd === '/resumir') {
        botPaused = false;
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

    // ─── /pacientes ───
    if (cmd === '/pacientes') {
        return '📊 *Resumo de atendimentos:*\nEsta funcionalidade será ampliada em breve.\nPor enquanto, consulte os logs no Supabase.';
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

    return `✅ *${slots.length} horários criados!*\n\n📅 Data: ${formatDateBR(parsed.date)}\n🕐 Horário: ${parsed.startTime} — ${parsed.endTime}\n📍 Local: ${parsed.location}\n\nOs pacientes já podem agendar nesses horários.`;
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

function getStatusMessage() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    return [
        '🤖 *Status da Secretária Online*',
        '',
        `📊 Estado: ${botPaused ? '⏸️ Pausado' : '✅ Ativo'}`,
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
        '`/pacientes` — Resumo de pacientes',
        '',
        '💡 _Dica: Você também pode gerenciar horários diretamente pelo app Google Calendar!_',
    ].join('\n');
}

module.exports = {
    handleAdminCommand,
    isAdminCommand,
    isBotPaused,
};



