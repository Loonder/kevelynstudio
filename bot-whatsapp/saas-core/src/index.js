// =====================================================
// SECRETÁRIA ONLINE — Kevelyn Company
// Ponto de entrada principal (PRODUÇÃO 24/7)
// =====================================================

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
const { checkFlood } = require('./security/antiFlood');
const { initCalendar } = require('./calendar');
const { initLogger, log } = require('./logger');
const { processMessage, updateSessionState, STATES } = require('./conversation');
const { startScheduler } = require('./scheduler');
const { handleAdminCommand, isAdminCommand, isBotPaused } = require('./admin');
const { simulateTyping, delay, normalizePhone } = require('./utils');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

// ─── Configuração SaaS (Multi-Tenant) ───
const { loadConfig } = require('./configLoader');

// Parse --tenant=ID argument
const args = process.argv.slice(2);
const tenantArg = args.find(arg => arg.startsWith('--tenant='));
const tenantId = tenantArg ? tenantArg.split('=')[1] : 'kevelyn_beauty';

console.log(`🚀 Inicializando Secretária Online SaaS para Tenant: [${tenantId}]`);
const config = loadConfig(tenantId);
process.env.TENANT_ID = tenantId; // Set env globally

// ─── LOCKFILE (Previne duplicidade) ───
const fs = require('fs');
const LOCK_FILE = path.join(__dirname, `../${tenantId}.lock`);

try {
    if (fs.existsSync(LOCK_FILE)) {
        const pid = fs.readFileSync(LOCK_FILE, 'utf8');
        try {
            process.kill(pid, 0); // Checa se o processo ainda existe
            console.error(`❌ Processo para ${tenantId} já rodando (PID: ${pid}). Abortando.`);
            process.exit(1);
        } catch (e) {
            // Processo morreu, podemos continuar
            console.log(`⚠️ Lockfile encontrado para ${tenantId} mas processo morto. Removendo lock.`);
            fs.unlinkSync(LOCK_FILE);
        }
    }
    fs.writeFileSync(LOCK_FILE, process.pid.toString());
} catch (err) {
    console.error('Erro ao manipular lockfile:', err);
}

// Remove lock ao sair
const cleanup = () => {
    try {
        if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
    } catch (e) { }
};
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// ─── Configuração ───
const ADMIN_PHONE = config.admin?.phone || normalizePhone(process.env.ADMIN_PHONE);
const BOT_VERSION = '2.0.1 (SaaS Core - Secure)';

// ─── Supabase ───
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('❌ SUPABASE_URL ou SUPABASE_KEY não configurados no .env');
    process.exit(1);
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── Estado Global ───
let lastQrCode = null;
let lastMessageTime = Date.now();
let isReconnecting = false;
let connectionState = 'INITIALIZING'; // INITIALIZING | CONNECTED | DISCONNECTED | ZOMBIE
let totalMessagesProcessed = 0;
let startTime = Date.now();
const botMessageIds = new Set();
const BOT_MESSAGE_CACHE_LIMIT = 1000;
const processedMessageIds = new Set(); // Cache de IDs processados (Deduplicação)

// ─── Inicializar WhatsApp Client (via Motor Abstrato) ───
const client = require('./engine/WhatsAppEngine');

// ─── Debounce — evita processar múltiplas mensagens rápidas ───
const messageQueue = new Map();
const DEBOUNCE_MS = 1500;

// ═══════════════════════════════════════════════════
// WATCHDOG — Detecta estado zombie e recupera
// ═══════════════════════════════════════════════════

const WATCHDOG_INTERVAL = 60 * 1000;     // Verifica a cada 60s
const ZOMBIE_THRESHOLD = 10 * 60 * 1000; // 10 min sem mensagens = suspeito
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // Health check a cada 5 min

function startWatchdog() {
    log.info('🐕 Watchdog iniciado');

    setInterval(async () => {
        const now = Date.now();
        const timeSinceLastMsg = now - lastMessageTime;

        // Verificar se o Puppeteer/Chrome ainda está vivo
        try {
            if (client.pupPage) {
                // Tentar fazer um health check no browser
                await Promise.race([
                    client.pupPage.evaluate(() => true),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Browser timeout')), 10000))
                ]);
            }
        } catch (err) {
            log.error('🐕 Watchdog: Browser travou!', { error: err.message });
            connectionState = 'ZOMBIE';
            await forceReconnect('Browser não responde');
            return;
        }

        // Verificar se client.info está undefined mesmo "conectado"
        if (connectionState === 'CONNECTED' && !client.info) {
            log.warn('🐕 Watchdog: Estado inconsistente (CONNECTED sem client.info)');
            connectionState = 'ZOMBIE';
            await forceReconnect('Estado inconsistente');
            return;
        }

        // Log de saúde periódico
        const uptimeMin = Math.floor((now - startTime) / 60000);
        const memMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        log.info(`🐕 Heartbeat | Estado: ${connectionState} | Uptime: ${uptimeMin}min | RAM: ${memMB}MB | Msgs: ${totalMessagesProcessed} | Último msg: ${Math.floor(timeSinceLastMsg / 1000)}s atrás`);

    }, WATCHDOG_INTERVAL);
}

async function forceReconnect(reason) {
    if (isReconnecting) {
        log.warn('🔄 Já reconectando, ignorando...');
        return;
    }
    isReconnecting = true;
    connectionState = 'DISCONNECTED';

    log.warn(`🔄 Forçando reconexão: ${reason}`);
    console.log(`⚠️ Forçando reconexão: ${reason}`);

    try {
        await client.destroy();
    } catch (e) {
        log.error('Erro ao destruir client:', { error: e.message });
    }

    await delay(5000);

    try {
        console.log('🔄 Reinicializando cliente WhatsApp...');
        await client.initialize(tenantId);
        isReconnecting = false;
    } catch (err) {
        log.error('Erro na reconexão', { error: err.message });
        isReconnecting = false;
        // Retry com backoff
        const retryDelay = 15000;
        log.info(`🔄 Tentando novamente em ${retryDelay / 1000}s...`);
        setTimeout(() => forceReconnect('Retry automático'), retryDelay);
    }
}

// ═══════════════════════════════════════════════════
// EVENTOS DO CLIENTE WHATSAPP
// ═══════════════════════════════════════════════════

client.on('qr', (qr) => {
    lastQrCode = qr;
    connectionState = 'DISCONNECTED';
    const port = process.env.PORT || 7777;
    // Token dinâmico por segurança
    const token = process.env.QR_TOKEN || require('crypto').randomBytes(8).toString('hex');
    process.env.CURRENT_QR_TOKEN = token; // Salva para o Express usar

    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 ESCANEIE O QR CODE ABAIXO NO WHATSAPP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    qrcode.generate(qr, { small: true });
    console.log('');
    console.log(`🔒 ACESSO SEGURO (Navegador):`);
    console.log(`👉 http://localhost:${port}/?token=${token}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

client.on('ready', async () => {
    lastQrCode = null;
    connectionState = 'CONNECTED';
    lastMessageTime = Date.now();

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SECRETÁRIA ONLINE ATIVA!');
    console.log(`📱 Versão: ${BOT_VERSION}`);
    console.log(`👩‍⚕️ Admin: ${ADMIN_PHONE}`);
    console.log(`🕐 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    log.info('Bot inicializado com sucesso');

    // 1. Iniciar Módulos Base
    await initCalendar();

    // 2. Restaurar estados de Handoff (Interruptor)
    const { loadHandoverState } = require('./handoff');
    await loadHandoverState();

    // 3. Iniciar scheduler (lembretes, feedbacks, aniversários)
    try {
        startScheduler(client);
        log.info('⏰ Scheduler ativado com sucesso');
    } catch (err) {
        log.error('⚠️ Erro ao iniciar scheduler (não-fatal)', { error: err.message });
    }
});

client.on('authenticated', () => {
    log.info('✅ Autenticado com sucesso');
});

client.on('auth_failure', (msg) => {
    log.error('❌ Falha na autenticação', { error: msg });
    connectionState = 'DISCONNECTED';
    console.error('Autenticação falhou! Tente deletar a pasta .wwebjs_auth e escanear novamente.');
});

client.on('disconnected', async (reason) => {
    log.warn('🔌 Desconectado', { reason });
    connectionState = 'DISCONNECTED';
    console.log(`⚠️ Bot desconectado (Motivo: ${reason}). Reconectando...`);
    await forceReconnect(`Desconectado: ${reason}`);
});

// Human Takeover — Detects if Admin sent a message via phone
client.on('message_create', async (msg) => {
    // 1. Apenas mensagens enviadas por mim (via account main)
    if (!msg.fromMe) return;

    // 2. Aguarda registro no set do bot (Evitar falso-positivo de takeover)
    await new Promise(r => setTimeout(r, 1500));

    // 3. Se estiver no set, foi o BOT. Ignora.
    if (botMessageIds.has(msg.id.id) || botMessageIds.has(msg.id._serialized)) {
        return;
    }

    // 4. Ignorar status ou grupos
    if (msg.to.includes('@g.us') || msg.to === 'status@broadcast') return;

    const chat = await msg.getChat();
    const toPhone = normalizePhone(chat.id.user || msg.to.replace('@c.us', ''));

    // ─── IGNORE SELF-CHAT (Note to Self) ───
    const botId = client.info && client.info.wid ? client.info.wid.user : '';
    if (toPhone === botId) return;

    // ─── SHORTHAND COMMANDS (. = Mute, * = Unmute) ───
    const { isHandoverActive, startHandover, resolveHandover } = require('./handoff');
    const body = msg.body.trim();

    // ".Oi" -> Ativa Handover (Muta o bot)
    if (body.startsWith('.')) {
        if (!isHandoverActive(toPhone)) {
            await startHandover(toPhone, 'HUMAN_SHORTHAND');
            log.info(`Handover ativado por taquigrafia (.) para ${toPhone}`);
        }
        return;
    }

    // "Obrigada>>" -> Desativa Handover (Bot volta)
    if (body.endsWith('>>')) {
        if (isHandoverActive(toPhone)) {
            await resolveHandover(toPhone, 'HUMAN_SHORTHAND');
            log.info(`Handover finalizado por taquigrafia (>>) para ${toPhone}`);

            const sent = await client.sendMessage(chat.id._serialized, '*Atendimento Automático Retomado.*\n\nOlá! Sou a Assistente Kevelyn novamente. Como posso ajudar? \n\n1️⃣ Ver Menu');
            if (sent && sent.id) botMessageIds.add(sent.id._serialized);
        }
        return;
    }

    // Se não for comando, mas for mensagem humana, ativa takeover automático
    if (!isHandoverActive(toPhone)) {
        log.info(`👤 Human Takeover detectado para ${toPhone}`);
        await startHandover(toPhone, 'AUTO_HUMAN_INTERVENTION');
    }
});

// Catch de segurança: mudança de estado interno do whatsapp-web.js
client.on('change_state', (state) => {
    log.info(` Estado WhatsApp: ${state}`);
    if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
        log.warn(`⚠️ Estado crítico: ${state}`);
        connectionState = 'DISCONNECTED';
    }
});

// ═══════════════════════════════════════════════════
// HANDLER PRINCIPAL DE MENSAGENS
// ═══════════════════════════════════════════════════

client.on('message', async (message) => {
    try {
        // Atualizar heartbeat
        lastMessageTime = Date.now();
        totalMessagesProcessed++;

        // Ignorar mensagens de grupo
        if (message.from.includes('@g.us')) return;

        // Ignorar mensagens do próprio bot
        if (message.fromMe) return;

        // Ignorar broadcasts/status
        if (message.from === 'status@broadcast') return;

        // 🛡️ IGNORAR MENSAGENS ANTIGAS (Antes do boot)
        // message.timestamp é unix timestamp (segundos)
        const msgTime = message.timestamp * 1000;
        if (msgTime < startTime) {
            // log.debug(`Ignorando mensagem antiga de ${new Date(msgTime).toISOString()}`);
            return;
        }

        // ─── DEDUPLICAÇÃO DE MENSAGENS (CRÍTICO) ───
        if (processedMessageIds.has(message.id.id)) {
            console.log(`♻️ DEDUPLICAÇÃO: Mensagem ${message.id.id} já processada. Ignorando.`);
            return;
        }
        processedMessageIds.add(message.id.id);
        // Limpar cache antigo
        if (processedMessageIds.size > 2000) {
            const it = processedMessageIds.values();
            processedMessageIds.delete(it.next().value);
        }

        // ─── Extrair telefone (suporta @c.us e @lid) ───
        let phone = '';
        const isLID = message.from.includes('@lid') || (message.author && message.author.includes('@lid'));

        if (isLID) {
            try {
                const contact = await message.getContact();
                phone = normalizePhone(contact.number || contact.id?.user || '');
            } catch {
                phone = normalizePhone(message.from.replace(/@.*$/, ''));
            }
        } else {
            phone = normalizePhone(message.from.replace('@c.us', ''));
        }

        // AUTO-DETECÇÃO DE SELF-CHAT (Para testes)
        const botId = client.info && client.info.wid ? client.info.wid.user : '';
        const isSelfChat = phone === botId;

        // ─── CRITICAL: Handle Linked Device (LID) Messages ───
        // Prevent bot from replying to Admin sending messages from other devices
        const { isHandoverActive, startHandover, resolveHandover } = require('./handoff');

        if (isLID) {
            log.info(`👮‍♂️ LID Intercept: ${message.body}`);
            const body = (message.body || '').trim();

            if (body.startsWith('.')) {
                if (!isHandoverActive(phone)) await startHandover(phone, 'HUMAN_LID');
                return;
            }
            if (body.endsWith('>>')) {
                if (isHandoverActive(phone)) await resolveHandover(phone, 'HUMAN_LID');
                return;
            }

            if (!isSelfChat && !isHandoverActive(phone)) {
                await startHandover(phone, 'AUTO_LID_INTERVENTION');
                return;
            }
        }

        // 0. ANTI-FLOOD CHECK
        if (!isSelfChat && !checkFlood(phone)) return;

        const text = message.body || '';

        log.info(`📩 [${phone}] (from: ${message.from}) ${text.substring(0, 100)}`);

        // ─── Mensagem do Admin (Mais robusto) ───
        const admins = (process.env.ADMIN_PHONE || '').split(',').map(n => normalizePhone(n.trim())).filter(n => n);
        const isAdmin = admins.some(admin => phone === admin || phone === (admin.length === 13 ? admin.slice(0, 4) + admin.slice(5) : admin));

        if (isAdmin) {
            if (isAdminCommand(text)) {
                log.info(`🛠️ Comando Admin detectado de ${phone}: ${text}`);
                const response = await handleAdminCommand(text, client, phone);
                if (response) {
                    await message.reply(response);
                    return;
                }
            }
        }

        // ─── 0. STRICT Human Takeover Check (DB/Persistent) ───
        // Antes de qualquer coisa, verifica se o humano assumiu no banco
        const { isHumanTakeoverActive, checkHumanTakeover } = require('./conversation');

        // Otimização: Primeiro checa memória, se false, checa banco (lazy load no getSession)
        const isHuman = await isHumanTakeoverActive(phone);
        if (isHuman) {
            log.info(`🛑 Bot em silêncio para ${phone} (Human Takeover Ativo)`);
            return;
        }

        // ─── Bot pausado (Global) ───
        if (isBotPaused() && phone !== ADMIN_PHONE) {
            return;
        }

        // ─── COMANDOS CRM DO ADMIN (Via Mensagem) ───
        if (isAdmin) {
            const body = text.trim();

            // /nota [texto] (Suporta reply)
            if (body.toLowerCase().startsWith('/nota ')) {
                const noteText = body.substring(6);
                let targetPhone = phone;

                if (message.hasQuotedMsg) {
                    const quoted = await message.getQuotedMessage();
                    targetPhone = normalizePhone(quoted.from.replace('@c.us', ''));
                }

                const { addNote } = require('./crm');
                await addNote(targetPhone, noteText, 'Admin');

                // Confirmação discreta
                try {
                    const confirm = await message.reply('✅ Nota salva com sucesso!');
                    setTimeout(() => confirm.delete(true), 3000);
                } catch { }
                return;
            }
        }

        const { updateSessionState, STATES, getSession } = require('./conversation');

        // ... (inside client.on('message') handler) ...

        messageQueue.set(phone, setTimeout(async () => {
            messageQueue.delete(phone);

            try {
                const chat = await message.getChat();

                // Start Typing
                await simulateTyping(chat, text.length > 50 ? 2500 : 1500);

                // FINAL GUARD: Verifica Handoff antes de processar/responder
                const { isHandoverActive } = require('./handoff');
                if (isHandoverActive(phone)) {
                    log.info(`🛑 Bot mutado por Handoff para ${phone} (Late Check)`);
                    return;
                }

                const responses = await processMessage(phone, text, message, sendAdminNotification);

                const currentSession = await require('./conversation').getSession(phone);
                if (currentSession.state === STATES.HUMAN && currentSession.data.humanTakeover) {
                    log.info(`🤫 Silenciando resposta pendente para ${phone} (Human Takeover)`);
                    return;
                }


                for (let i = 0; i < responses.length; i++) {
                    if (responses[i] && responses[i].trim()) {
                        // SENDING MESSAGE
                        const sentMsg = await chat.sendMessage(responses[i]);

                        // Track Bot Message ID
                        if (sentMsg && sentMsg.id) {
                            botMessageIds.add(sentMsg.id._serialized);
                            // Cleanup cache if too big
                            if (botMessageIds.size > BOT_MESSAGE_CACHE_LIMIT) {
                                const it = botMessageIds.values();
                                botMessageIds.delete(it.next().value);
                            }
                        }

                        if (i < responses.length - 1) {
                            await delay(2000);
                            await simulateTyping(chat, 1000);
                        }
                    }
                }
            } catch (err) {
                // ... existing catch block ...
                log.error(`Erro ao processar mensagem de ${phone}`, { error: err.message, stack: err.stack });

                try {
                    const chat = await message.getChat();
                    await chat.sendMessage(
                        '😔 Desculpe, ocorreu um erro temporário. Por favor, tente novamente em alguns instantes ou digite *"menu"* para recomeçar.'
                    );
                } catch {
                    // Se nem isso funcionar, só loga
                }
            }
        }, DEBOUNCE_MS));

    } catch (err) {
        log.error('Erro no handler principal', { error: err.message });
    }
});

// ─── Notificação para Admin ───
// ─── Notificação para Admin (Suporta múltiplos números) ───
async function sendAdminNotification(text) {
    try {
        const admins = (process.env.ADMIN_PHONE || '').split(',').map(n => normalizePhone(n.trim())).filter(n => n);

        for (const adminPhone of admins) {
            const adminChatId = `${adminPhone}@c.us`;
            await client.sendMessage(adminChatId, text);
            await delay(1000); // Evita flood
        }

        if (admins.length > 0) {
            log.info(`📤 Notificação enviada para ${admins.length} admins`);
        }
    } catch (err) {
        log.error('Erro ao enviar notificação para admin', { error: err.message });
    }
}

// ═══════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════

async function start() {
    console.log('');
    console.log(`✨ ${config.bot.name} — ${config.professional.name}`);
    console.log(`   v${BOT_VERSION} (Tenant: ${process.env.TENANT_ID})`);
    console.log('');
    console.log('Inicializando...');

    initLogger();

    const calendarOk = await initCalendar();
    if (!calendarOk) {
        console.log('⚠️  Google Calendar não configurado — agendamento desabilitado');
    }

    const fs = require('fs');
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs', { recursive: true });
    }

    // Start watchdog BEFORE connecting
    startWatchdog();

    console.log('Conectando ao WhatsApp...\n');
    await client.initialize(tenantId);
}

// ═══════════════════════════════════════════════════
// TRATAMENTO DE ERROS GLOBAIS (NUNCA MORRER)
// ═══════════════════════════════════════════════════

process.on('uncaughtException', (err) => {
    log.error('⚠️ Exceção não capturada (recuperando)', { error: err.message, stack: err.stack });
    console.error('⚠️ ERRO NÃO CAPTURADO (bot continua rodando):', err.message);
    // NÃO FAZ process.exit — PM2 não precisa reiniciar tudo
    // Apenas loga e continua
});

process.on('unhandledRejection', (reason) => {
    log.error('⚠️ Promise rejeitada não tratada', { reason: String(reason) });
    console.error('⚠️ PROMISE REJEITADA:', String(reason));
    // NÃO FAZ process.exit
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Desligando bot...');
    try {
        await client.destroy();
    } catch { }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Desligando bot (SIGTERM)...');
    try {
        await client.destroy();
    } catch { }
    process.exit(0);
});

// ═══════════════════════════════════════════════════
// EXPRESS SERVER (API + QR Code)
// ═══════════════════════════════════════════════════

const app = express();
app.use(cors()); // Permitir conexões do dashboard
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos (Dashboard)

// Middleware Auth (Query Param — para iframe)
const checkAuth = async (req, res, next) => {
    const token = req.query.token;
    const validToken = process.env.QR_TOKEN || process.env.CURRENT_QR_TOKEN;

    // Primeiro checa se é o Token de Sessão (QR Code)
    if (token === validToken) return next();

    if (token && token.length > 50) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) return next();
    }
    res.status(401).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #1a1a2e;">🛑 Acesso Restrito</h1>
            <p>Autenticação oficial via Supabase necessária.</p>
        </div>
    `);
};

// Middleware Auth (Bearer — para API)
const checkApiAuth = async (req, res, next) => {
    // Bypass para acesso local apenas em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        const origin = req.headers.origin;
        if (origin && (origin.includes('localhost:3000') || origin.includes('localhost:3001'))) {
            return next();
        }
    }

    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    if (!token || token.length < 50) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!user || error) {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
};

// Rate Limiting para API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 requests por windowMs
    message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Aplicar rate limiter apenas nas rotas /api
app.use('/api/', apiLimiter);

// ─── Página Principal (QR Code) ───
app.get('/', checkAuth, (req, res) => {
    if (client.info) {
        res.send(`<h1>✅ Secretária Online Ativa</h1><p>Conectado como: ${client.info.wid.user}</p>`);
    } else if (lastQrCode) {
        const token = req.query.token;
        res.send(`
            <h1>⚠️ Bot Desconectado</h1>
            <p>Escaneie o QR Code abaixo para reconectar:</p>
            <p>Escaneie o QR Code abaixo para reconectar:</p>
            <img src="qr?token=${token}" style="border: 10px solid white; border-radius: 5px;" />
            <p><small>Token: ${token}</small></p>
            <script>setTimeout(() => window.location.reload(), 5000);</script>
        `);
    } else {
        res.send('<h1>⏳ Aguardando QR Code...</h1><script>setTimeout(() => window.location.reload(), 5000);</script>');
    }
});

app.get('/qr', checkAuth, async (req, res) => {
    if (!lastQrCode) return res.status(404).send('QR Code não disponível');
    try {
        const url = await qrcodeImage.toDataURL(lastQrCode);
        const img = Buffer.from(url.split(',')[1], 'base64');
        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length });
        res.end(img);
    } catch (e) {
        res.status(500).send('Erro ao gerar QR Code');
    }
});

// ─── Health Check (público — para monitoramento externo) ───
app.get('/health', (req, res) => {
    const uptime = process.uptime();
    const memMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    const isHealthy = connectionState === 'CONNECTED' && !!client.info;

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        state: connectionState,
        connected: !!client.info,
        paused: isBotPaused(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}min`,
        memory: `${memMB}MB`,
        messagesProcessed: totalMessagesProcessed,
        lastMessageAgo: `${Math.floor((Date.now() - lastMessageTime) / 1000)}s`,
        version: BOT_VERSION,
        timestamp: new Date().toISOString()
    });
});

// ─── GET /api/public-config (Para o Frontend) ───
app.get('/api/public-config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY // A Anon Key é segura no frontend
    });
});

// ─── GET /api/status ───
app.get('/api/status', checkApiAuth, (req, res) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    res.json({
        connected: connectionState === 'CONNECTED' && !!client.info,
        state: connectionState,
        paused: isBotPaused(),
        uptime: `${hours}h ${minutes}min`,
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        messagesProcessed: totalMessagesProcessed,
        lastMessageAgo: `${Math.floor((Date.now() - lastMessageTime) / 1000)}s`,
        version: BOT_VERSION,
        tenantId: process.env.TENANT_ID,
        botName: config.bot.name,
        professionalName: config.professional.name,
        timestamp: new Date().toISOString()
    });
});

// ─── GET /api/slots ───
app.get('/api/slots', checkApiAuth, async (req, res) => {
    try {
        const { getAvailableSlots } = require('./calendar');
        const slots = await getAvailableSlots(null, 30);
        res.json({ slots });
    } catch (err) {
        log.error('API /slots error:', err);
        res.status(500).json({ error: 'Erro ao buscar slots' });
    }
});

// ─── POST /api/slots ───
app.post('/api/slots', checkApiAuth, async (req, res) => {
    try {
        const { date, startTime, endTime, location, type } = req.body;
        if (!date || !startTime || !endTime || !location) {
            return res.status(400).json({ error: 'Campos obrigatórios: date, startTime, endTime, location' });
        }

        const { createAvailabilitySlots } = require('./calendar');
        const slots = await createAvailabilitySlots(date, startTime, endTime, location, type);

        if (slots.length === 0) {
            return res.status(500).json({ error: 'Não foi possível criar os horários' });
        }

        log.info(`🌐 Admin Panel: ${slots.length} slots criados para ${date}`);
        res.json({ success: true, count: slots.length });
    } catch (err) {
        log.error('API POST /slots error:', err);
        res.status(500).json({ error: 'Erro ao criar slots' });
    }
});

// ─── DELETE /api/slots ───
app.delete('/api/slots', checkApiAuth, async (req, res) => {
    try {
        const { id, dateTime } = req.body;
        if (!id && !dateTime) {
            return res.status(400).json({ error: 'Campo obrigatório: id ou dateTime' });
        }

        const { removeSlot } = require('./calendar');
        const removed = await removeSlot(id || dateTime);

        if (!removed) {
            return res.status(404).json({ error: 'Horário não encontrado ou já removido' });
        }

        log.info(`🌐 Admin Panel: Slot removido ${dateTime}`);
        res.json({ success: true });
    } catch (err) {
        log.error('API DELETE /slots error:', err);
        res.status(500).json({ error: 'Erro ao remover slot' });
    }
});

// ─── GET /api/public/slots (Public Homepage) ───
app.get('/api/public/slots', async (req, res) => {
    try {
        const { getAvailableSlots } = require('./calendar');
        // Busca slots para os próximos 30 dias
        const slots = await getAvailableSlots(null, 30);

        // Retorna apenas dados públicos (data/hora + local)
        const safeSlots = slots.map(s => ({
            start: s.start,
            location: s.location
        }));

        res.json({ slots: safeSlots });
    } catch (err) {
        log.error('API PUBLIC /slots error:', err);
        res.status(500).json({ error: 'Erro ao buscar horários' });
    }
});

// ─── GET /api/agenda ───
app.get('/api/agenda', checkApiAuth, async (req, res) => {
    try {
        const { getAppointments } = require('./calendar');
        const date = req.query.date || null;
        const appointments = await getAppointments(date);
        res.json({ appointments });
    } catch (err) {
        log.error('API /agenda error:', err);
        res.status(500).json({ error: 'Erro ao buscar agenda' });
    }
});

// ─── GET /api/dashboard/metrics ───
app.get('/api/dashboard/metrics', checkApiAuth, async (req, res) => {
    try {
        const { getDashboardStats } = require('./calendar');
        const days = req.query.days ? parseInt(req.query.days) : 30;

        const stats = await getDashboardStats(days);

        if (!stats) {
            return res.status(500).json({ error: 'Erro ao gerar métricas' });
        }

        // Adicionar contagem de Leads do Supabase
        res.json(stats);
    } catch (err) {
        log.error('API /dashboard/metrics error:', err);
        res.status(500).json({ error: 'Erro ao buscar métricas' });
    }
});

// ─── GET /api/crm/leads ───
app.get('/api/crm/leads', checkApiAuth, async (req, res) => {
    try {
        const { getLeads } = require('./crm');
        const filter = req.query.filter || 'all';
        const value = req.query.value || null;
        const leads = await getLeads(filter, value);
        res.json({ leads });
    } catch (err) {
        log.error('API /crm/leads error:', err);
        res.status(500).json({ error: 'Erro ao buscar leads' });
    }
});

// ─── POST /api/crm/broadcast ───
app.post('/api/crm/broadcast', checkApiAuth, async (req, res) => {
    try {
        const { phones, message } = req.body;
        if (!phones || !Array.isArray(phones) || !message) {
            return res.status(400).json({ error: 'Campos obrigatórios: phones (array), message' });
        }

        // Validação e Normalização
        const { normalizePhone } = require('./utils');
        const validPhones = phones
            .map(p => normalizePhone(p.toString()))
            .filter(p => p && p.length >= 10); // Min length check

        if (validPhones.length === 0) {
            return res.status(400).json({ error: 'Nenhum telefone válido encontrado.' });
        }

        log.info(`📢 Iniciando broadcast para ${validPhones.length} contatos validos`);

        // Processamento em Background
        (async () => {
            let success = 0;
            let failed = 0;

            for (const phone of validPhones) {
                try {
                    const chatId = `${phone}@c.us`;
                    await client.sendMessage(chatId, message);
                    success++;
                    // Delay Aleatório "Human-Like" (5s a 15s) - Aumentei para segurança
                    await delay(Math.random() * 10000 + 5000);
                } catch (e) {
                    log.error(`Falha no broadcast para ${phone}`, e);
                    failed++;
                }
            }
            log.info(`📢 Broadcast finalizado: ${success} enviados, ${failed} falhas.`);
        })();

        res.json({
            success: true,
            message: `Disparo iniciado para ${validPhones.length} contatos.`,
            estimated_time: `${Math.ceil((validPhones.length * 10) / 60)} minutos`
        });

    } catch (err) {
        log.error('API /crm/broadcast error:', err);
        res.status(500).json({ error: 'Erro ao iniciar broadcast' });
    }
});

// ─── POST /api/bot/pause ───
app.post('/api/bot/pause', checkApiAuth, (req, res) => {
    const { handleAdminCommand: execCmd } = require('./admin');
    execCmd('/pausa');
    log.info('🌐 Admin Panel: Bot pausado');
    res.json({ success: true, paused: true });
});

// ─── POST /api/bot/resume ───
app.post('/api/bot/resume', checkApiAuth, (req, res) => {
    const { handleAdminCommand: execCmd } = require('./admin');
    execCmd('/retomar');
    log.info('🌐 Admin Panel: Bot retomado');
    res.json({ success: true, paused: false });
});

// ─── GET /api/settings ───
app.get('/api/settings', checkApiAuth, (req, res) => {
    try {
        const { getConfig } = require('./configLoader');
        const config = getConfig();
        res.json(config);
    } catch (err) {
        log.error('API GET /settings error:', err);
        res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

// ─── POST /api/settings ───
app.post('/api/settings', checkApiAuth, (req, res) => {
    try {
        const { saveConfig } = require('./configLoader');
        const newConfig = req.body;

        // Validação básica
        if (!newConfig || typeof newConfig !== 'object') {
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const updated = saveConfig(newConfig, 'kevelyn_beauty');
        log.info('🌐 Admin Panel: Configurações atualizadas');

        res.json({ success: true, config: updated });
    } catch (err) {
        log.error('API POST /settings error:', err);
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

// ─── Iniciar servidor ───
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`🔒 Servidor Web Seguro rodando na porta ${PORT}`);
    console.log(`🔑 Autenticação Local Bypass: Ativada para localhost`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// ─── Iniciar! ───
console.log('🏁 Iniciando sequência de boot...');
start().catch((err) => {
    console.error('⚠️ Aviso: Inicialização do WhatsApp falhou (o servidor API continua rodando):', err.message);
    connectionState = 'DISCONNECTED';
});









