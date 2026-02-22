const { extractNumber, parseConfirmation, formatDateTimeBR } = require('../utils');
const { getMessage } = require('../messages');
const { STATES } = require('../constants');
const KNOWLEDGE = require('../knowledge');
const { bookAppointment, addToWaitingList, confirmAppointment, cancelAppointment } = require('../calendar');
const { logAppointment } = require('../logger');
const { addTag } = require('../crm');

async function handleConfirm(session, text, phone, sendNotification) {
    const num = extractNumber(text);
    const lower = text.toLowerCase().trim();

    if (num === 1 || parseConfirmation(text) === true || lower.includes('sim')) {
        const slot = session.data.selectedSlot;
        const service = KNOWLEDGE.services[session.data.selectedService];
        const location = KNOWLEDGE.locations[session.data.selectedLocation];

        session.state = STATES.BOOKED;

        // Tentar agendar no Google Calendar
        const eventLink = await bookAppointment(
            slot,
            service,
            location,
            session.data.patientName,
            phone,
            session.data.patientBirthDate
        );

        if (eventLink) {
            // CRM: Marcar como Cliente e STATUS AGENDADO
            const { addTag, updateStatus } = require('../crm');
            await addTag(phone, 'Cliente'); // Tag existente (Label)
            await updateStatus(phone, 'scheduled'); // Status do Funil (Coluna status)

            await logAppointment(phone, session.data.patientName, service.name, location.name, formatDateTimeBR(slot.start));

            if (sendNotification) {
                await sendNotification(`📅 *Novo Agendamento!*\n\n👤 ${session.data.patientName}\n📱 ${phone}\n📋 ${service.name}\n📍 ${location.name}\n🕒 ${formatDateTimeBR(slot.start)}\n🔗 [Ver no Agenda](${eventLink})`);
            }

            // ─── FASE 26: Recorrência Smart Upsell ───
            const { checkConsecutiveSlots } = require('../calendar');
            // Verifica próximas 3 semanas
            const futureSlots = await checkConsecutiveSlots(slot, 3);

            if (futureSlots && futureSlots.length > 0) {
                session.data.futureSlots = futureSlots;
                session.state = STATES.RECURRENCE_OFFER;

                const nextDates = futureSlots.map(s => formatDateTimeBR(s.start).split(' às ')[0]).join(', ');

                return [
                    await getMessage('agendamento_sucesso'), // "Agendamento confirmado!"
                    '',
                    '💡 *Dica Exclusiva:*',
                    `Percebi que este horário está livre nas próximas semanas: *${nextDates}*.`,
                    '',
                    'Gostaria de já deixar *fixo para o mês todo*? (Garante sua vaga e facilita o pagamento)',
                    '',
                    '1️⃣ Sim, quero garantir',
                    '2️⃣ Não, apenas hoje'
                ];
            }
            // ──────────────────────────────────────────

            // GERAÇÃO DO PIX (Fase 16 & 24) - Código Original continua abaixo caso não tenha upsell
            const { generatePixPayload } = require('../utils/pix');
            const qrcodeImage = require('qrcode'); // Importar lib de imagem
            const { MessageMedia } = require('whatsapp-web.js'); // Para enviar imagem

            // ... (Resto do código de pagamento original igual)
            const price = service.price || 0;
            const pixPayload = generatePixPayload(
                KNOWLEDGE.professional.pixKey,
                KNOWLEDGE.professional.pixName,
                KNOWLEDGE.professional.pixCity,
                price,
                `Agendamento ${session.data.patientName.split(' ')[0]}`
            );

            // Gerar Imagem do QR Code Base64
            let qrMedia = null;
            try {
                const qrBase64 = await qrcodeImage.toDataURL(pixPayload);
                qrMedia = new MessageMedia('image/png', qrBase64.split(',')[1], 'pix_qrcode.png');
            } catch (e) {
                console.error('Erro ao gerar imagem do QR Code:', e);
            }

            // Msg de sucesso
            const successMsg = await getMessage('agendamento_sucesso');

            // Link do Meet (se houver)
            let meetInfo = '';
            if (eventLink && (eventLink.hangoutLink || eventLink.htmlLink)) {
                // Preferência pelo link do Meet (hangoutLink)
                const link = eventLink.hangoutLink || eventLink.htmlLink;
                meetInfo = `\n📹 *Link da Videochamada:* ${link}`;
            }

            // Instruções de Pagamento
            const instructions = [
                '💳 *Pagamento via Pix*',
                '',
                `Valor: *R$ ${price.toFixed(2)}*`,
                'Caso prefira, use o código "Copia e Cola" abaixo:',
            ];

            // Opçõa de chave direta (CNPJ/Email/Telefone)
            const fallbackKey = [
                '',
                'Ou se preferir, use a chave Pix direta:',
                `🔑 *${KNOWLEDGE.professional.pixKey}*`,
                '',
                '_Após o pagamento, envie o comprovante por aqui. A validação é manual._ 🌸'
            ];

            session.state = STATES.MENU; // Volta pro menu
            session.data = {}; // Limpa dados

            const finalResponses = [
                `${successMsg}\n${meetInfo}`,
                ''
            ];

            // Enviar Imagem do QR Code se gerada
            if (qrMedia) {
                finalResponses.push(qrMedia);
            }

            finalResponses.push(...instructions);

            // Enviar o Payload SEM formatação de código (backticks) para facilitar o "SÓ COPIAR"
            finalResponses.push(pixPayload);

            finalResponses.push(...fallbackKey);
            finalResponses.push('Te aguardo! 🌸');

            return finalResponses;
        } else {
            return ['⚠️ Ocorreu um erro ao conectar com a agenda. Tente novamente em alguns instantes.'];
        }
    }

    if (num === 2 || parseConfirmation(text) === false || lower.includes('não')) {
        session.state = STATES.PICK_SLOT;
        // Precisamos re-enviar os slots, mas o handlePickSlot espera input.
        // O ideal é mandar a lista de horário de novo.
        // Como o bookingHandler exporta fetchAndFormatSlots, podemos usar...
        // Mas para simplificar, setamos o estado e pedimos para escolher.
        return ['Certo, vamos rever o horário. Escolha uma nova opção:', /* chamar fetchAndFormatSlots se possível */];
        // Nota: fluxo cruzado, melhor retornar msg simples.
    }

    return ['🤔 Responda com *1* (Sim) ou *2* (Não).'];
}

async function handleWaitingList(session, text, phone, sendNotification) {
    const name = text.trim();
    if (name.length < 3) return ['Por favor, digite seu *nome completo* para entrar na lista.'];

    await addToWaitingList(name, phone, session.data.selectedLocation, session.data.selectedService);

    // CRM: Tag LISTA_ESPERA
    await addTag(phone, 'LISTA_ESPERA');

    if (sendNotification) {
        await sendNotification(`📝 *Nova Lista de Espera*\n👤 ${name}\n📱 ${phone}`);
    }

    session.state = STATES.MENU;
    session.data = {};
    return [
        '✅ *Pronto!* Você está na lista de espera.',
        'Assim que liberar um horário, eu te aviso! 🌸',
        await getMessage('menu_principal')
    ];
}

async function handleConfirmationPending(session, text, phone, sendNotification, dependencies) {
    const { getPickServiceMessage } = dependencies;
    const num = extractNumber(text);
    const lower = text.toLowerCase().trim();
    const eventId = session.data.appointmentId;

    if (!eventId) {
        session.state = STATES.MENU;
        return ['⚠️ Não consegui localizar seu agendamento. Por favor, use o menu:', await getMessage('menu_principal')];
    }

    // 1. Confirmar
    if (num === 1 || parseConfirmation(text) === true || lower.includes('confirm') || lower.includes('sim')) {
        const success = await confirmAppointment(eventId);
        // updateSessionState seria chamado externamente ou session é ref? session é ref.
        session.state = STATES.MENU;
        session.data = {};

        if (success) {
            return ['✅ *Agendamento Confirmado!* Te aguardo no horário marcado. Até lá! 🌸'];
        } else {
            return ['⚠️ Houve um erro técnico ao confirmar, mas seu horário segue reservado.'];
        }
    }

    // 2. Reagendar / Cancelar
    if (num === 2 || lower.includes('reagendar') || lower.includes('trocar') || lower.includes('cancelar') || parseConfirmation(text) === false) {
        const cancelled = await cancelAppointment(eventId);

        if (cancelled) {
            if (sendNotification) {
                await sendNotification(`🔄 *Reagendamento Solicitado*\n\nO Cliente ${phone} solicitou reagendamento e o horário anterior foi liberado.`);
            }

            session.state = STATES.PICK_SERVICE;
            session.data = {};

            return [
                'Certo, liberei seu horário anterior.',
                '',
                await getPickServiceMessage()
            ];
        } else {
            return ['⚠️ Tive um problema ao cancelar o horário anterior. Por favor, digite 6 no menu para falar com a atendente.'];
        }
    }

    // 3. Resposta FORA DO PADRÃO (O "Loop Fix")
    if (sendNotification) {
        await sendNotification(`📝 *Resposta de Cliente* (Confirmação Pendente)\n👤 ${phone}\n💬 "${text}"\n\n_O Cliente respondeu algo diferente de Sim/Não. O bot registrou mas não encerrou a pendência._`);
    }

    return [
        await getMessage('agendamento_confirmacao_recebida')
    ];
}

module.exports = {
    handleConfirm,
    handleWaitingList,
    handleConfirmationPending
};








