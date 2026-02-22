require('dotenv').config();
const supabase = require('../src/db');
const { log } = require('../src/logger');

async function testMedicalRecords() {
    console.log('🧪 Iniciando teste de Prontuário (Fase 15)...');

    const testPhone = '5511999999999';
    const testContent = 'Teste de validação de tabela - ' + new Date().toISOString();

    try {
        // 1. Tentar INSERIR
        const { data, error } = await supabase
            .from('medical_records')
            .insert([{
                phone: testPhone,
                patient_name: 'Paciente Teste Bot',
                content: testContent
            }])
            .select();

        if (error) {
            console.error('❌ Erro ao inserir no Prontuário:', error.message);
            console.log('⚠️ Provável causa: A tabela medical_records não existe.');
        } else {
            console.log('✅ Sucesso! Registro criado:', data);

            // 2. Tentar DELETAR (Limpeza)
            const del = await supabase
                .from('medical_records')
                .delete()
                .eq('id', data[0].id);

            console.log('🧹 Registro de teste removido.');
        }

    } catch (err) {
        console.error('❌ Erro inesperado:', err);
    }
}

testMedicalRecords();



