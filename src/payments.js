/**
 * MÓDULO DE PAGAMENTOS — Gabriela Kevelyn
 * Responsável por gerar links Pix e validar pagamentos.
 */

const { log } = require('./logger');
const { getMessage } = require('./messages');

/**
 * Gera um link ou código Pix Copia e Cola para um agendamento.
 * @param {object} appointment - Dados do agendamento
 * @param {object} service - Dados do serviço (preço)
 */
async function generatePaymentRequest(service, appointment = {}) {
    if (!service || !service.price) {
        log.info('Serviço gratuito ou valor não definido. Pulando pagamento.');
        return null;
    }

    log.info(`Gerando cobrança Pix para ${service.name} (R$ ${service.price},00)`);

    // Pegar a chave do .env ou usar placeholder
    const rawKey = process.env.PIX_KEY || "000.000.000-00";
    const cleanKey = rawKey.replace(/\D/g, '');

    // Payload Pix Estático (simplificado)
    // 0111/0114 indica o tamanho da chave (CPF/CNPJ/etc)
    const pixCode = "00020126" + (cleanKey.length + 22) + "0014BR.GOV.BCB.PIX01" + cleanKey.length + cleanKey + "5204000053039865405" + (service.price) + ".005802BR5916GABRIELA_KEVELYN6008SAO_PAULO62070503***63041234";

    return {
        key: rawKey,
        valor: service.price,
        message: '✨ *Para confirmar seu agendamento, realize o pagamento via Pix:*'
    };
}

module.exports = {
    generatePaymentRequest
};






