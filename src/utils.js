// =====================================================
// UTILITÁRIOS - Formatação de datas, telefone, delays
// =====================================================

const dayjs = require('dayjs');
require('dayjs/locale/pt-br');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.locale('pt-br');
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Simula digitação humana — espera proporcional ao tamanho da msg.
 * @param {import('whatsapp-web.js').Chat} chat
 * @param {number} ms
 */
async function simulateTyping(chat, ms = 1500) {
    try {
        await chat.sendStateTyping();
        await delay(Math.min(ms, 4000));
        await chat.clearState();
    } catch {
        // Ignora se falhar (não crítico)
    }
}

/**
 * Delay assíncrono.
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normaliza um número de telefone para formato WhatsApp (5511...).
 */
function normalizePhone(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
    if (!cleaned.startsWith('55')) cleaned = '55' + cleaned;
    return cleaned;
}

/**
 * Formata telefone para exibição: (11) 94102-2404
 */
function formatPhoneDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
        return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Formata Date para exibição amigável em PT-BR.
 * Ex: "Terça, 12/02 às 14:00"
 */
function formatDateTimeBR(date) {
    const d = dayjs(date).tz('America/Sao_Paulo');
    const weekday = capitalize(d.format('dddd'));
    return `${weekday}, ${d.format('DD/MM')} às ${d.format('HH:mm')}`;
}

/**
 * Formata Date para só a data.
 * Ex: "12/02/2026"
 */
function formatDateBR(date) {
    return dayjs(date).tz('America/Sao_Paulo').format('DD/MM/YYYY');
}

/**
 * Formata Date para hora.
 * Ex: "14:00"
 */
function formatTimeBR(date) {
    return dayjs(date).tz('America/Sao_Paulo').format('HH:mm');
}


/**
 * Capitaliza primeira letra.
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sanitiza a entrada do Cliente — remove espaços extras, emojis confusos.
 */
function sanitizeInput(text) {
    if (!text) return '';
    return text.trim().toLowerCase();
}

/**
 * Tenta extrair um número de uma resposta do Cliente.
 * Aceita: "1", "01", "1.", "opção 1", "primeira", etc.
 */
function extractNumber(text) {
    const clean = sanitizeInput(text);

    // Números escritos por extenso
    const wordMap = {
        'um': 1, 'uma': 1, 'primeiro': 1, 'primeira': 1,
        'dois': 2, 'duas': 2, 'segundo': 2, 'segunda': 2,
        'tres': 3, 'três': 3, 'terceiro': 3, 'terceira': 3,
        'quatro': 4, 'quarto': 4, 'quarta': 4,
        'cinco': 5, 'quinto': 5, 'quinta': 5,
        'seis': 6, 'sexto': 6, 'sexta': 6,
        'sete': 7, 'sétimo': 7, 'sétima': 7,
        'oito': 8, 'oitavo': 8, 'oitava': 8,
        'nove': 9, 'nono': 9, 'nona': 9,
        'dez': 10, 'décimo': 10, 'décima': 10,
    };

    // Procura por palavras conhecidas
    for (const [word, num] of Object.entries(wordMap)) {
        if (clean === word || clean.includes(word)) return num;
    }

    // Extrai dígitos
    const match = clean.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);

    return null;
}

/**
 * Verifica se o texto é uma confirmação (sim/não).
 * Retorna: true (sim), false (não), null (não entendido)
 */
function parseConfirmation(text) {
    const clean = sanitizeInput(text);

    const yesWords = ['sim', 's', 'si', 'yes', 'ok', 'pode', 'confirmo', 'confirma', 'positivo', 'isso', 'claro', 'com certeza', 'bora', 'vamos', 'quero', 'confirmar', '👍', '✅'];
    const noWords = ['não', 'nao', 'n', 'no', 'nope', 'cancela', 'cancelar', 'desisto', 'não quero', 'nao quero', 'volta', 'voltar', '👎', '❌'];

    if (yesWords.some(w => clean === w || clean.startsWith(w))) return true;
    if (noWords.some(w => clean === w || clean.startsWith(w))) return false;

    return null;
}

/**
 * Verifica se é um comando de "voltar" / "menu".
 */
function isBackCommand(text) {
    const clean = sanitizeInput(text);
    const backWords = ['voltar', 'volta', 'menu', 'início', 'inicio', 'recomeçar', 'recomecar', 'oi', 'olá', 'ola', 'hi', 'hello', '0'];
    return backWords.some(w => clean === w || clean.startsWith(w + ' '));
}

/**
 * Verifica se é um comando de "sair" / "encerrar".
 */
function isExitCommand(text) {
    const clean = sanitizeInput(text);
    const exitWords = ['sair', 'parar', 'tchau', 'adeus', 'encerrar', 'fim', 'cancelar'];
    return exitWords.some(w => clean === w || clean === w + ' por hoje' || clean.startsWith(w + ' '));
}

/**
 * Parseia um comando de data do admin.
 * Ex: "/abrir 14/02 10:00-18:00 online" → { date, startTime, endTime, location }
 */
function parseAdminScheduleCommand(text) {
    const match = text.match(/\/abrir\s+(\d{2}\/\d{2})\s+(\d{2}:\d{2})-(\d{2}:\d{2})\s+(\w+)/i);
    if (!match) return null;

    const [, dateStr, startTime, endTime, location] = match;
    const year = dayjs().year();
    const date = dayjs(`${dateStr}/${year}`, 'DD/MM/YYYY');

    if (!date.isValid()) return null;

    return {
        date: date.format('YYYY-MM-DD'),
        startTime,
        endTime,
        location: location.toLowerCase(),
    };
}

/**
 * Parseia comando /fechar DD/MM HH:MM
 */
function parseAdminCloseCommand(text) {
    const match = text.match(/\/fechar\s+(\d{2}\/\d{2})\s+(\d{2}:\d{2})/i);
    if (!match) return null;

    const [, dateStr, time] = match;
    const year = dayjs().year();
    const date = dayjs(`${dateStr}/${year} ${time}`, 'DD/MM/YYYY HH:mm');

    if (!date.isValid()) return null;

    return { dateTime: date.toISOString() };
}

/**
 * Parseia comando /agenda [DD/MM]
 */
function parseAdminAgendaCommand(text) {
    const match = text.match(/\/agenda\s*(\d{2}\/\d{2})?/i);
    if (!match) return null;

    if (match[1]) {
        const year = dayjs().year();
        const date = dayjs(`${match[1]}/${year}`, 'DD/MM/YYYY');
        return { date: date.isValid() ? date.format('YYYY-MM-DD') : null };
    }

    return { date: null }; // Sem data = mostra a semana toda
}

/**
 * Detecta e extrai informações da mensagem vinda do site.
 * Ex: "Olá! Gostaria de agendar: 08:00 - sexta-feira, 13 de fev. (presencial)"
 */
function parseWebsiteBooking(text) {
    if (!text) return null;

    // Regex para capturar: Hora, Dia da Semana, Dia de Mês, Local
    const pattern = /Olá.*! Gostaria de agendar: (\d{2}:\d{2}) - ([^,]+), (\d{1,2}) de ([a-zçáíúóêô]+)\.? \((.*)\)/i;
    const match = text.match(pattern);

    if (!match) return null;

    const [, time, weekday, dayNum, monthName, location] = match;

    // Mapear meses curtos em PT-BR para números (0-indexed para dayjs)
    const months = {
        'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
    };

    // Limpar o nome do mês (ex: "fev." -> "fev")
    const cleanMonth = monthName.toLowerCase().replace('.', '').substring(0, 3);
    const monthIndex = months[cleanMonth];

    if (monthIndex === undefined) return null;

    const now = dayjs();
    const year = now.year();

    // Criar a data garantindo o Timezone de São Paulo
    // Importante: .tz() interpreta o horário local na zona especificada
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${year}-${pad(monthIndex + 1)}-${pad(dayNum)} ${time}`;
    let dateObj = dayjs.tz(dateStr, "YYYY-MM-DD HH:mm", "America/Sao_Paulo");


    // Se a data já passou (ex: estamos em Dezembro e a msg é de Jan), assume o ano que vem
    if (dateObj.isBefore(now.subtract(1, 'day'))) {
        dateObj = dateObj.add(1, 'year');
    }

    return {
        time,
        date: dateObj.format('YYYY-MM-DD'),
        dateTime: dateObj.format(), // Retorna ISO com Offset correto (-03:00)
        location,
        valid: dateObj.isValid()
    };
}

/**
 * Calcula a idade a partir de uma data de nascimento.
 * @param {string|Date} birthDate Data de nascimento (YYYY-MM-DD ou Date object)
 * @returns {number}
 */
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = dayjs();
    const birth = dayjs(birthDate);
    return today.diff(birth, 'year');
}

/**
 * Detecta se é a saudação padrão vinda do kevelyn_studio.
 */
function iskevelyn_studioGreeting(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return lower.includes('kevelyn_studio');
}

module.exports = {
    simulateTyping,
    delay,
    normalizePhone,
    formatPhoneDisplay,
    formatDateTimeBR,
    formatDateBR,
    formatTimeBR,
    capitalize,
    sanitizeInput,
    extractNumber,
    parseConfirmation,
    isBackCommand,
    isExitCommand,
    parseAdminScheduleCommand,
    parseAdminCloseCommand,
    parseAdminAgendaCommand,
    parseWebsiteBooking,
    iskevelyn_studioGreeting,
    calculateAge,
};






