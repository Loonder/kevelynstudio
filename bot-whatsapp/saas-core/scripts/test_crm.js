const { addTag, hasTag, removeTag } = require('../src/crm');
const supabase = require('../src/db');

async function testTags() {
    const testPhone = '5511999999999';

    console.log('🧪 Testando CRM Tags...');

    // Limpar antes
    await removeTag(testPhone, 'TESTE_TAG');

    // 1. Adicionar
    console.log('1. Adicionando Tag...');
    await addTag(testPhone, 'TESTE_TAG');

    // 2. Verificar
    const has = await hasTag(testPhone, 'TESTE_TAG');
    console.log(`2. Tem tag? ${has ? '✅ Sim' : '❌ Não'}`);

    if (has) {
        console.log('✅ Teste de Adição OK');
    } else {
        console.error('❌ Teste de Adição FALHOU');
    }

    // 3. Remover
    console.log('3. Removendo Tag...');
    await removeTag(testPhone, 'TESTE_TAG');

    const hasAfter = await hasTag(testPhone, 'TESTE_TAG');
    console.log(`4. Tem tag após remover? ${hasAfter ? '❌ Sim' : '✅ Não'}`);
}

testTags();



