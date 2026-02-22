const { STATES } = require('../constants');
const { getMessage } = require('../messages');

const { addTag } = require('../crm');

function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

function getFirstName(fullName) {
    if (!fullName) return '';
    return fullName.split(' ')[0];
}

async function handleGreeting(session, phone, text) {
    session.state = STATES.MENU;
    // Auto-CRM: Marcar como LEAD se for a primeira vez
    await addTag(phone, 'LEAD');

    const greetingTime = getTimeGreeting();
    const firstName = getFirstName(session.name);

    // Saudação Personalizada
    let welcomeText = `Olá! 🌸 *${greetingTime}*!`;
    if (firstName) {
        welcomeText = `Olá, *${firstName}*! 🌸 ${greetingTime}!`;
    }

    // ─── 1. INTENT RECOGNITION (Fase 8) ───
    const lower = text ? text.toLowerCase().trim() : '';

    // Atraso / Espera
    if (lower.includes('atrasar') || lower.includes('atraso') || lower.includes('espera') || lower.includes('chegando')) {
        return [
            'Já notifiquei a *Gabriela Kevelyn* e a equipe sobre seu imprevisto. ✨',
            'Fique tranquila, estamos te aguardando!',
            '',
            'Posso ajudar em algo mais?'
        ];
    }

    // Agradecimento
    if (lower === 'obrigado' || lower === 'obrigada' || lower.includes('valeu') || lower.includes('grato')) {
        return ['De nada! 🌸 Conte comigo sempre que precisar.'];
    }

    // Parar / Sair (Antecipado)
    if (lower.includes('parar') || lower.includes('sair') || lower.includes('cancelar recebimento')) {
        const { setOptOut } = require('../crm');
        await setOptOut(phone, true);
        return ['🚫 *Você optou por não receber mais mensagens automáticas.*\n\nSe mudar de ideia, digite *RETOMAR* a qualquer momento.'];
    }

    // Urgência (Falar com Humano direto)
    if (lower.includes('falar com') || lower.includes('humano') || lower.includes('atendente') || lower.includes('urgente')) {
        const { updateSessionState } = require('../conversation');
        updateSessionState(phone, STATES.HUMAN, { humanTakeover: true });
        return [
            '🚨 *Entendi, é urgente.*',
            'Já chamei a *Gabriela Kevelyn* para assumir esta conversa.',
            'Aguarde um momento, por favor. ✨'
        ];
    }

    // Dúvida de Valor (Direto)
    if (lower.includes('valor') || lower.includes('preço') || lower.includes('quanto custa')) {
        const { getFaqMessage } = require('./faqHandler');
        session.state = STATES.FAQ;
        return [getFaqMessage()];
    }

    // ─── 2. MENU PRINCIPAL ───
    session.state = STATES.MENU; // Set state to MENU if no specific intent was matched
    const menu = await getMessage('menu_principal');

    // Adicionar opção de "Parar Robô" dinamicamente se não existir
    const menuWithStop = menu.includes('8️⃣')
        ? menu
        : `${menu}\n8️⃣ Encerrar / Parar Robô 🛑`;

    return [
        `${welcomeText}\n\nSou a sua assistente virtual da *Gabriela Kevelyn*. Como posso cuidar de você hoje?\n\n${menuWithStop}`
    ];
}

module.exports = { handleGreeting };






