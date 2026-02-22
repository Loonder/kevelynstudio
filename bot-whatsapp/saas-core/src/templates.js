const { getConfig } = require('./configLoader');

const TEMPLATES = {
    greeting: (config) => {
        // Ex: "Olá! Bem-vindo ao atendimento da Kevelyn."
        return `Olá! 🌸 Bem-vindo(a) ao atendimento de *${config.professional.name}*.\n${config.professional.title}`;
    },
    menu: (config) => {
        return `Sou a *${config.bot.name}*, sua assistente virtual. Como posso cuidar de você hoje?\n\n` +
            `1️⃣ Agendar Atendimento\n` +
            `2️⃣ Valores e Serviços\n` +
            `3️⃣ Endereço e Localização\n` +
            `4️⃣ Minhas Agendas\n` +
            `5️⃣ Outras Dúvidas (FAQ)\n\n` +
            `_Digite o número da opção desejada._`;
    },
    human_takeover: (config) => {
        return `Entendi. Vou chamar a *${config.professional.name}* para te atender pessoalmente.\n\nPor favor, aguarde um instante. ⏳`;
    },
    waiting_list: (config) => {
        return `Nossa agenda está cheia no momento. Deseja entrar na *Lista de Espera*? Avise-nos e entraremos em contato assim que surgir uma vaga.`;
    }
};

function getTemplate(key) {
    const config = getConfig();
    if (TEMPLATES[key]) {
        return TEMPLATES[key](config);
    }
    return `[Template não encontrado: ${key}]`;
}

module.exports = { getTemplate };








