// =====================================================
// MOTOR DE CONVERSAÇÃO — Estado-máquina
// Gerencia o fluxo de cada Cliente individualmente
// =====================================================

const KNOWLEDGE = require('./knowledge');
const { logConversation, logContact, log } = require('./logger');
const { getMessage } = require('./messages');
const supabase = require('./db');
const { STATES } = require('./constants');
const {
    isBackCommand,
    isExitCommand,
    parseWebsiteBooking,
    formatDateBR,
    formatDateTimeBR
} = require('./utils');

// Import Handlers
const { handleGreeting } = require('./handlers/greetingHandler');
const { handleMenu } = require('./handlers/menuHandler');
const { handleServices, handleServiceDetail, getServicesMessage, getServiceDetailMessage } = require('./handlers/serviceHandler');
const { handleFaq, handleFaqDetail, getFaqMessage, getFaqDetailMessage } = require('./handlers/faqHandler');
const { handleLocations, getLocationsMessage } = require('./handlers/locationHandler');
const { handleQuizzes } = require('./handlers/quizHandler');
const {
    handlePickService,
    handlePickLocation,
    handlePickSlot,
    handleCollectName,
    handleCollectBirthdate,
    getPickServiceMessage,
    getPickLocationMessage,
    fetchAndFormatSlots
} = require('./handlers/bookingHandler');
const { handleConfirm, handleWaitingList, handleConfirmationPending } = require('./handlers/confirmationHandler');
const { handleFeedbackPending } = require('./handlers/feedbackHandler');
const { setOptOut, checkOptOut } = require('./crm');

// ─── Extras/Legacy that might not be in handlers yet ───
// Assuming these are simple enough or we move them later?
// handlePackages, handleCollectContractData were mentioned in original file but I didn't create packageHandler.js
// Let's create a placeholder or include them here for now to avoid breaking if used.
// But better to just move them.

// Temporary mocking/inline for handlePackages to avoid crash if used
async function handlePackages(session, text) {
    session.state = STATES.MENU;
    return ['📦 *Pacotes:* Em breve!'];
}
async function getPackagesMessage() { return 'Pacotes'; }
async function handleCollectContractData() { return []; }

// Mock handleHuman logic (simple)
async function handleHuman(session, text, phone, sendNotification) {
    if (session.data.humanTakeover) return [];
    if (sendNotification) await sendNotification(`🔔 *Solicitação de Contato*\\nCliente: ${phone}`);
    return [await getMessage('urgencia_resposta')];
}

// ─── Sessões dos Clientes (em memória) ───
const sessions = new Map();
const SESSION_TIMEOUT = (parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 30) * 60 * 1000;
const HUMAN_TIMEOUT = 2 * 60 * 60 * 1000;

// Dependências que os handlers podem precisar
const dependencies = {
    STATES,
    updateSessionState,
    getServicesMessage,
    getPickServiceMessage,
    getFaqMessage,
    getLocationsMessage,
    getPickLocationMessage,
    getPackagesMessage
};

async function getSession(phone) {
    if (sessions.has(phone)) {
        const session = sessions.get(phone);
        session.lastActivity = Date.now();
        return session;
    }

    let dbSession = null;
    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const { data } = await supabase
            .from('contacts')
            .select('session_state, session_data, human_takeover, name')
            .eq('phone', phone)
            .eq('tenant_id', tenantId) // Scope check
            .single();
        if (data) dbSession = data;
    } catch (e) { }

    const session = {
        state: (dbSession && dbSession.session_state) ? dbSession.session_state : STATES.GREETING,
        lastActivity: Date.now(),
        data: (dbSession && dbSession.session_data) ? dbSession.session_data : {},
        // Ensure name is available in data
        name: (dbSession && dbSession.name) ? dbSession.name : null,
        messageCount: 0,
        history: [],
        knownInDb: !!dbSession // Se veio do banco, já existe
    };

    // Fallback: se o nome estiver na session.data
    if (!session.name && session.data.name) session.name = session.data.name;

    if (dbSession && dbSession.human_takeover) {
        session.state = STATES.HUMAN;
        session.data.humanTakeover = true;
    }

    sessions.set(phone, session);
    return session;
}

async function isHumanTakeoverActive(phone) {
    if (sessions.has(phone)) {
        const s = sessions.get(phone);
        if (s.state === STATES.HUMAN && s.data.humanTakeover) return true;
    }
    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const { data } = await supabase
            .from('contacts')
            .select('human_takeover')
            .eq('phone', phone)
            .eq('tenant_id', tenantId)
            .single();
        if (data && data.human_takeover) {
            updateSessionState(phone, STATES.HUMAN, { humanTakeover: true });
            return true;
        }
    } catch (e) { }
    return false;
}

function updateSessionState(phone, state, data = {}) {
    let session = sessions.get(phone);
    if (!session) {
        session = { state, lastActivity: Date.now(), data: {}, messageCount: 0, history: [] };
        sessions.set(phone, session);
    }

    session.state = state;
    session.data = { ...session.data, ...data };
    session.lastActivity = Date.now();

    saveSessionToDb(phone, session).catch(err => console.error('Erro ao persistir sessão:', err.message));
    return session;
}

async function saveSessionToDb(phone, session) {
    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const payload = { session_state: session.state, session_data: session.data };
        if (session.state === STATES.HUMAN && session.data.humanTakeover) payload.human_takeover = true;
        await supabase
            .from('contacts')
            .update(payload)
            .eq('phone', phone)
            .eq('tenant_id', tenantId);
    } catch (e) { }
}

function cleanupSessions() {
    const now = Date.now();
    for (const [phone, session] of sessions) {
        const timeout = session.state === STATES.HUMAN ? HUMAN_TIMEOUT : SESSION_TIMEOUT;
        if (now - session.lastActivity > timeout) {
            sessions.delete(phone);
            log.info(`🧹 Sessão expirada (${session.state}): ${phone}`);
        }
    }
}
setInterval(cleanupSessions, 5 * 60 * 1000);

// Main Dispatcher
async function processMessage(phone, text, message, sendNotification) {
    const session = await getSession(phone);
    session.messageCount++;
    await logContact(phone);

    // 0. Garantir existência no banco (Auto-Register)
    if (!session.knownInDb) {
        try {
            let name = phone;
            // Tenta pegar nome do contato (pode falhar ou demorar, então catch ignorado)
            try {
                const contact = await message.getContact();
                name = contact.name || contact.pushname || contact.verifiedName || phone;
            } catch { }

            // Upsert seguro com Tenant ID
            const tenantId = process.env.TENANT_ID || 'default';
            const { error } = await supabase.from('contacts').upsert(
                {
                    phone: phone,
                    name: name.substring(0, 100).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio'),
                    tenant_id: tenantId
                },
                { onConflict: 'phone, tenant_id' } // Composite Key
            );

            if (!error) session.knownInDb = true;
        } catch (e) {
            console.error('Erro no Auto-Register:', e);
        }
    }

    // 1. Check Opt-Out Status
    const isOptOut = await checkOptOut(phone);
    const upperText = text.toUpperCase().trim();

    // Comando para SAIR
    if (['PARAR', 'STOP', 'SAIR', 'CANCELAR RECEBIMENTO'].includes(upperText)) {
        await setOptOut(phone, true);
        return ['🚫 *Você optou por não receber mais mensagens automáticas.*\n\nSe mudar de ideia, digite *RETOMAR* a qualquer momento.'];
    }

    // Comando para VOLTAR
    if (upperText === 'RETOMAR' || upperText === 'START') {
        await setOptOut(phone, false);
        return ['✅ *Mensagens automáticas reativadas!* 🌸\n\nComo posso te ajudar hoje?'];
    }

    // Se estiver em Opt-Out, ignora tudo (Silêncio total da parte do BOT)
    if (isOptOut) {
        log.info(`🔇 Mensagem ignorada (Opt-Out Ativo): ${phone}`);
        return [];
    }

    // 2. Mídia
    if (message.hasMedia || ['audio', 'ptt', 'image', 'sticker', 'video', 'document'].includes(message.type)) {
        return [await getMessage('erro_midia', { default: 'Agradeço o envio! 😊 No momento, consigo te atender apenas por *mensagem de texto*. Como posso te ajudar? 💬' })];
    }

    // 2. Web Booking
    const webBooking = parseWebsiteBooking(text);
    if (webBooking) {
        session.state = STATES.PICK_SERVICE;
        session.data.websiteBooking = webBooking;
        const confirmLine = `✅ *Entendi!* Você deseja agendar para o dia *${formatDateBR(webBooking.date)}* às *${webBooking.time}* (${webBooking.location}).`;
        return [`${confirmLine}\n\n${await getPickServiceMessage(session)}`];
    }

    // 3. (Legacy Removed)



    // 5. Sair
    if (isExitCommand(text)) {
        session.state = STATES.GREETING;
        session.data = {};
        return ['Foi um prazer falar com você! 🌸\n\nSe precisar de algo no futuro, é só chamar a *Assistente Kevelyn* novamente. Até mais! 👋'];
    }

    // 6. Voltar
    // 6. Voltar
    if (isBackCommand(text) && session.state !== STATES.GREETING && session.state !== STATES.CONFIRMATION_PENDING) {
        session.state = STATES.MENU;
        session.data = {};
        return [await getMessage('menu_principal')];
    }

    // ─── MOTOR DE REGRAS (Fase 25) ───
    // Só ativa se estiver no MENU ou GREETING (para não atrapalhar fluxos específicos)
    // E ignora se o texto for curto demais ou numérico (opção de menu)
    const isNavigation = /^\d+$/.test(text.trim());
    if (!isNavigation && (session.state === STATES.MENU || session.state === STATES.GREETING)) {

        // Debounce de Respostas Inteligentes (Evita flood se o user manda 3 perguntas seguidas)
        const lastSmartReply = session.data.lastSmartReplyTime || 0;
        const now = Date.now();

        if (now - lastSmartReply > 5000) { // 5 segundos de silêncio entre respostas inteligentes
            const { findBestMatch } = require('./knowledgeBase');
            const smartAnswer = findBestMatch(text);

            if (smartAnswer) {
                // Atualiza timestamp
                session.data.lastSmartReplyTime = now;
                // Opcional: Persistir debounce
                // updateSessionState(phone, session.state, { lastSmartReplyTime: now });

                return [
                    smartAnswer,
                    '',
                    'Posso ajudar em algo mais? (Ou digite *Menu* para ver as opções)'
                ];
            }
        }
    }

    // 7. Dispatcher
    const responses = await handleState(session, text, phone, sendNotification);

    // Get Chat instance once
    const chat = await message.getChat();
    // Simulate typing
    await chat.sendStateTyping();

    // Log
    // (Simplificado para logar apenas texto se for objeto)
    const logText = responses.map(r => (typeof r === 'object' ? r.text : r)).join('\n---\n');
    await logConversation(phone, text, logText, session.state);

    // Enviar respostas
    for (const response of responses) {
        await new Promise(r => setTimeout(r, 800)); // Delay natural

        if (typeof response === 'object' && response !== null) {
            // Rich Message
            if (response.media) {
                try {
                    const { MessageMedia } = require('whatsapp-web.js');
                    const media = MessageMedia.fromFilePath(response.media); // Assumindo caminho local por enquanto
                    await chat.sendMessage(media, { caption: response.text });
                } catch (e) {
                    log.error(`Erro ao enviar mídia: ${response.media}`, e);
                    // Fallback: Envia só o texto
                    if (response.text) await chat.sendMessage(response.text);
                }
            } else if (response.text) {
                await chat.sendMessage(response.text);
            }
        } else if (typeof response === 'string' && response.trim()) {
            await chat.sendMessage(response);
        }
    }

    return responses;
}

async function handleState(session, text, phone, sendNotification) {
    switch (session.state) {
        case STATES.GREETING: return handleGreeting(session, phone, text);
        case STATES.MENU: return handleMenu(session, text, phone, sendNotification, dependencies);
        case STATES.SERVICES: return handleServices(session, text);
        case STATES.SERVICE_DETAIL: return handleServiceDetail(session, text, dependencies);
        case STATES.FAQ: return handleFaq(session, text);
        case STATES.FAQ_DETAIL: return handleFaqDetail(session, text, dependencies);
        case STATES.LOCATIONS: return handleLocations(session, text, dependencies);
        case STATES.QUIZZES: return handleQuizzes(session, text);

        case STATES.SCHEDULE:
        case STATES.PICK_SERVICE: return handlePickService(session, text);
        case STATES.PICK_LOCATION: return handlePickLocation(session, text);
        case STATES.PICK_SLOT: return handlePickSlot(session, text);
        case STATES.COLLECT_NAME: return handleCollectName(session, text, phone);
        case STATES.COLLECT_BIRTHDATE: return handleCollectBirthdate(session, text, phone, sendNotification);
        case STATES.CONFIRM: return handleConfirm(session, text, phone, sendNotification);

        case STATES.WAITING_LIST: return handleWaitingList(session, text, phone, sendNotification);
        case STATES.CONFIRMATION_PENDING: return handleConfirmationPending(session, text, phone, sendNotification, dependencies);
        case STATES.RECURRENCE_OFFER:
            const { handleRecurrenceOffer } = require('./handlers/recurrenceHandler');
            return handleRecurrenceOffer(session, text, phone, sendNotification);
        case STATES.FEEDBACK_PENDING: return handleFeedbackPending(session, text, phone, sendNotification);
        case STATES.HUMAN: return handleHuman(session, text, phone, sendNotification);

        case STATES.PACKAGES: return handlePackages(session, text, phone);
        case STATES.COLLECT_CONTRACT_DATA: return handleCollectContractData(session, text, phone, sendNotification);

        default:
            session.state = STATES.MENU;
            return [await getMessage('menu_principal')];
    }
}

// ─── Phase 13: Abandoned Cart Recovery ───
async function checkStalledSessions(client) {
    const now = Date.now();
    const STALL_THRESHOLD = 15 * 60 * 1000; // 15 min
    const ABANDON_LIMIT = 45 * 60 * 1000;   // 45 min (se passar disso, considera perdido)

    for (const [phone, session] of sessions) {
        // Ignora se estiver em atendimento humano ou opt-out
        if (session.state === STATES.HUMAN || session.data.optOut) continue;

        // Ignora se já mandou recuperação
        if (session.data.recoverySent) continue;

        // Calcula tempo parado
        const idleTime = now - session.lastActivity;

        if (idleTime > STALL_THRESHOLD && idleTime < ABANDON_LIMIT) {
            let msg = '';

            // Lógica Contextual
            if (session.state === STATES.PICK_LOCATION) {
                msg = 'Oi! Vi que você começou a agendar mas parou na escolha do local. 📍\nPosso te ajudar com alguma dúvida sobre os estúdios?';
            } else if (session.state === STATES.PICK_SERVICE) {
                msg = 'Olá! Percebi que você não concluiu a escolha do atendimento. 🌸\nQuer ajuda para saber qual serviço é ideal para você?';
            } else if (session.state === STATES.PICK_SLOT) {
                msg = 'Ei! Vi que você estava vendo os horários. 🕒\nAs vagas costumam acabar rápido. Quer que eu te mande as opções de novo?';
            } else if (session.state === STATES.CONFIRMATION_PENDING) {
                msg = 'Oie! Só falta um passo para garantir seu horário! ✨\nDigite *1* para confirmar ou me avise se precisar trocar.';
            }

            if (msg) {
                try {
                    const chatId = `${phone}@c.us`;
                    await client.sendMessage(chatId, msg);
                    log.info(`🛒 Carrinho abandonado recuperado para ${phone} (${session.state})`);

                    // Notificar Admin (se configurado)
                    const adminPhone = process.env.ADMIN_PHONE;
                    if (adminPhone) {
                        // Send to admin without blocking flow
                        client.sendMessage(`${adminPhone}@c.us`, `⚠️ *Alerta de Carrinho Abandonado*\n\nO Cliente ${phone} parou na etapa *${session.state}*.\nJá enviei uma mensagem de recuperação.`).catch(() => { });
                    }

                    // Marca para não mandar de novo
                    session.data.recoverySent = true;
                    // Atualiza timestamp para não expirar a sessão imediatamente
                    session.lastActivity = now;
                } catch (e) {
                    log.error(`Falha ao enviar recuperação para ${phone}`, e);
                }
            }
        }
    }
}

module.exports = {
    processMessage,
    updateSessionState,
    STATES,
    getSession,
    checkStalledSessions,
    isHumanTakeoverActive
};








