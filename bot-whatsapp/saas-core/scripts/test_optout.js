const { setOptOut, checkOptOut } = require('../src/crm');
const { sendBroadcast } = require('../src/broadcast');
const { addTag } = require('../src/crm');
const supabase = require('../src/db');

// Mock Client
const mockClient = {
    sendMessage: async (chatId, msg) => {
        console.log(`[MOCK] Enviando para ${chatId}: "${msg}"`);
        return { id: { id: 'mock_msg_id' } };
    }
};

async function testOptOut() {
    const testPhone = '5511999999999';
    const TAG = 'TEST_OPTOUT_BROADCAST';

    console.log('🧪 Testando Opt-Out logic...');

    // 0. Setup
    await supabase.from('contacts').upsert({ phone: testPhone, name: 'Teste OptOut' });
    await addTag(testPhone, TAG);

    // 1. Verificar estado inicial (OptOut = false)
    await setOptOut(testPhone, false);
    console.log('1. Opt-out DESATIVADO.');

    // Broadcast deve funcionar
    console.log('📢 Tentando Broadcast (Esperado: SUCESSO)...');
    let count = await sendBroadcast(mockClient, TAG, 'Mensagem 1');
    if (count === 1) console.log('✅ Broadcast 1 enviado.');
    else console.error('❌ Broadcast 1 FALHOU.');

    // 2. Ativar Opt-out via função (simulando comando PARAR)
    console.log('2. Ativando Opt-out...');
    await setOptOut(testPhone, true);
    const isOut = await checkOptOut(testPhone);
    console.log(`Estado atual no banco: ${isOut ? 'BLOQUEADO' : 'LIVRE'}`);

    // Broadcast deve FALHAR (0 enviados)
    console.log('📢 Tentando Broadcast (Esperado: BLOQUEADO)...');
    count = await sendBroadcast(mockClient, TAG, 'Mensagem 2 (Não deve chegar)');
    if (count === 0) console.log('✅ Broadcast 2 bloqueado corretamente.');
    else console.error(`❌ Broadcast 2 enviado para ${count} pessoas (ERRO).`);

    // 3. Cleanup
    await setOptOut(testPhone, false);
    console.log('🧹 Limpeza concluída.');
}

testOptOut();



