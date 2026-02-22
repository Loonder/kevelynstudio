const { generatePixPayload } = require('../src/utils/pix');

const key = '5511999999999';
const name = 'Dr. Teste';
const city = 'Sao Paulo';
const amount = 150.00;
const txid = 'TESTE123';

try {
    console.log('🧪 Gerando Payload Pix...');
    const payload = generatePixPayload(key, name, city, amount, txid);

    console.log('\n📄 Payload Gerado:');
    console.log(payload);

    if (payload.startsWith('000201')) {
        console.log('\n✅ Formato inicial válido (000201).');
    } else {
        console.error('\n❌ Formato inválido.');
    }

    if (payload.includes(key)) {
        console.log('✅ Chave encontrada no payload.');
    } else {
        console.error('❌ Chave não encontrada.');
    }

    if (payload.includes('150.00')) {
        console.log('✅ Valor encontrado (150.00).');
    } else {
        console.error('❌ Valor não encontrado.');
    }

} catch (err) {
    console.error('❌ Erro Fatal:', err);
}



