const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const { log } = require('../logger');
const supabase = require('../db');

async function handleFeedbackPending(session, text, phone, sendNotification) {
    const feedback = text.trim();
    const eventId = session.data.appointmentId;
    const patientName = session.data.patientName || 'Cliente'; // Tentar recuperar se possível

    log.info(`📝 Feedback recebido de ${phone}: ${feedback}`);

    // 1. Salvar Feedback no Supabase (se tiver tabela de feedbacks ou no próprio prontuário/tabela de agendamentos)
    // Por enquanto, vamos logar e mandar notificação.
    // O ideal seria ter uma tabela 'feedbacks' ou atualizar o 'availability_slots' se tiver coluna pra isso.
    // Vamos assumir tabela 'feedbacks' ou salvar em 'medical_records' como nota.

    // Opção A: Salvar como nota no Medical Records
    /*
    await supabase.from('medical_records').insert([{
        phone: phone,
        patient_name: patientName,
        content: `[FEEDBACK AUTOMÁTICO]: ${feedback}`
    }]);
    */

    // Opção B: Apenas notificar Admin
    if (sendNotification) {
        await sendNotification(`🌟 *Novo Feedback Recebido*\n\n👤 ${phone}\n💬 "${feedback}"`);
    }

    // 2. Agradecer
    const thankYouMsg = await getMessage('feedback_agradecimento') || 'Obrigada pelo seu feedback! 🌸 Sua opinião é muito importante para mim.';

    // 3. Voltar para Menu ou encerrar
    session.state = STATES.MENU;
    session.data = {};

    return [thankYouMsg];
}

module.exports = { handleFeedbackPending };









