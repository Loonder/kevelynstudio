const { extractNumber } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');

function getLocationsMessage() {
    const lines = ['📍 *Estúdios e Atendimento:*\n'];
    KNOWLEDGE.locations.forEach((loc) => {
        lines.push(`${loc.emoji} *${loc.name}*`);
        lines.push(`   ${loc.address}\n`);
    });
    lines.push('━━━━━━━━━━━━━━━━━━━━━━\n1️⃣ Agendar uma sessão\n2️⃣ Voltar ao menu');
    return lines.join('\n');
}

async function handleLocations(session, text, dependencies) {
    const { getPickServiceMessage } = dependencies;
    const num = extractNumber(text);
    if (num === 1) { session.state = STATES.PICK_SERVICE; return [await getPickServiceMessage(session)]; }
    if (num === 2) { session.state = STATES.MENU; return [await getMessage('menu_principal')]; }
    return ['🤔 Responda com *1* ou *2*.'];
}

module.exports = {
    getLocationsMessage,
    handleLocations
};






