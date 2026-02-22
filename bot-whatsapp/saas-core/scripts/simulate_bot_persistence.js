// scripts/simulate_bot_persistence.js
require('dotenv').config();
const { processMessage, updateSessionState, STATES, getSession, isHumanTakeoverActive } = require('../src/conversation');
const { log } = require('../src/logger');

// Mock da função sendNotification
const mockSendNotification = async (msg) => {
    console.log(`[MOCK NOTIFICATION] Admin received: ${msg}`);
};

// Mock do objeto Message do whatsapp-web.js
const createMockMessage = (phone, text) => ({
    from: `${phone}@c.us`,
    body: text,
    hasMedia: false,
    type: 'chat',
    getContact: async () => ({ number: phone, id: { user: phone } }),
    getChat: async () => ({
        sendMessage: async (txt) => console.log(`[BOT REPLY to ${phone}]: ${txt}`)
    })
});

async function runTest() {
    const phone = '5511999998888'; // Número de teste

    console.log('--- TEST 1: Iniciar e Persistir Sessão ---');
    // Simula primeira mensagem
    console.log(`[USER]: Oi`);
    const resp1 = await processMessage(phone, 'Oi', createMockMessage(phone, 'Oi'), mockSendNotification);
    console.log(`[BOT]: ${resp1[0] && resp1[0].split('\n')[0]}...`);

    // Verifica se salvou no banco (simulado via log do conversation.js)
    const session1 = await getSession(phone);
    console.log(`Estado atual: ${session1.state}`);

    console.log('\n--- TEST 2: Human Takeover (Simulado) ---');
    // Forçar estado HUMAN como se Admin tivesse falado
    await updateSessionState(phone, STATES.HUMAN, { humanTakeover: true });
    console.log('Admin assumiu controle (Setou HUMAN).');

    // Verificar se flag persistiu
    const isHuman = await isHumanTakeoverActive(phone);
    console.log(`isHumanTakeoverActive? ${isHuman}`);

    if (isHuman) {
        console.log('PASS: Human Takeover detectado corretamente.');
    } else {
        console.error('FAIL: Human Takeover não detectado.');
    }

    console.log('\n--- TEST 3: Loop de Confirmação ---');
    // Resetar para teste de loop
    await updateSessionState(phone, STATES.CONFIRMATION_PENDING, { appointmentId: 'test-id-123' });
    console.log('Estado setado para: CONFIRMATION_PENDING');

    // Usuário responde algo nada a ver
    console.log(`[USER]: Vou atrasar 10 minutos`);
    const resp2 = await processMessage(phone, 'Vou atrasar 10 minutos', createMockMessage(phone, 'Vou atrasar 10 minutos'), mockSendNotification);

    const session2 = await getSession(phone);
    console.log(`Estado após resposta estranha: ${session2.state}`);

    if (session2.state === STATES.CONFIRMATION_PENDING) {
        console.log('PASS: Bot manteve estado de confirmação (Não resetou pro Menu).');
    } else {
        console.error(`FAIL: Bot resetou para ${session2.state}`);
    }

    console.log('\n--- FIM DOS TESTES ---');
}

runTest().catch(console.error);



