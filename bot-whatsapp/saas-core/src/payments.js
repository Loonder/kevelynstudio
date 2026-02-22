/**
 * MÓDULO DE PAGAMENTOS (FASE 6) — Gabriela Kevelyn
 * Responsável por gerar links Pix e validar pagamentos.
 */

const { log } = require('./logger');
const { getMessage } = require('./messages');

const { generatePixPayload } = require('./utils');
const { getConfig } = require('./configLoader');

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

    const config = getConfig();
    const pixKey = config.professional?.pixKey;
    const pixName = config.professional?.pixName || config.professional?.name || 'RECEBEDOR';
    const pixCity = config.professional?.pixCity || 'SAO PAULO';

    if (!pixKey || pixKey === '000.000.000-00') {
        log.warn('Chave Pix não configurada para este Tenant. Pulando.');
        return null;
    }

    log.info(`Gerando cobrança Pix para ${service.name} (R$ ${service.price}) - Key: ${pixKey}`);

    const pixCode = generatePixPayload(
        pixKey.replace(/\s/g, ''), // Limpa espaços
        pixName,
        pixCity,
        service.price,
        'ECOMM01' // TxID (pode ser dinâmico no futuro)
    );

    return {
        key: pixKey,
        valor: service.price,
        message: '✨ *Para confirmar seu agendamento, realize o pagamento via Pix:*'
    };
}

module.exports = {
    generatePaymentRequest
};








