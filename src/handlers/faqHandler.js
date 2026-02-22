const { extractNumber } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');

function getFaqMessage() {
    const lines = ['❓ *Dúvidas Frequentes:*\n'];
    KNOWLEDGE.faq.forEach((f, i) => lines.push(`${i + 1}️⃣ ${f.emoji} ${f.question}`));
    lines.push('\n_Responda com o número da dúvida, ou digite *"voltar"* para o menu._');
    return lines.join('\n');
}

function getFaqDetailMessage(index) {
    const faq = KNOWLEDGE.faq[index];
    return [
        `${faq.emoji} *${faq.question}*`,
        '',
        faq.answer,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━',
        '1️⃣ Ver outras dúvidas',
        '2️⃣ Agendar uma sessão',
        '3️⃣ Voltar ao menu',
    ].join('\n');
}

async function handleFaq(session, text) {
    const num = extractNumber(text);
    if (num && num >= 1 && num <= KNOWLEDGE.faq.length) {
        session.state = STATES.FAQ_DETAIL;
        session.data.viewingFaq = num - 1;
        return [getFaqDetailMessage(num - 1)];
    }
    return [[
        '🤔 Não entendi. Responda com o *número* da dúvida ou escreva sua pergunta.',
        '',
        getFaqMessage(),
    ].join('\n')];
}

async function handleFaqDetail(session, text, dependencies) {
    const { getPickServiceMessage } = dependencies;
    const num = extractNumber(text);
    if (num === 1) { session.state = STATES.FAQ; return [getFaqMessage()]; }
    if (num === 2) { session.state = STATES.PICK_SERVICE; return [await getPickServiceMessage(session)]; }
    if (num === 3) { session.state = STATES.MENU; session.data = {}; return [await getMessage('menu_principal')]; }
    return ['🤔 Não entendi. Responda com *1*, *2* ou *3*.'];
}

module.exports = {
    getFaqMessage,
    getFaqDetailMessage,
    handleFaq,
    handleFaqDetail
};






