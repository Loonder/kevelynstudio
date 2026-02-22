const { sendBroadcast } = require('../src/broadcast');
const { addTag, removeTag } = require('../src/crm');
const supabase = require('../src/db');

// Mock Client
const mockClient = {
    sendMessage: async (chatId, msg) => {
        console.log(`[MOCK] Enviando para ${chatId}: "${msg}"`);
        return { id: { id: 'mock_msg_id' } };
    }
};

async function testBroadcast() {
    const testPhone = '5511999999999';
    const TAG = 'TEST_BROADCAST';

    console.log('🧪 Testando Broadcast (Dry Run)...');

    // 0. Garantir que contato existe
    await supabase.from('contacts').upsert({ phone: testPhone, name: 'Teste Broadcast' });

    // 1. Preparar dados
    await addTag(testPhone, TAG);

    // 2. Executar Broadcast
    console.log('📢 Iniciando envio...');
    const start = Date.now();
    const count = await sendBroadcast(mockClient, TAG, 'Olá! Este é um teste de broadcast.');
    const duration = Date.now() - start;

    console.log(`✅ Enviado para ${count} contatos.`);
    console.log(`⏱️ Duração: ${duration}ms (deve ser > 2000ms devido ao delay)`);

    // 3. Limpar
    await removeTag(testPhone, TAG);

    if (count > 0 && duration > 2000) {
        console.log('✅ Teste de Broadcast: SUCESSO');
    } else {
        console.error('❌ Teste de Broadcast: FALHA (Verifique logs)');
    }
}

testBroadcast();



