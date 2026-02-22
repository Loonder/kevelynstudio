const { getConfig } = require('../configLoader');

async function handleMenu(session, text, phone, sendNotification, dependencies) {
    const { STATES, updateSessionState, getServicesMessage, getPickServiceMessage, getFaqMessage, getLocationsMessage, getPackagesMessage } = dependencies;
    const config = getConfig();

    const num = extractNumber(text);
    const lower = text.toLowerCase().trim();

    // ... (rest of checks)

    if (num === 6 || lower.includes('falar') || lower.includes('humano')) {
        return [
            '🚨 *Solicitação Recebida*',
            '',
            `Já avisei a *${config.professional.name}* sobre sua urgência. ✨`,
            'Nossa equipe entrará em contato com você o mais breve possível.',
            '',
            '_O atendimento automático foi encerrado por aqui. Aguarde o retorno._'
        ];
    }
    if (num === 7 || lower.includes('pacote') || lower.includes('promo')) {
        session.state = STATES.PACKAGES;
        return [await getPackagesMessage(session)];
    }

    if (num === 8 || lower.includes('parar') || lower.includes('sair') || lower.includes('encerrar')) {
        const { setOptOut } = require('../crm');
        await setOptOut(phone, true);
        return ['🚫 *Bot Pausado para você.*\n\nVocê não receberá mais mensagens automáticas.\nPara reativar, digite *RETOMAR* ou *START* a qualquer momento.'];
    }

    // Adicionar a opção 8 visualmente no erro genérico também, caso o usuário erre
    const menuError = await getMessage('menu_principal');
    const menuWithStop = menuError.includes('8️⃣') ? menuError : `${menuError}\n8️⃣ Encerrar / Parar Robô 🛑`;

    return [[
        await getMessage('erro_generico'),
        '',
        menuWithStop,
    ].join('\n')];
}

module.exports = { handleMenu };








