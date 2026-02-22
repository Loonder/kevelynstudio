const cron = require('node-cron');
const { listTomorrowAppointments, listRecentPastAppointments, markAppointmentAsReminded, listUpcomingAppointments, markAppointmentAsReminded1h, checkWaitingListMatches } = require('./calendar');
const { STATES, checkStalledSessions, updateSessionState, isHumanTakeoverActive } = require('./conversation');
const { checkOptOut } = require('./crm');
const { getMessage } = require('./messages');
const { log } = require('./logger');
const dayjs = require('dayjs');
const supabase = require('./db');

/**
 * Inicializa o agendador de lembretes, feedbacks e aniversários.
 * @param {import('whatsapp-web.js').Client} client 
 */
function startScheduler(client) {
    log.info('⏰ Scheduler iniciado: Verificando lembretes, feedbacks e aniversários.');

    // 1. Lembretes e Feedbacks (A cada hora cheia)
    cron.schedule('0 * * * *', async () => {
        log.info('⏰ Scheduler: Executando verificações de rotina (Lembrete 24h/1h/Feedback)...');
        await checkReminders(client); // 24h antes
        await checkUpcomingReminders(client); // 1h antes
        await checkPostSessionFeedback(client);
    });

    // 3. Resumo Matinal (Todo dia às 07:00)
    cron.schedule('0 7 * * *', async () => {
        log.info('⏰ Scheduler: Enviando resumo matinal...');
        await sendDailyBriefing(client);
    });

    // 4. Recuperação de Sessão (A cada 15 min)
    cron.schedule('*/15 * * * *', async () => {
        await checkStalledSessions(client);
    });

    // 5. Lista de Espera (A cada 30 min)
    cron.schedule('*/30 * * * *', async () => {
        await processWaitingList(client);
    });

    // 6. Backup Diário (03:00 AM)
    cron.schedule('0 3 * * *', async () => {
        const { performBackup } = require('./utils/backup');
        await performBackup();
    });

    // Executar verificações iniciais (após 10s)
    setTimeout(() => {
        checkReminders(client);
        checkPostSessionFeedback(client);
        // checkBirthdays(client);
        // sendDailyBriefing(client); // Teste imediato se necessário
    }, 10000);
}

// ─── Verificações ───

async function checkUpcomingReminders(client) {
    try {
        const events = await require('./calendar').listUpcomingAppointments();
        if (events.length > 0) {
            log.info(`⏰ Scheduler: Encontrados ${events.length} agendamentos para a próxima hora.`);
        }

        for (const event of events) {
            await sendReminder1h(client, event);
        }
    } catch (err) {
        log.error('⏰ Erro ao verificar lembretes de 1h:', err);
    }
}

async function sendReminder1h(client, event) {
    const description = event.description || '';
    const phoneMatch = description.match(/(?:55)?(\d{2})9?(\d{8})/);
    let phone = '';

    if (phoneMatch) {
        const numbersOnly = description.replace(/\D/g, '');
        const possibleNumber = numbersOnly.match(/(55\d{10,11})/);
        if (possibleNumber) phone = possibleNumber[0];
        else {
            const rawMatch = description.match(/(\d{10,11})/);
            if (rawMatch) phone = '55' + rawMatch[0];
        }
    }

    if (!phone) return;

    const chatId = `${phone}@c.us`;

    // 🛑 STOP: Se humano estiver atendendo, não manda lembrete automático
    if (await isHumanTakeoverActive(phone)) {
        log.info(`⏰ Scheduler: Lembrete 1h cancelado para ${phone} (Human Takeover)`);
        return;
    }

    // 🛑 OPT-OUT Check
    if (await checkOptOut(phone)) {
        log.info(`🚫 Scheduler: Lembrete 1h cancelado para ${phone} (Opt-Out).`);
        return;
    }

    try {
        log.info(`⏰ Enviando lembrete de 1h para ${phone}`);
        const msg = await getMessage('lembrete_1h', {
            nome: event.summary.split('-')[0].trim()
        });

        await client.sendMessage(chatId, msg);

        // Marca que enviou para não repetir
        await require('./calendar').markAppointmentAsReminded1h(event.id);

    } catch (err) {
        log.error(`⏰ Falha ao enviar lembrete de 1h para ${phone}:`, err);
    }
}

async function checkReminders(client) {
    try {
        const events = await listTomorrowAppointments();
        log.info(`⏰ Scheduler: Verificando lembretes para ${events.length} agendamentos amanhã.`);
        for (const event of events) {
            await sendReminder(client, event);
        }
    } catch (err) {
        log.error('⏰ Erro ao verificar lembretes:', err);
    }
}

async function checkPostSessionFeedback(client) {
    try {
        const events = await listRecentPastAppointments();
        log.info(`🌸 Scheduler: Verificando feedbacks para ${events.length} agendamentos passados.`);
        for (const event of events) {
            await sendFeedbackMessage(client, event);
        }
    } catch (err) {
        log.error('⏰ Erro ao verificar feedbacks:', err);
    }
}

/**
 * Envia o resumo do dia para a Gabriela Kevelyn (Admin).
 */
async function sendDailyBriefing(client) {
    try {
        const appointments = await listTomorrowAppointments(true); // true = hoje
        const dateStr = dayjs().format('DD/MM');

        let msg = `🌅 *Bom dia, Gabriela!* ☕\n\n📅 *Resumo de Hoje (${dateStr}):*\n`;

        if (appointments.length === 0) {
            msg += '\n🏖️ *Agenda livre!* Nenhum atendimento agendado para hoje.';
        } else {
            msg += `\nVocê tem *${appointments.length} atendimentos* agendados:\n\n`;
            appointments.forEach(evt => {
                const time = dayjs(evt.start.dateTime).format('HH:mm');
                const patient = evt.summary.split('-')[0].trim();
                const location = evt.location || 'Online';
                msg += `⏰ *${time}* — ${patient} (${location})\n`;
            });
        }

        msg += '\n_Tenha um excelente trabalho!_ 🌸';

        const adminPhone = process.env.ADMIN_PHONE;
        const chatId = `${adminPhone}@c.us`;
        await client.sendMessage(chatId, msg);
        log.info('📤 Resumo matinal enviado com sucesso.');

    } catch (err) {
        log.error('⏰ Erro no Scheduler (Daily Briefing):', err);
    }
}

/**
 * Verifica aniversariantes no Supabase (tabela contacts, campo birth_date M/D)
 */
async function checkBirthdays(client) {
    try {
        const todayMD = dayjs().format('MM-DD'); // Formato esperado no banco

        const { data: bdays, error } = await supabase
            .from('contacts')
            .select('phone, name, birth_date')
            .not('birth_date', 'is', null);

        if (error) throw error;

        for (const contact of bdays) {
            // Verifica se M-D coincide com hoje (independente do ano)
            const contactMD = dayjs(contact.birth_date).format('MM-DD');
            if (contactMD === todayMD) {
                await sendBirthdayMessage(client, contact);
            }
        }
    } catch (err) {
        log.error('⏰ Erro no Scheduler (Birthdays):', err);
    }
}

async function sendReminder(client, event) {
    // 1. Verificar se já foi enviado (Anti-Spam)
    if (event.extendedProperties && event.extendedProperties.shared && event.extendedProperties.shared.reminded === 'true') {
        // log.info(`⏩ Lembrete já enviado para ${event.summary}. Pulando...`);
        return;
    }

    const description = event.description || '';
    // Melhorar regex para pegar apenas números que pareçam de telefone (com 55 no inicio ou validos br)
    // Regex simples mas um pouco mais restritiva para evitar sequencias gigantes de numeros
    const phoneMatch = description.match(/(?:55)?(\d{2})9?(\d{8})/);

    // Se não achar match decente, tenta o fallback antigo mas validando length < 15
    let phone = '';

    if (phoneMatch) {
        // Reconstrói numero padrao BR: 55 + DDD + 9 + 8 digitos = 13 digitos (ou 12 se antigo)
        // Mas o match acima pega grupos. Vamos simplificar:
        const numbersOnly = description.replace(/\D/g, '');
        const possibleNumber = numbersOnly.match(/(55\d{10,11})/); // 55 + 10 ou 11 digitos
        if (possibleNumber) {
            phone = possibleNumber[0];
        } else {
            // Tenta pegar sem 55
            const rawMatch = description.match(/(\d{10,11})/);
            if (rawMatch) phone = '55' + rawMatch[0];
        }
    }

    if (!phone) return; // Não achou número válido

    // Anti-LID: Sanitização
    const chatId = `${phone}@c.us`;

    // 🛑 STOP: Se humano estiver atendendo, não manda lembrete automático
    if (await isHumanTakeoverActive(phone)) {
        log.info(`⏰ Scheduler: Lembrete 24h cancelado para ${phone} (Human Takeover)`);
        return;
    }

    // 🛑 OPT-OUT Check
    if (await checkOptOut(phone)) {
        log.info(`🚫 Scheduler: Lembrete 24h cancelado para ${phone} (Opt-Out).`);
        return;
    }

    try {
        log.info(`⏰ Enviando lembrete para ${phone}`);

        // Anti-Spam: Se já está confirmado, envia apenas lembrete simples sem pedir confirmação novamente
        const isConfirmed = event.summary && event.summary.toUpperCase().includes('[CONFIRMADO]');

        let msg;
        if (isConfirmed) {
            msg = await getMessage('lembrete_24h_simples', { // Criar msg simples depois ou usar texto direto por enquanto
                nome: event.summary.split('-')[0].replace('[CONFIRMADO]', '').trim(),
                data: dayjs(event.start.dateTime).format('DD/MM'),
                hora: dayjs(event.start.dateTime).format('HH:mm')
            });
            // Fallback se n tiver a msg criada
            if (!msg) msg = `Olá, ${event.summary.split('-')[0].replace('[CONFIRMADO]', '').trim()}! 🌸\n\nLembrete: Sua atendimento é amanhã, ${dayjs(event.start.dateTime).format('DD/MM')} às ${dayjs(event.start.dateTime).format('HH:mm')}.\n\nTe aguardo!`;

        } else {
            msg = await getMessage('lembrete_24h', {
                nome: event.summary.split('-')[0].trim(),
                data: dayjs(event.start.dateTime).format('DD/MM'),
                hora: dayjs(event.start.dateTime).format('HH:mm')
            });

            msg = [
                msg,
                '',
                '1️⃣ *Confirmar*',
                '2️⃣ *Reagendar*',
                '',
                '_Responda com o número._'
            ].join('\n');
        }

        // Envio seguro
        await client.sendMessage(chatId, msg);

        // Sucesso: Marcar como enviado
        await markAppointmentAsReminded(event.id);

        // Se NÃO estava confirmado, atualiza estado para esperar confirmação
        if (!isConfirmed) {
            updateSessionState(phone, STATES.CONFIRMATION_PENDING, {
                appointmentId: event.id,
                originalDate: event.start.dateTime
            });
        }

    } catch (err) {
        // Se der erro de "No LID", significa que o número não existe no WhatsApp.
        // Devemos marcar como "lembrado" para não ficar tentando infinitamente.
        const errorMessage = err.message || '';

        if (errorMessage.includes('No LID') || errorMessage.includes('invalid') || errorMessage.includes('not registered')) {
            log.warn(`⚠️ Número inválido ou sem WhatsApp (${phone}). Marcando agendamento como processado para evitar retentativas.`);
            await markAppointmentAsReminded(event.id); // <--- IMPORTANTE: Para o loop
        } else {
            log.error(`⏰ Falha ao enviar lembrete para ${phone} (ChatID: ${chatId}):`, err);
        }
    }
}

async function sendFeedbackMessage(client, event) {
    const description = event.description || '';
    const phoneMatch = description.match(/(\d{10,13})/);
    if (!phoneMatch) return;

    let phone = phoneMatch[0];
    if (!phone.startsWith('55')) phone = '55' + phone;
    const chatId = `${phone}@c.us`;

    // 1. Verificar Anti-Spam (Já enviado?)
    if (event.extendedProperties && event.extendedProperties.shared && event.extendedProperties.shared.feedback_sent === 'true') {
        return;
    }

    // 🛑 OPT-OUT Check
    if (await checkOptOut(phone)) {
        return;
    }

    try {
        log.info(`🌸 Enviando feedback pós-sessão para ${phone}`);
        const msg = await getMessage('feedback_pos_sessao', {
            nome: event.summary.split('—')[0].replace('🟢', '').trim()
        });
        await client.sendMessage(chatId, msg);

        // 2. Marcar como enviado
        await require('./calendar').markAppointmentAsFeedbackSent(event.id);

        // 3. Atualizar Estado para esperar resposta (FEEDBACK_PENDING)
        updateSessionState(phone, 'FEEDBACK_PENDING', {
            appointmentId: event.id
        });

    } catch (err) {
        log.error(`⏰ Falha ao enviar feedback para ${phone}:`, err);
    }
}

async function sendBirthdayMessage(client, contact) {
    const chatId = `${contact.phone}@c.us`;
    try {
        log.info(`🎂 Enviando parabéns para ${contact.name} (${contact.phone})`);
        const msg = await getMessage('aniversario_parabens', {
            nome: contact.name || ''
        });
        await client.sendMessage(chatId, msg);
    } catch (err) {
        log.error(`⏰ Falha ao enviar parabéns para ${contact.phone}:`, err);
    }
}

async function processWaitingList(client) {
    try {
        log.info('📋 Scheduler: Verificando Lista de Espera...');
        const matches = await checkWaitingListMatches();

        if (matches.length > 0) {
            log.info(`📋 Encontrados ${matches.length} Clientes na fila para receber aviso de vaga.`);

            for (const { waiter, slots } of matches) {
                const chatId = `${waiter.phone}@c.us`; // Aqui usamos chatId para iniciar conversa

                const slotText = slots.map(s => `• ${dayjs(s.start).format('DD/MM (ddd) às HH:mm')}`).join('\n');

                const msg = `Olá, ${waiter.name}! 🌸\n\nBoas notícias: Surgiram vagas na agenda!\n\n${slotText}\n\nSe quiser garantir algum, corra lá no *Menu* > *Agendar* ou me avise por aqui!\nEm breve essa vaga pode ser preenchida.`;

                await client.sendMessage(chatId, msg);
                await require('./utils').delay(2000); // Delay entre envios
            }
        }
    } catch (err) {
        log.error('📋 Erro ao processar Lista de Espera:', err);
    }
}

module.exports = { startScheduler };







