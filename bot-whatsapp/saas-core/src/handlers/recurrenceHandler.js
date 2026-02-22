const { getMessage } = require('../messages');
const { STATES } = require('../constants'); // Vai precisar adicionar RECURRENCE_OFFER lá
const { bookBatch } = require('../calendar');
const { formatDateTimeBR } = require('../utils');
const { addTag, updateStatus } = require('../crm');
const KNOWLEDGE = require('../knowledge');

async function handleRecurrenceOffer(session, text, phone, sendNotification) {
    const lower = text.toLowerCase().trim();
    const isYes = ['sim', 'quero', 'pode', 'aceito', 'claro', '1'].some(k => lower.includes(k));
    const isNo = ['nao', 'não', 'obrigado', 'depois', '2'].some(k => lower.includes(k));

    if (isYes) {
        // 1. Agendar em Lote
        const futureSlots = session.data.futureSlots || [];
        if (futureSlots.length === 0) {
            session.state = STATES.MENU;
            return ['⚠️ Ocorreu um erro ao recuperar os horários. Fique tranquilo, seu primeiro agendamento está garantido! 🌸'];
        }

        const patientName = session.data.patientName;
        const service = KNOWLEDGE.services[session.data.selectedService];

        // Avisar que está processando...
        if (sendNotification) { // Hack: usando sendNotification como "log" ou aviso interno
            // Não temos como mandar msg intermediária fácil aqui sem refatorar o processMessage
        }

        const bookingResults = await bookBatch(futureSlots, patientName, phone, service);

        const successCount = bookingResults.filter(r => r.success).length;

        // CRM: Tag RECORRENTE
        await addTag(phone, 'RECORRENTE');

        // Calcular novo total
        // Preço unitário * (1 (já agendado) + successCount)
        const unitPrice = service.price || 0;
        const totalSessions = 1 + successCount;
        const totalPrice = unitPrice * totalSessions;

        // Formatar datas
        const dates = bookingResults.filter(r => r.success).map(r => formatDateTimeBR(r.date).split(' às ')[0]);

        session.state = STATES.MENU;
        session.data = {}; // Limpa sessao

        // Payload Pix atualizado
        const { generatePixPayload } = require('../utils/pix');
        const pixPayload = generatePixPayload(
            KNOWLEDGE.professional.pixKey,
            KNOWLEDGE.professional.pixName,
            KNOWLEDGE.professional.pixCity,
            totalPrice,
            `Pacote ${patientName.split(' ')[0]}`
        );

        return [
            `🎉 *Maravilha!* Agendei mais *${successCount} sessões* para você.`,
            '',
            `🗓️ *Datas garantidas:*`,
            `• (Hoje) Agendado`,
            ...dates.map(d => `• ${d}`),
            '',
            `💰 *Valor Total do Pacote (${totalSessions} sessões):* R$ ${totalPrice.toFixed(2)}`,
            '',
            'Aqui está o código Pix atualizado para o pacote completo:',
            pixPayload,
            '',
            'Te aguardo! 🌸'
        ];
    }

    if (isNo) {
        session.state = STATES.MENU;
        session.data = {};
        return [
            'Sem problemas! 😉',
            'Seu horário individual está garantido.',
            'Se mudar de ideia depois, é só me avisar. Até lá! 🌸'
        ];
    }

    return ['🤔 Não entendi. Responda com *Sim* (para fechar o mês) ou *Não* (apenas uma sessão).'];
}

module.exports = { handleRecurrenceOffer };








