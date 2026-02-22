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
    const iskevelyn_studio = session.data && session.data.platform === 'kevelyn_studio';
    const lines = ['📅 *Vamos agendar seu momento de beleza!*', '', 'Qual procedimento você busca?', ''];

    const servicesToShow = KNOWLEDGE.services;

    servicesToShow.forEach((svc, i) => {
        lines.push(`${i + 1}️⃣ ${svc.emoji} ${svc.name}${svc.price ? ` (R$ ${svc.price},00)` : ''}`);
    });

    lines.push('', '5️⃣ 🤔 Não sei ainda — me ajude a escolher');

    lines.push('', '_Responda com o número._');
    return lines.join('\n');
}

// Função auxiliar para verificar restrição de local
function getAvailableLocations(serviceId) {
    return KNOWLEDGE.locations;
}

function getPickLocationMessage(service) {
    const available = getAvailableLocations(service ? service.id : null);
    const lines = [' *Onde você prefere ser atendido(a)?*', ''];

    if (service && service.id === 'geral') {
        lines.push('_(⚠️ procedimento geral requer atendimento presencial)_');
        lines.push('');
    }

    available.forEach((loc, i) => {
        lines.push(`${i + 1}️⃣ ${loc.emoji} *${loc.name}*`);
    });

    return lines.join('\n');
}

async function fetchAndFormatSlots(session) {
    const locIndex = session.data.selectedLocation;
    // ... (rest of function unchanged, just ensuring references are correct)
    if (locIndex === undefined || !KNOWLEDGE.locations[locIndex]) {
        log.error(`❌ Erro em fetchAndFormatSlots: Local inválido (index: ${locIndex})`);
        // ...
        return '😔 Ocorreu um erro ao identificar o local. Por favor, digite "menu" e tente novamente.';
    }

    const locationId = KNOWLEDGE.locations[locIndex].id;
    const platform = session.data.platform;

    const slots = await getAvailableSlots(locationId, 14, platform);
    session.data.availableSlots = slots;

    if (slots.length === 0) {
        return [
            platform === 'kevelyn_studio'
                ? '😔 *Poxa, sem horários kevelyn_studio disponiveis.*'
                : '😔 *Poxa, sem horários esta semana.*',
            '1️⃣ Entrar na Lista de Espera',
            '2️⃣ Tentar outro local',
            '3️⃣ Voltar ao menu',
        ].join('\n');
    }
    return formatSlotsForWhatsApp(slots);
}

async function handlePickService(session, text) {
    const iskevelyn_studio = session.data && session.data.platform === 'kevelyn_studio';
    const num = extractNumber(text);

    const servicesList = KNOWLEDGE.services.filter(s => {
        if (iskevelyn_studio) return ['kevelyn_studio', 'Lash Design', 'estetica_avancada', 'geral', 'premium'].includes(s.id);
        return ['Lash Design', 'estetica_avancada', 'geral', 'premium'].includes(s.id);
    });

    if (num === 5) {
        return [[
            '💡 *Sem problemas!* Vou te dar uma luz:',
            '',
            '• *Lash Design:* Extensões que realçam a beleza do olhar.',
            '• *Design Estratégico:* Sobrancelhas desenhadas com visagismo.',
            '• *Limpeza de Pele Elite:* Procedimento de cuidado facial profundo.',
            '• *Consultoria Visagista:* Análise da simetria para o design ideal.',
            '',
            'Qual dessas faz mais sentido para você? Responda com o número (1 a 4).',
        ].join('\n')];
    }

    if (num && num >= 1 && num <= KNOWLEDGE.services.length) {
        const selected = KNOWLEDGE.services[num - 1];
        session.data.selectedService = num - 1;

        if (iskevelyn_studio && selected.id !== 'kevelyn_studio') {
            session.data.platform = null;
            session.state = STATES.PICK_LOCATION; // FIX: Atualizar estado
            return [
                'Excelente decisão! 🌸 Cuidar de você é o melhor investimento.',
                '',
                getPickLocationMessage(selected)
            ];
        }

        if (iskevelyn_studio && selected.id === 'kevelyn_studio') {
            // kevelyn_studio sempre online (ou conforme regra)
            const onlineIndex = KNOWLEDGE.locations.findIndex(l => l.id === 'online');
            if (onlineIndex !== -1) {
                session.data.selectedLocation = onlineIndex;
                session.state = STATES.PICK_SLOT;
                return [await fetchAndFormatSlots(session)];
            }
        }

        if (session.data.websiteBooking) {
            // ... (existing website booking logic)
            const wb = session.data.websiteBooking;
            const locLow = wb.location.toLowerCase();
            let locIdx = 2; // Default Online
            if (locLow.includes('itapecerica')) locIdx = 0;
            if (locLow.includes('taboão') || locLow.includes('taboao')) locIdx = 1;

            session.data.selectedLocation = locIdx;

            session.data.selectedSlot = {
                start: wb.dateTime,
                location: KNOWLEDGE.locations[locIdx].id
            };

            session.state = STATES.COLLECT_NAME;
            return [
                `Ótima escolha! 🌸 Para agendarmos sua sessão de *${selected.name}*, por favor me diga seu *nome completo*:`,
            ];
        }

        session.state = STATES.PICK_LOCATION;
        return [getPickLocationMessage(selected)];
    }
    return ['🤔 Escolha uma opção de 1 a 5.'];
}

async function handlePickLocation(session, text) {
    const num = extractNumber(text);
    const serviceIndex = session.data.selectedService;
    const service = serviceIndex !== undefined ? KNOWLEDGE.services[serviceIndex] : null;

    const available = getAvailableLocations(service ? service.id : null);

    if (num && num >= 1 && num <= available.length) {
        // Mapear a escolha (1 ou 2) para o índice REAL em KNOWLEDGE.locations
        const selectedLoc = available[num - 1];
        const realIndex = KNOWLEDGE.locations.findIndex(l => l.id === selectedLoc.id);

        session.data.selectedLocation = realIndex;
        session.state = STATES.PICK_SLOT;
        return [await fetchAndFormatSlots(session)];
    }
    return ['🤔 Escolha uma opção válida.'];
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

    session.data.patientName = name;
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
    session.data.patientBirthDate = birthDateBR;

    await logContact(phone, { birth_date: birthDateISO });

    const age = calculateAge(birthDateISO);
    const service = KNOWLEDGE.services[session.data.selectedService];

    if (age < 18 && service.id !== 'premium') {
        if (sendNotification) {
            await sendNotification(`⚠️ *ALERTA: Menor de Idade tentando agendar!*\n\n👤 *Nome:* ${session.data.patientName}\n🎂 *Nascimento:* ${birthDateBR} (${age} anos)\n📋 *Serviço:* ${service.name}\n📱 *WhatsApp:* ${phone}\n\n_O bot bloqueou o agendamento automático e avisou que você entrará em contato._`);
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
        `👤 *Nome:* ${session.data.patientName}`,
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






