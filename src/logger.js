// =====================================================
// LOGGER — Registro de conversas e eventos
// Winston (arquivo) + Supabase (nuvem)
// =====================================================

const winston = require('winston');
const { createClient } = require('@supabase/supabase-js');

let supabase = null;

/**
 * Inicializa o logger.
 */
function initLogger() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
        fileLogger.info('Supabase conectado para logs');
    } else {
        fileLogger.warn('Supabase não configurado — logs apenas em arquivo');
    }
}

// Logger de arquivo (Winston)
const fileLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
            return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 3 }),
        new winston.transports.File({ filename: 'logs/bot.log', maxsize: 5242880, maxFiles: 5 }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

/**
 * Registra uma conversa no Supabase.
 */
async function logConversation(phone, message, botResponse, state) {
    fileLogger.info(`[${phone}] Cliente: "${message}" → Bot: "${botResponse?.substring(0, 80)}..." | Estado: ${state}`);

    if (!supabase) return;

    try {
        await supabase.from('bot_conversations').insert([{
            patient_phone: phone,
            patient_message: message,
            bot_response: botResponse?.substring(0, 500),
            conversation_state: state,
            created_at: new Date().toISOString(),
        }]);
    } catch (err) {
        fileLogger.error('Erro ao salvar conversa no Supabase', { error: err.message });
    }
}

/**
 * Registra um agendamento.
 */
async function logAppointment(phone, patientName, service, location, dateTime) {
    fileLogger.info(`📅 AGENDAMENTO: ${patientName} (${phone}) — ${service} em ${location} — ${dateTime}`);

    if (!supabase) return;

    try {
        await supabase.from('bot_appointments').insert([{
            patient_phone: phone,
            patient_name: patientName,
            service,
            location,
            appointment_datetime: dateTime,
            created_at: new Date().toISOString(),
        }]);
    } catch (err) {
        fileLogger.error('Erro ao salvar agendamento no Supabase', { error: err.message });
    }
}

/**
 * Registra um evento de emergência.
 */
async function logEmergency(phone, triggerMessage) {
    fileLogger.error(`🚨 EMERGÊNCIA: ${phone} — "${triggerMessage}"`);

    if (!supabase) return;

    try {
        await supabase.from('bot_emergencies').insert([{
            patient_phone: phone,
            trigger_message: triggerMessage,
            created_at: new Date().toISOString(),
        }]);
    } catch (err) {
        fileLogger.error('Erro ao salvar emergência no Supabase', { error: err.message });
    }
}

/**
 * Registra ou atualiza um contato (Lead/Cliente).
 */
async function logContact(phone, updateData = {}) {
    if (!supabase) return;

    try {
        const { data: existing } = await supabase
            .from('contacts')
            .select('id, tags')
            .eq('phone', phone)
            .single();

        const now = new Date().toISOString();
        const payload = {
            phone,
            last_interaction: now,
            ...updateData
        };

        // Mesclar tags se fornecidas
        if (existing && updateData.tags) {
            const currentTags = existing.tags || [];
            const newTags = updateData.tags.filter(t => !currentTags.includes(t));
            if (newTags.length > 0) {
                payload.tags = [...currentTags, ...newTags];
            } else {
                delete payload.tags; // Não sobrescrever se não mudou
            }
        }

        const { error } = await supabase
            .from('contacts')
            .upsert(payload, { onConflict: 'phone' });

        if (error) throw error;

    } catch (err) {
        fileLogger.error(`Erro ao salvar contato ${phone}`, { error: err.message });
    }
}

const log = fileLogger;

module.exports = {
    initLogger,
    logConversation,
    logAppointment,
    logEmergency,
    logContact,
    log,
};







