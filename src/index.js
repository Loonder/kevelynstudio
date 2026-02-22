// =====================================================
process.env.TZ = 'America/Sao_Paulo';
// SECRETÁRIA ONLINE — Gabriela Kevelyn
// Ponto de entrada principal (PRODUÇÃO 24/7)
// =====================================================

// ─── LOCKFILE (Previne duplicidade) ───
const fs = require('fs');
const path = require('path');
const LOCK_FILE = path.join(__dirname, '../start.lock');

try {
    if (fs.existsSync(LOCK_FILE)) {
        const pid = fs.readFileSync(LOCK_FILE, 'utf8');
        try {
            process.kill(pid, 0); // Checa se o processo ainda existe
            console.error(`❌ Processo já rodando (PID: ${pid}). Abortando.`);
            process.exit(1);
        } catch (e) {
            // Processo morreu, podemos continuar
            console.log('⚠️ Lockfile encontrado mas processo morto. Removendo lock.');
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
    process.exit();
};
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
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
const { createClient } = require('@supabase/supabase-js');

// ─── Configuração ───
const ADMIN_PHONE = normalizePhone(process.env.ADMIN_PHONE);
if (!process.env.ADMIN_PHONE) {
    console.error('❌ ADMIN_PHONE não configurado no .env');
    process.exit(1);
}
const BOT_VERSION = '1.1.1 (Patch Timezone/Scheduler)';

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
const processedMessageIds = new Set(); // Cache de IDs processados para evitar duplicidade

// ─── Inicializar WhatsApp Client ───
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--single-process',
        ],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/nicedayzhu/whatsapp-web.js-cache/refs/heads/main/nicedayzhu/nicedayzhu_cache.json',
    },
});

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
        await client.initialize();
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
    const token = process.env.QR_TOKEN;

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

client.on('ready', () => {
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

    // Iniciar scheduler (lembretes, feedbacks, aniversários)
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
    // START: Fix for Loop/Duplicate issue
    // 1. Ignore if not from me (obviously)
    if (!msg.fromMe) return;

    // 2. Ignore if it's the bot itself (Client ID check)
    // client.info.wid._serialized is the bot's own ID
    if (client.info && client.info.wid._serialized === msg.author) return;

    // 3. Fallback: Check known bot message IDs
    if (botMessageIds.has(msg.id.id)) return;

    // 4. Ignore status updates or group messages
    if (msg.to === 'status@broadcast' || msg.to.includes('@g.us')) return;

    // If we got here, it's likely a HUMAN sending a message from the phone
    const toPhone = normalizePhone(msg.to.replace('@c.us', ''));

    log.info(`👤 Human Takeover detectado para ${toPhone} (Autor: HELPER/HUMAN)`);

    // Calcular horário de retomada (Amanhã às 06:00)
    const dayjs = require('dayjs');
    const resumeAt = dayjs().add(1, 'day').hour(6).minute(0).startOf('minute').valueOf();

    // Update session to HUMAN state (pauses bot)
    updateSessionState(toPhone, STATES.HUMAN, {
        humanTakeover: true,
        resumeAt: resumeAt
    });
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
    console.log(`🔍 DEBUG RAW MESSAGE: From=${message.from} Body=${message.body ? message.body.substring(0, 10) : 'null'} Type=${message.type}`);
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

        // ─── DEDUPLICAÇÃO DE MENSAGENS (CRÍTICO) ───
        // Evita processar a mesma mensagem duas vezes se o evento disparar duplicado
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
        if (message.from.includes('@lid')) {
            try {
                const contact = await message.getContact();
                phone = normalizePhone(contact.number || contact.id?.user || '');
            } catch {
                phone = normalizePhone(message.from.replace(/@.*$/, ''));
            }
        } else {
            phone = normalizePhone(message.from.replace('@c.us', ''));
        }

        // 0. ANTI-FLOOD CHECK
        if (!checkFlood(phone)) return; // Silently block or maybe log inside checkFlood

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

        // ─── Debounce ───
        if (messageQueue.has(phone)) {
            clearTimeout(messageQueue.get(phone));
        }

        const { updateSessionState, STATES, getSession } = require('./conversation');

        // ... (inside client.on('message') handler) ...

        messageQueue.set(phone, setTimeout(async () => {
            messageQueue.delete(phone);

            try {
                const chat = await message.getChat();

                // Start Typing
                await simulateTyping(chat, text.length > 50 ? 2500 : 1500);

                const responses = await processMessage(phone, text, message, sendAdminNotification);

                const currentSession = await require('./conversation').getSession(phone);
                if (currentSession.state === STATES.HUMAN && currentSession.data.humanTakeover) {
                    log.info(`🤫 Silenciando resposta pendente para ${phone} (Human Takeover)`);
                    return;
                }


                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    if (!response) continue;

                    let sentMsg;

                    if (typeof response === 'object') {
                        // Rich Message (Media + Caption)
                        if (response.media) {
                            try {
                                const { MessageMedia } = require('whatsapp-web.js');
                                const media = MessageMedia.fromFilePath(response.media);
                                sentMsg = await chat.sendMessage(media, { caption: response.text });
                            } catch (e) {
                                console.error('Erro ao enviar mídia:', e);
                                if (response.text) sentMsg = await chat.sendMessage(response.text);
                            }
                        } else if (response.text) {
                            sentMsg = await chat.sendMessage(response.text);
                        }
                    } else if (typeof response === 'string' && response.trim()) {
                        // Text Message
                        sentMsg = await chat.sendMessage(response);
                    }

                    // Track Bot Message ID
                    if (sentMsg && sentMsg.id) {
                        botMessageIds.add(sentMsg.id.id);
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
    console.log('🌸 Secretária Online — Gabriela Kevelyn');
    console.log(`   v${BOT_VERSION} (Produção 24/7)`);
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
    await client.initialize();
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
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos (Dashboard)

const QR_TOKEN = process.env.QR_TOKEN;

// Middleware Auth (Query Param — para iframe)
const checkAuth = async (req, res, next) => {
    const token = req.query.token;
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

// ─── Página Principal (QR Code) ───
app.get('/', checkAuth, (req, res) => {
    if (client.info) {
        res.send(`<h1>✅ Secretária Online Ativa</h1><p>Conectado como: ${client.info.wid.user}</p>`);
    } else if (lastQrCode) {
        const token = req.query.token;
        res.send(`
            <h1>⚠️ Bot Desconectado</h1>
            <p>Escaneie o QR Code abaixo para reconectar:</p>
            <img src="qr?token=${token}" style="border: 10px solid white; border-radius: 5px;" />
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
        const { count } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true });

        stats.total_leads = count || 0;

        res.json(stats);
    } catch (err) {
        log.error('API /dashboard/metrics error:', err);
        res.status(500).json({ error: 'Erro ao buscar métricas' });
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

// ─── Iniciar servidor ───
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`🔒 Servidor Web Seguro rodando na porta ${PORT}`);
    console.log(`🔑 Autenticação Supabase Ativada`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// ─── Iniciar! ───
start().catch((err) => {
    console.error('Erro fatal na inicialização:', err);
    process.exit(1);
});







