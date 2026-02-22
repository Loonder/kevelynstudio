const { extractNumber, isBackCommand } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');

async function handleQuizzes(session, text) {
    const num = extractNumber(text);
    if (num && num >= 1 && num <= KNOWLEDGE.quizzes.length) {
        return [await getMessage('teste_resultado', { resultado: KNOWLEDGE.quizzes[num - 1].url })];
    }
    if (num === 7 || isBackCommand(text)) {
        session.state = STATES.MENU;
        return [await getMessage('menu_principal')];
    }
    return ['🤔 Responda com o *número* do teste (1 a 6) ou *7* para voltar.'];
}

module.exports = { handleQuizzes };






