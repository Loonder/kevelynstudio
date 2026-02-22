const { extractNumber, formatDateTimeBR, calculateAge } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');
const { getAvailableSlots, formatSlotsForWhatsApp } = require('../calendar');
const { log, logContact } = require('../logger');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

async function getPickServiceMessage(session = {}) {
    const lines = ['📅 *Vamos agendar seu procedimento!*', '', 'Qual tipo de serviço você busca?', ''];

    // Lista Genérica (Baseada no Config)
    const servicesToShow = KNOWLEDGE.services;

    servicesToShow.forEach((svc, i) => {
        lines.push(`${i + 1}️⃣ ${svc.emoji || '🔹'} ${svc.name}${svc.price ? ` (R$ ${svc.price},00)` : ''}`);
    });

    lines.push('', '_Responda com o número._');
    return lines.join('\n');
}

function getPickLocationMessage(service) {
    const lines = [' *Onde você prefere ser atendido(a)?*', ''];
    KNOWLEDGE.locations.forEach((loc, i) => lines.push(`${i + 1}️⃣ ${loc.emoji || '📍'} *${loc.name}*`));
    return lines.join('\n');
}

async function fetchAndFormatSlots(session) {
    const locIndex = session.data.selectedLocation;
    if (locIndex === undefined || !KNOWLEDGE.locations[locIndex]) {
        log.error(`❌ Erro em fetchAndFormatSlots: Local inválido (index: ${locIndex})`);
        return '😔 Ocorreu um erro ao identificar o local. Por favor, digite "menu" e tente novamente.';
    }

    const locationId = KNOWLEDGE.locations[locIndex].id;
    // const platform = session.data.platform; // Removido filtro de plataforma hardcoded

    // Usa id do local para buscar slots
    const slots = await getAvailableSlots(locationId, 14); // Default 14 dias
    session.data.availableSlots = slots;

    if (slots.length === 0) {
        return [
            '😔 *Poxa, sem horários disponíveis esta semana.*',
            '1️⃣ Entrar na Lista de Espera',
            '2️⃣ Tentar outro local',
            '3️⃣ Voltar ao menu',
        ].join('\n');
    }
    return formatSlotsForWhatsApp(slots);
}

async function handlePickService(session, text) {
    const num = extractNumber(text);
    const servicesList = KNOWLEDGE.services;

    if (num && num >= 1 && num <= servicesList.length) {
        const selected = servicesList[num - 1];

        // Salva ID e Index
        session.data.selectedService = num - 1; // Index no array KNOWLEDGE
        session.data.serviceId = selected.id;

        // Se só tiver 1 local, seleciona automático
        if (KNOWLEDGE.locations.length === 1) {
            session.data.selectedLocation = 0;
            session.state = STATES.PICK_SLOT;
            return [
                `Ótima escolha: *${selected.name}*!`,
                '',
                await fetchAndFormatSlots(session)
            ];
        }

        // Fluxo normal: Pergunta local
        session.state = STATES.PICK_LOCATION;
        return [getPickLocationMessage(selected)];
    }

    return ['🤔 Escolha uma opção válida da lista.'];
}

async function handlePickLocation(session, text) {
    const num = extractNumber(text);
    if (num && num >= 1 && num <= KNOWLEDGE.locations.length) {
        session.data.selectedLocation = num - 1;
        session.state = STATES.PICK_SLOT;
        return [await fetchAndFormatSlots(session)];
    }
    return ['🤔 Escolha um local válido (1 a 3).'];
}

async function handlePickSlot(session, text) {
    const num = extractNumber(text);
    if (!session.data.availableSlots) return [await fetchAndFormatSlots(session)];
    const slots = session.data.availableSlots;

    if (slots.length === 0) {
        if (num === 1) {
            session.state = STATES.WAITING_LIST;
            // CRM: Tag provisória (confirmada no próximo passo)
            return ['📝 Digite seu *nome completo* para a lista:'];
        }
        if (num === 2) { session.state = STATES.PICK_LOCATION; return [getPickLocationMessage()]; }
        if (num === 3) { session.state = STATES.MENU; return [await getMessage('menu_principal')]; }
        return ['Opção inválida.'];
    }

    if (num && num >= 1 && num <= slots.length) {
        session.data.selectedSlot = slots[num - 1];
        session.state = STATES.COLLECT_NAME;
        return [await getMessage('agendamento_inicio') + `\n\n_Horário selecionado: ${formatDateTimeBR(slots[num - 1].start)}_`];
    }
    return ['🤔 Responda com o número do horário.'];
}

async function handleCollectName(session, text, phone) {
    const name = text.trim();
    if (name.length < 3 || /\d/.test(name)) return ['Por favor, digite seu *nome completo* (sem números).'];

    session.data.clientName = name;
    await logContact(phone, { name });
    session.state = STATES.COLLECT_BIRTHDATE;

    return [
        `Prazer, ${name.split(' ')[0]}! 🌸`,
        'Por favor, me informe sua *data de nascimento*.',
        '*(Exemplo: 25/12/1990)*'
    ];
}

async function handleCollectBirthdate(session, text, phone, sendNotification) {
    const cleanDate = text.replace(/[^0-9\/]/g, '');
    let date = dayjs(cleanDate, ['DD/MM/YYYY', 'D/M/YYYY', 'DD/MM/YY'], true);

    if (!date.isValid() && cleanDate.length === 8) {
        date = dayjs(cleanDate, 'DDMMYYYY', true);
    }

    if (!date.isValid()) {
        return ['❌ Data inválida. Por favor, digite no formato *DIA/MÊS/ANO* (Ex: 10/05/1995).'];
    }

    if (date.year() < 1920 || date.year() > dayjs().year()) {
        return ['❌ O ano parece incorreto. Por favor, verifique e digite novamente.'];
    }

    const birthDateISO = date.format('YYYY-MM-DD');
    const birthDateBR = date.format('DD/MM/YYYY');
    session.data.clientBirthDate = birthDateBR;

    await logContact(phone, { birth_date: birthDateISO });

    const age = calculateAge(birthDateISO);
    const service = KNOWLEDGE.services[session.data.selectedService];

    if (age < 18 && service.id !== 'premium') {
        if (sendNotification) {
            await sendNotification(`⚠️ *ALERTA: Menor de Idade tentando agendar!*\n\n👤 *Nome:* ${session.data.clientName}\n🎂 *Nascimento:* ${birthDateBR} (${age} anos)\n📋 *Serviço:* ${service.name}\n📱 *WhatsApp:* ${phone}\n\n_O bot bloqueou o agendamento automático e avisou que você entrará em contato._`);
        }
        session.state = STATES.HUMAN;
        return [[
            '⚠️ *Atenção:* Como você é menor de idade, preciso da autorização e acompanhamento de um responsável.',
            '',
            'Encaminhei sua solicitação para a *Gabriela Kevelyn*. Ela entrará em contato em breve para alinhar os próximos passos. ✨',
            '',
            '_Aguarde o contato._'
        ]];
    }

    session.state = STATES.CONFIRM;
    const location = KNOWLEDGE.locations[session.data.selectedLocation].name;
    const slot = session.data.selectedSlot;

    // FASE 1: Se for kevelyn_studio, muda o texto, se for particular, mostra preço
    const priceText = service.price ? `💰 *Valor:* R$ ${service.price},00` : '';

    return [[
        '📝 *Confira os dados do agendamento:*',
        '',
        `👤 *Nome:* ${session.data.clientName}`,
        `📋 *Serviço:* ${service.name}`,
        `📍 *Local:* ${location}`,
        `📅 *Data/Hora:* ${formatDateTimeBR(slot.start)}`,
        priceText,
        '',
        'Está tudo correto?',
        '1️⃣ Sim, confirmar',
        '2️⃣ Não, alterar algo'
    ].join('\n')];
}

module.exports = {
    getPickServiceMessage,
    getPickLocationMessage,
    fetchAndFormatSlots,
    handlePickService,
    handlePickLocation,
    handlePickSlot,
    handleCollectName,
    handleCollectBirthdate
};








