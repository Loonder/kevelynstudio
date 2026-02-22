const { extractNumber } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');

async function getServicesMessage() {
    const lines = ['📋 *Nossos Serviços:*\n'];
    KNOWLEDGE.services.forEach((svc, i) => {
        const price = svc.price ? ` — R$ ${svc.price},00` : '';
        lines.push(`${i + 1}️⃣ ${svc.emoji} *${svc.name}*${price}`);
    });
    lines.push('\n_Responda com o número para saber mais, ou digite *"voltar"* para o menu._');
    return lines.join('\n');
}

function getServiceDetailMessage(index) {
    const svc = KNOWLEDGE.services[index];
    const price = svc.price ? `\n💰 *Valor:* R$ ${svc.price},00` : '\n💰 *Valor:* Consulte para mais informações';
    return [
        `${svc.emoji} *${svc.name}*`,
        '',
        svc.description,
        price,
        `⏱️ *Duração:* ${svc.duration}`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━',
        '1️⃣ Agendar este serviço',
        '2️⃣ Ver outros serviços',
        '3️⃣ Voltar ao menu',
        '',
        '_Responda com o número._',
    ].join('\n');
}

async function handleServices(session, text) {
    const num = extractNumber(text);
    if (num && num >= 1 && num <= KNOWLEDGE.services.length) {
        session.state = STATES.SERVICE_DETAIL;
        session.data.viewingService = num - 1;
        return [getServiceDetailMessage(num - 1)];
    }
    return [[
        `🤔 Não entendi. Responda com o *número* do serviço (1 a ${KNOWLEDGE.services.length}).`,
        '',
        await getServicesMessage(),
    ].join('\n')];
}

async function handleServiceDetail(session, text, dependencies) {
    const { getPickServiceMessage, getPickLocationMessage } = dependencies;
    const num = extractNumber(text);
    const lower = text.toLowerCase().trim();

    if (num === 1 || lower.includes('agendar')) {
        session.state = STATES.PICK_SERVICE;
        const serviceIndex = session.data.viewingService;
        if (serviceIndex !== undefined && serviceIndex < KNOWLEDGE.services.length) {
            session.data.selectedService = serviceIndex;
            session.state = STATES.PICK_LOCATION;
            const service = KNOWLEDGE.services[serviceIndex];
            return [getPickLocationMessage(service)];
        }
    }
    if (num === 2) {
        session.state = STATES.SERVICES;
        return [await getServicesMessage()];
    }
    if (num === 3 || lower.includes('voltar')) {
        session.state = STATES.MENU;
        session.data = {};
        return [await getMessage('menu_principal')];
    }
    return ['🤔 Não entendi. Responda com *1*, *2* ou *3*.'];
}

module.exports = {
    getServicesMessage,
    getServiceDetailMessage,
    handleServices,
    handleServiceDetail
};








