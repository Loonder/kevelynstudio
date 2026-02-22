const { extractNumber } = require('../utils');
const { getMessage } = require('../messages');
// We need to access STATES and updateSessionState, maybe return the next state and let controller handle it?
// Or pass session object (which is by reference) and modify it.
// The issue is importing STATES if it's in conversation.js.
// I should move STATES to a separate file `src/constants.js` first.

async function handleMenu(session, text, phone, sendNotification, dependencies) {
    const { STATES, updateSessionState, getServicesMessage, getPickServiceMessage, getFaqMessage, getLocationsMessage, getPackagesMessage } = dependencies;

    const num = extractNumber(text);
    const lower = text.toLowerCase().trim();

    if (num === 1 || lower.includes('serviço') || lower.includes('servico')) {
        session.state = STATES.SERVICES;
        return [await getServicesMessage()];
    }
    if (num === 2 || lower.includes('agendar') || lower.includes('marcar')) {
        session.state = STATES.PICK_SERVICE;
        return [await getPickServiceMessage(session)];
    }
    if (num === 3 || lower.includes('dúvida') || lower.includes('valor')) {
        session.state = STATES.FAQ;
        return [getFaqMessage()];
    }
    if (num === 4 || lower.includes('local') || lower.includes('endereço')) {
        session.state = STATES.LOCATIONS;
        return [getLocationsMessage()];
    }
    if (num === 5 || lower.includes('teste') || lower.includes('quiz')) {
        session.state = STATES.QUIZZES;
        return [await getMessage('teste_convite')];
    }
    if (num === 6 || lower.includes('falar') || lower.includes('humano')) {
        if (sendNotification) {
            await sendNotification(`🚨 *Solicitação de Urgência*\nCliente: ${phone}\nSolicitou falar com atendente.`);
        }

        updateSessionState(phone, STATES.MENU, {});
        updateSessionState(phone, STATES.HUMAN, { humanTakeover: true });

        return [
            '🚨 *Solicitação Recebida*',
            '',
            'Já avisei a *Gabriela Kevelyn* sobre sua urgência. ✨',
            'Ela entrará em contato com você o mais breve possível.',
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






