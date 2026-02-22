// =====================================================
// GOOGLE CALENDAR — Integração para agendamento
// Leitura de slots e criação de agendamentos
// =====================================================

const { google } = require('googleapis');
const dayjs = require('dayjs');
// IMPORTANTE: Plugins para lidar corretamente com Timezone
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const { log } = require('./logger');
const { formatDateTimeBR } = require('./utils');
const KNOWLEDGE = require('./knowledge');
const supabase = require('./db'); // Supabase para Feriados e Lista de Espera

let calendar = null;
let calendarId = 'primary';


/**
 * Inicializa a conexão com o Google Calendar.
 * Usa Service Account para autenticação servidor-a-servidor.
 */
async function initCalendar() {
    try {
        const credPath = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json';
        calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

        const auth = new google.auth.GoogleAuth({
            keyFile: credPath,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const authClient = await auth.getClient();
        calendar = google.calendar({ version: 'v3', auth: authClient });

        log.info('✅ Google Calendar conectado com sucesso');
        return true;
    } catch (err) {
        log.error('❌ Erro ao conectar Google Calendar', { error: err.message });
        return false;
    }
}

/**
 * Busca feriados cadastrados no banco.
 */
async function getHolidays() {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .select('date');

        if (error) throw error;

        return (data || []).map(h => h.date); // Retorna array de strings 'YYYY-MM-DD'
    } catch (err) {
        log.error('Erro ao buscar feriados', { error: err.message });
        return [];
    }
}

/**
 * Busca slots disponíveis (eventos com título "Disponível") no calendário.
 * Filtra automaticamente dias que são feriados.
 * @param {string} locationFilter - Filtro por local (itapecerica, taboao, online, ou null para todos)
 * @param {number} daysAhead - Quantos dias à frente buscar (default: 14)
 * @param {string} platform - 'kevelyn_studio' ou null
 * @returns {Array} Lista de slots formatados
 */
async function getAvailableSlots(locationFilter = null, daysAhead = 14, platform = null) {
    if (!calendar) {
        log.warn('Google Calendar não inicializado');
        return [];
    }

    try {
        const now = dayjs();
        const end = now.add(daysAhead, 'day');

        // Buscar feriados em paralelo
        const holidays = await getHolidays();

        // Se for kevelyn_studio, o padrão é buscar 'Disponível kevelyn_studio'
        const searchKeyword = platform === 'kevelyn_studio' ? 'kevelyn_studio' : 'Disponível';

        const response = await calendar.events.list({
            calendarId,
            timeMin: now.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            q: searchKeyword,
        });

        let slots = (response.data.items || [])
            .filter(event => {
                const title = (event.summary || '').toLowerCase();

                // Isolamento: Se NÃO for kevelyn_studio, ignora slots marcados com kevelyn_studio
                if (platform !== 'kevelyn_studio' && title.includes('kevelyn_studio')) return false;

                if (!title.includes('disponível') && !title.includes('disponivel') && !title.includes('kevelyn_studio')) {
                    return false;
                }

                // Verificar se é feriado
                const eventDate = dayjs(event.start.dateTime || event.start.date).format('YYYY-MM-DD');
                if (holidays.includes(eventDate)) {
                    return false; // Ignora slots em feriados
                }

                return true;
            })
            .map(event => ({
                id: event.id,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                location: extractLocationFromEvent(event),
                summary: event.summary,
            }));

        // Filtrar por local se especificado
        if (locationFilter) {
            const filterNorm = normalizeLocation(locationFilter);
            slots = slots.filter(s => s.location === filterNorm);
        }

        return slots;
    } catch (err) {
        log.error('Erro ao buscar slots', { error: err.message });
        return [];
    }
}

/**
 * Adiciona um Cliente à lista de espera no Supabase.
 */
async function addToWaitingList(phone, name, serviceName) {
    try {
        const { error } = await supabase
            .from('waiting_list')
            .insert([{ phone, name, service_interest: serviceName }]);

        if (error) {
            log.error('Erro ao adicionar à lista de espera:', error);
            return false;
        }
        return true;
    } catch (err) {
        log.error('Erro ao adicionar à lista de espera:', err);
        return false;
    }
}

// ─── FASE 3: CONFIRMAÇÃO & REAGENDAMENTO ───

/**
 * Lista agendamentos que começam no dia seguinte (entre 24h e 48h a partir de agora)
 * Útil para o Scheduler de lembretes.
 */
async function listTomorrowAppointments(includeToday = false) {
    try {
        // Re-authenticate for each call to ensure fresh token if needed, or use a global auth client
        // For this example, assuming `calendar` global object is already authenticated via `initCalendar`
        // If `authorize` is a separate function that returns an auth client, it should be defined elsewhere.
        // For now, we'll use the global `calendar` object's auth.
        if (!calendar) {
            log.warn('Google Calendar não inicializado para listar agendamentos');
            return [];
        }

        const now = dayjs();
        let start, end;

        if (includeToday) {
            start = now.startOf('day');
            end = now.endOf('day');
        } else {
            start = now.add(1, 'day').startOf('day');
            end = now.add(1, 'day').endOf('day');
        }

        const res = await calendar.events.list({
            calendarId: calendarId, // Use the global calendarId
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items || [];

        // Filtrar apenas agendamentos reais (não slots disponíveis ou feriados)
        return events.filter(e => {
            const summary = e.summary || '';
            return !summary.toLowerCase().includes('disponível') && !summary.toLowerCase().includes('bloqueado') && !summary.toLowerCase().includes('feriado');
        });

    } catch (err) {
        log.error('Erro ao listar agendamentos de amanhã:', err);
        return [];
    }
}

/**
 * Lista agendamentos que terminaram recentemente (entre 1h e 3h atrás)
 * Útil para o envio de feedback pós-sessão.
 */
async function listRecentPastAppointments() {
    try {
        if (!calendar) return [];

        const now = dayjs();
        const start = now.subtract(3, 'hour').toISOString();
        const end = now.subtract(1, 'hour').toISOString();

        const res = await calendar.events.list({
            calendarId: calendarId,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items || [];

        return events.filter(e => {
            const summary = e.summary || '';
            return !summary.toLowerCase().includes('disponível') && !summary.toLowerCase().includes('bloqueado') && !summary.toLowerCase().includes('feriado');
        });

    } catch (err) {
        log.error('Erro ao listar agendamentos passados:', err);
        return [];
    }
}

/**
 * Confirma o agendamento alterando a cor para verde (ColorId: 10 ou 2 - Sage/Basil)
 * E adiciona [CONFIRMADO] no título.
 */
async function confirmAppointment(eventId) {
    if (!calendar) {
        log.warn('Google Calendar não inicializado para confirmar agendamento');
        return false;
    }

    try {
        // Primeiro, obter o evento para não perder dados
        const getRes = await calendar.events.get({
            calendarId: calendarId, // Use the global calendarId
            eventId: eventId,
        });

        const event = getRes.data;
        let summary = event.summary;

        if (!summary.includes('[CONFIRMADO]')) {
            summary = `[CONFIRMADO] ${summary}`;
        }

        await calendar.events.patch({
            calendarId: calendarId, // Use the global calendarId
            eventId: eventId,
            requestBody: {
                colorId: '2', // Sage (Verde claro)
                summary: summary
            }
        });

        log.info(`Agendamento confirmado: ${eventId}`);
        return true;
    } catch (err) {
        log.error(`Erro ao confirmar agendamento ${eventId}:`, err);
        return false;
    }
}

/**
 * Cancela o agendamento (Exclui o evento).
 * Para reagendamento, primeiro cancelamos e depois o fluxo normal cria um novo.
 */
async function cancelAppointment(eventId) {
    if (!calendar) {
        log.warn('Google Calendar não inicializado para cancelar agendamento');
        return false;
    }

    try {
        await calendar.events.delete({
            calendarId: calendarId, // Use the global calendarId
            eventId: eventId,
        });

        log.info(`Agendamento cancelado/excluído: ${eventId}`);
        return true;
    } catch (err) {
        log.error(`Erro ao cancelar agendamento ${eventId}:`, err);
        return false;
    }
}

/**
 * Agenda uma atendimento — remove o slot disponível e cria o evento da sessão.
 * @param {object} slot - Slot selecionado
 * @param {string} patientName - Nome do Cliente
 * @param {string} patientPhone - Telefone do Cliente
 * @param {object} service - Serviço escolhido (de knowledge.js)
 * @returns {object|null} Evento criado ou null em caso de erro
 */
async function bookAppointment(slot, patientName, patientPhone, service) {
    if (!calendar) return null;

    try {
        // 1. Tenta remover o slot "Disponível" ANTES de criar o novo
        // Se falhar a remoção, abortamos para evitar Double Booking
        let slotRemoved = false;

        if (slot.id) {
            try {
                await calendar.events.delete({
                    calendarId,
                    eventId: slot.id,
                });
                slotRemoved = true;
                log.info(`🧹 Slot removido por ID: ${slot.id}`);
            } catch (err) {
                log.error(`❌ Erro ao remover slot por ID ${slot.id}. Provavelmente já agendado.`, err.message);
                return null; // ABORTA: Já deve ter sido agendado por outro
            }
        } else {
            // FALLBACK: Se não tem ID (vindo do site), procura o evento pelo horário e deleta
            try {
                // Busca eventos considerando que slot.start já veio como ISO com offset (da utils.js)
                // Usamos dayjs(slot.start) direto para preservar o ponto exato no tempo
                const searchStart = dayjs(slot.start).subtract(15, 'minute').toISOString();
                const searchEnd = dayjs(slot.start).add(15, 'minute').toISOString();

                const eventsAtTime = await calendar.events.list({
                    calendarId,
                    timeMin: searchStart,
                    timeMax: searchEnd,
                    singleEvents: true
                });

                const slotsToDelete = (eventsAtTime.data.items || []).filter(e => {
                    const title = (e.summary || '').toLowerCase();
                    // Filtra por título
                    if (!title.includes('disponível') && !title.includes('disponivel') && !title.includes('kevelyn_studio')) return false;

                    // CHECK CRÍTICO: Verifica se o evento REALMENTE começa no horário do agendamento
                    // Isso evita deletar o slot anterior que termina neste horário (ex: 12:00-13:00 quando agendo 13:00)
                    const eventStart = dayjs(e.start.dateTime || e.start.date);
                    const targetStart = dayjs(slot.start);
                    const diff = Math.abs(eventStart.diff(targetStart, 'minute'));

                    return diff <= 5; // Aceita até 5 min de diferença no início
                });

                if (slotsToDelete.length > 0) {
                    for (const s of slotsToDelete) {
                        await calendar.events.delete({
                            calendarId,
                            eventId: s.id,
                        });
                        log.info(`🧹 Slot removido por busca: ${s.id}`);
                    }
                    slotRemoved = true;
                } else {
                    log.warn(`⚠️ Nenhum slot disponível encontrado na janela para: ${slot.start}`);
                    return null;
                }

            } catch (err) {
                log.error('Erro crítico ao tentar remover slot sem ID', err);
                return null;
            }
        }

        if (!slotRemoved) return null;

        // 2. Cria o evento da atendimento (Apenas se a remoção acima deu certo)

        const locationObj = KNOWLEDGE.locations.find(l => l.id === slot.location);
        const priceStr = service.price ? ` — R$ ${service.price},00` : '';

        // Calcular horário de término se não existir (caso do site/instagram)
        const durationMatch = (service.duration || '').match(/(\d+)/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 50;

        // FIX DE TIMEZONE (Final):
        // Usamos dayjs(slot.start).tz(...) para garantir que o horário nominal seja preservado
        const startDateTime = dayjs(slot.start).tz('America/Sao_Paulo').format();
        const endDateTime = slot.end || dayjs(startDateTime).add(durationMinutes, 'minute').format();


        // Buffer de 15 min (opcional, aqui estamos apenas criando o evento no horário exato do slot)
        // Se quiséssemos buffer, teríamos que ajustar o 'end' time ou garantir que o slot já tenha o buffer.
        // Assumindo que o slot criado já reflete o tempo real de atendimento.

        let newEvent;

        // Lógica de Link do Google Meet (Dinâmico vs Estático)
        let description = [
            `👤 Cliente: ${patientName}`,
            `📱 WhatsApp: ${patientPhone}`,
            `📋 Serviço: ${service.name}${priceStr}`,
            `⏱️ Duração: ${service.duration}`,
            `📍 Local: ${locationObj ? locationObj.name : slot.location}`,
            '',
            '— Agendado pela Secretária Online',
        ];

        // Se houver link estático (Sala de Espera) e for Online, adiciona na descrição
        const staticLink = process.env.MEET_STATIC_LINK;
        // Verifica se é online (pelo ID do local 'online' ou nome contendo Online)
        const isOnline = (slot.location === 'online' || (locationObj && locationObj.id === 'online') || (service.id === 'online'));

        if (staticLink && isOnline) {
            description.push('');
            description.push(`📹 Sala de Espera Virtual: ${staticLink}`);
        }

        try {
            // Criação do evento COM Google Meet
            const uuidv4 = require('uuid').v4;

            newEvent = await calendar.events.insert({
                calendarId,
                conferenceDataVersion: 1, // Necessário para gerar o link (Query Param)
                requestBody: {
                    summary: `Atendimento ${patientName} — ${service.name}`,
                    description: description.join('\n'),
                    location: locationObj ? locationObj.address : '',
                    start: { dateTime: startDateTime, timeZone: 'America/Sao_Paulo' },
                    end: { dateTime: endDateTime, timeZone: 'America/Sao_Paulo' },
                    colorId: '10', // Basil (Verde escuro)
                    conferenceData: {
                        createRequest: {
                            requestId: uuidv4(), // ID único
                            conferenceSolutionKey: { type: 'hangoutsMeet' },
                        },
                    },
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'popup', minutes: 60 },
                            { method: 'popup', minutes: 1440 },
                        ],
                    }
                },
            });

        } catch (err) {
            log.warn('⚠️ Falha ao criar evento com Meet. Tentando sem Meet...', err.message);

            // Tentativa 2: Sem Google Meet (Fallback para não perder o agendamento)
            newEvent = await calendar.events.insert({
                calendarId,
                requestBody: {
                    summary: `Atendimento ${patientName} — ${service.name}`,
                    description: [
                        `👤 Cliente: ${patientName}`,
                        `📱 WhatsApp: ${patientPhone}`,
                        `📋 Serviço: ${service.name}${priceStr}`,
                        `⏱️ Duração: ${service.duration}`,
                        `📍 Local: ${locationObj ? locationObj.name : slot.location}`,
                        '',
                        '— Agendado pela Secretária Online (Sem Meet)',
                    ].join('\n'),
                    location: locationObj ? locationObj.address : '',
                    start: { dateTime: startDateTime, timeZone: 'America/Sao_Paulo' },
                    end: { dateTime: endDateTime, timeZone: 'America/Sao_Paulo' },
                    colorId: '10',
                },
            });
        }

        log.info(`✅ Agendamento criado com sucesso!`);
        log.info(`   ID: ${newEvent.data.id}`);
        log.info(`   Link (View): ${newEvent.data.htmlLink}`);
        log.info(`   Link (Meet): ${newEvent.data.hangoutLink}`); // Important log
        log.info(`   Start: ${newEvent.data.start.dateTime}`);
        log.info(`   End: ${newEvent.data.end.dateTime}`);

        return newEvent.data;
    } catch (err) {
        log.error('Erro ao criar agendamento', { error: err.message });
        return null;
    }
}

/**
 * Agendamento em Lote (Recorrência).
 * Tenta agendar múltiplos slots de uma vez.
 */
async function bookBatch(slots, patientName, patientPhone, service) {
    const results = [];
    for (const slot of slots) {
        // Pequeno delay para não bater rate limit
        await new Promise(r => setTimeout(r, 500));
        const res = await bookAppointment(slot, patientName, patientPhone, service);
        results.push({ date: slot.start, success: !!res });
    }
    return results;
}

/**
 * Verifica se o mesmo horário está disponível nas próximas semanas (Recorrência).
 * @param {object} baseSlot - Slot agendado original { start: iso, location: id }
 * @param {number} weeksToCheck - Quantas semanas verificar (default: 3)
 * @returns {Array} Lista de slots futuros disponíveis (ou vazio)
 */
async function checkConsecutiveSlots(baseSlot, weeksToCheck = 3) {
    if (!calendar || !baseSlot) return [];

    try {
        const slotsFound = [];
        const baseDate = dayjs(baseSlot.start);
        const locationId = baseSlot.location; // ID do local (ex: 'itapecerica')

        // Loop para checar próxima semana, depois a outra...
        for (let i = 1; i <= weeksToCheck; i++) {
            const nextDate = baseDate.add(i, 'week');

            // Ignora se for Feriado
            const holidays = await getHolidays();
            if (holidays.includes(nextDate.format('YYYY-MM-DD'))) continue;

            // Busca slots nesse dia específico
            // startTime e endTime baseados no slot original para restringir a busca
            // Pequena margem de erro (ex: busca entre X-15min e X+15min)
            const searchStart = nextDate.subtract(10, 'minute').toISOString();
            const searchEnd = nextDate.add(10, 'minute').toISOString();

            const res = await calendar.events.list({
                calendarId,
                timeMin: searchStart,
                timeMax: searchEnd,
                singleEvents: true,
                q: 'Disponível' // Busca genérica primeiro
            });

            const events = res.data.items || [];

            // Filtra manualmente
            const match = events.find(e => {
                const title = (e.summary || '').toLowerCase();
                // Deve ser "Disponível" OU "kevelyn_studio" (se for o caso)
                if (!title.includes('disponível') && !title.includes('disponivel') && !title.includes('kevelyn_studio')) return false;

                // Deve ser do mesmo local
                const loc = extractLocationFromEvent(e);
                if (normalizeLocation(loc) !== normalizeLocation(locationId)) return false;

                return true;
            });

            if (match) {
                slotsFound.push({
                    id: match.id,
                    start: match.start.dateTime || match.start.date,
                    location: locationId,
                    summary: match.summary
                });
            } else {
                // Se falhar em uma semana (ex: feriado ou ocupado), a sequência quebra?
                // Decisão: Não quebra, continua procurando. Mas returnamos apenas os achados.
                // O usuário vai receber "Consegui mais 2 agendamentos" em vez de 3.
            }
        }

        return slotsFound;

    } catch (err) {
        log.error('Erro ao verificar recorrência', err);
        return [];
    }
}

/**
 * Cria slots "Disponível" em massa.
 * Ex: createAvailabilitySlots('2026-02-14', '10:00', '18:00', 'online', 60)
 * Cria um slot por hora entre 10:00 e 18:00.
 */
async function createAvailabilitySlots(dateStr, startTime, endTime, location, type = 'regular', durationMinutes = 60) {
    if (!calendar) return [];

    const locationObj = KNOWLEDGE.locations.find(l => l.id === normalizeLocation(location));
    const locationName = locationObj ? locationObj.name : location;
    const created = [];

    // Checar se é feriado
    const holidays = await getHolidays();
    if (holidays.includes(dateStr)) {
        log.warn(`⚠️ Tentativa de criar slots em feriado ignorada: ${dateStr}`);
        return [];
    }

    // Configuração baseada no tipo
    const iskevelyn_studio = type === 'kevelyn_studio';
    const baseTitle = iskevelyn_studio ? 'kevelyn_studio' : 'Disponível';
    const colorId = iskevelyn_studio ? '1' : '7'; // 1 = Lavender (Roxo claro) para kevelyn_studio, 7 = Peacock (Azul) para Regular

    try {
        // Formatar para ISO 8601 COM Fuso Horário (-03:00) para evitar que o servidor UTC altere a hora
        const startIso = `${dateStr}T${startTime}:00-03:00`;
        const endIso = `${dateStr}T${endTime}:00-03:00`;

        let current = dayjs(startIso);
        const end = dayjs(endIso);

        if (!current.isValid() || !end.isValid()) {
            log.error('❌ Data inválida ao criar slots', { startIso, endIso });
            return [];
        }

        while (current.isBefore(end)) {
            const slotEnd = current.add(durationMinutes, 'minute');

            const event = await calendar.events.insert({
                calendarId,
                requestBody: {
                    summary: `${baseTitle} — ${locationName}`,
                    location: locationObj ? locationObj.address : '',
                    start: { dateTime: current.toISOString(), timeZone: 'America/Sao_Paulo' },
                    end: { dateTime: slotEnd.toISOString(), timeZone: 'America/Sao_Paulo' },
                    colorId: colorId,
                },
            });

            created.push(event.data);

            // Buffer time? Se quiséssemos buffer entre sessões, adicionaríamos aqui.
            // Ex: current = slotEnd.add(15, 'minute');
            // Por enquanto, segue fluxo contínuo solicitado.
            current = slotEnd;
        }

        log.info(`✅ ${created.length} slots criados para ${dateStr} (${locationName})`);
        return created;
    } catch (err) {
        log.error('Erro ao criar slots', { error: err.message });
        return created;
    }
}

/**
 * Remove um slot específico.
 * Agora suporta remoção por ID direto ou por horário (legado).
 * @param {string} identifier - ID do evento ou DateTime ISO
 */
async function removeSlot(identifier) {
    if (!calendar) return false;

    try {
        // 1. Tenta deletar por ID direto (mais seguro)
        // IDs do Google Calendar são alfanuméricos e não contêm símbolos de data ISO (T, :, -)
        const isLikelyId = identifier.length > 15 && !identifier.includes('T') && !identifier.includes(':');

        if (isLikelyId) {
            await calendar.events.delete({ calendarId, eventId: identifier });
            log.info(`🗑️ Slot removido por ID: ${identifier}`);
            return true;
        }


        // 2. Fallback: Busca por horário (legado)
        const slots = await getAvailableSlots(null, 30);
        const target = slots.find(s => {
            const slotStart = dayjs(s.start || s.start_time);
            const targetTime = dayjs(identifier);
            return Math.abs(slotStart.diff(targetTime, 'minute')) < 5;
        });

        if (!target) {
            log.warn(`⚠️ Slot não encontrado para remoção: ${identifier}`);
            return false;
        }

        await calendar.events.delete({ calendarId, eventId: target.id });
        log.info(`🗑️ Slot removido por horário: ${formatDateTimeBR(target.start)}`);
        return true;
    } catch (err) {
        log.error('Erro ao remover slot', { identifier, error: err.message });
        return false;
    }
}


/**
 * Busca agendamentos (não-disponíveis) para uma data ou semana.
 * @param {string|null} dateStr - 'YYYY-MM-DD' ou null para semana inteira
 */
async function getAppointments(dateStr = null) {
    if (!calendar) return [];

    try {
        let timeMin, timeMax;

        if (dateStr) {
            timeMin = dayjs(dateStr).startOf('day').toISOString();
            timeMax = dayjs(dateStr).endOf('day').toISOString();
        } else {
            timeMin = dayjs().startOf('day').toISOString();
            timeMax = dayjs().add(7, 'day').endOf('day').toISOString();
        }

        const response = await calendar.events.list({
            calendarId,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return (response.data.items || [])
            .filter(event => {
                const title = (event.summary || '').toLowerCase();
                return !title.includes('disponível') && !title.includes('disponivel');
            })
            .map(event => ({
                id: event.id,
                title: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                description: event.description || '',
                location: event.location || '',
            }));
    } catch (err) {
        log.error('Erro ao buscar agendamentos', { error: err.message });
        return [];
    }
}

/**
 * Formata slots para exibição no WhatsApp.
 */
function formatSlotsForWhatsApp(slots) {
    if (!slots || slots.length === 0) {
        // Mensagem padrão caso venha vazio, mas geralmente tratamos isso no conversation.js
        return '😔 No momento não há horários disponíveis.';
    }

    // Agrupa por dia
    const grouped = {};
    slots.forEach(slot => {
        const dateKey = dayjs(slot.start).format('YYYY-MM-DD');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(slot);
    });

    let result = '📅 *Horários Disponíveis (escolha uma opção):*\n\n';
    let globalIndex = 1;

    for (const [dateKey, daySlots] of Object.entries(grouped)) {
        const date = dayjs(dateKey);
        const weekday = date.format('dddd');
        const dateStr = date.format('DD/MM');

        result += `*${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dateStr}:*\n`;

        for (const slot of daySlots) {
            const time = dayjs(slot.start).format('HH:mm');
            const locationObj = KNOWLEDGE.locations.find(l => l.id === slot.location);
            const locationEmoji = locationObj ? locationObj.emoji : '📍';
            result += `   ${globalIndex}️⃣ ${time} ${locationEmoji}\n`;
            globalIndex++;
        }
        result += '\n';
    }

    result += '_Responda com o número do horário desejado._';
    return result;
}

/**
 * Formata agendamentos para exibição no admin.
 */
function formatAppointmentsForAdmin(appointments) {
    if (!appointments || appointments.length === 0) {
        return '📋 Nenhum agendamento encontrado para o período.';
    }

    let result = '📋 *Seus Agendamentos:*\n\n';

    appointments.forEach((apt, i) => {
        result += `${i + 1}. *${apt.title}*\n`;
        result += `   📅 ${formatDateTimeBR(apt.start)}\n`;
        if (apt.location) result += `   📍 ${apt.location}\n`;
        result += '\n';
    });

    return result;
}

// ─── Funções Auxiliares ───

/**
 * Extrai o local do evento pelo título ou localização.
 */
function extractLocationFromEvent(event) {
    const text = `${event.summary || ''} ${event.location || ''}`.toLowerCase();
    if (text.includes('itapecerica')) return 'itapecerica';
    if (text.includes('taboão') || text.includes('taboao')) return 'taboao';
    if (text.includes('online') || text.includes('vídeo') || text.includes('video')) return 'online';
    return 'online'; // Padrão: online
}

/**
 * Normaliza o nome do local para o ID.
 */
function normalizeLocation(loc) {
    const lower = (loc || '').toLowerCase().trim();
    if (lower.includes('itapecerica') || lower.includes('itap')) return 'itapecerica';
    if (lower.includes('taboão') || lower.includes('taboao') || lower.includes('tab')) return 'taboao';
    if (lower.includes('online') || lower.includes('remoto') || lower.includes('video')) return 'online';
    return lower;
}

/**
 * Marca o agendamento como "lembrete enviado" usando extendedProperties.
 */
async function markAppointmentAsReminded(eventId) {
    if (!calendar) return false;

    try {
        await calendar.events.patch({
            calendarId,
            eventId,
            requestBody: {
                extendedProperties: {
                    shared: {
                        reminded: 'true'
                    }
                },
                conferenceData: {
                    createRequest: {
                        requestId: `meet-${eventId}`, // Unique ID for the conference request
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 60 },
                        { method: 'popup', minutes: 1440 },
                    ],
                }
            },
            conferenceDataVersion: 1, // Required when creating conference data
        });
        return true;
    } catch (err) {
        log.error(`Erro ao marcar agendamento como lembrado ${eventId}:`, err);
        return false;
    }
}

/**
 * Marca o agendamento como "lembrete de 1h enviado".
 */
async function markAppointmentAsReminded1h(eventId) {
    if (!calendar) return false;
    try {
        await calendar.events.patch({
            calendarId,
            eventId,
            requestBody: {
                extendedProperties: {
                    shared: {
                        reminded_1h: 'true'
                    }
                }
            }
        });
        log.info(`✅ Agendamento marcado como lembrete 1h enviado: ${eventId}`);
        return true;
    } catch (err) {
        log.error(`Erro ao marcar lembrete 1h ${eventId}:`, err);
        return false;
    }
}

/**
 * Lista agendamentos para a "próxima hora" (ex: se é 13:00, pega 14:00-14:59).
 * Ignora se já tiver reminder_1h.
 */
/**
 * Marca o agendamento como "feedback enviado" usando extendedProperties.
 */
async function markAppointmentAsFeedbackSent(eventId) {
    if (!calendar) return false;
    try {
        await calendar.events.patch({
            calendarId,
            eventId,
            requestBody: {
                extendedProperties: {
                    shared: {
                        feedback_sent: 'true'
                    }
                }
            }
        });
        log.info(`✅ Agendamento marcado como feedback enviado: ${eventId}`);
        return true;
    } catch (err) {
        log.error(`Erro ao marcar feedback enviado ${eventId}:`, err);
        return false;
    }
}

/**
 * Lista agendamentos que começam na próxima hora (entre agora e +65 min).
 * Usado para enviar lembrete de 1h.
 */
async function listUpcomingAppointments() {
    if (!calendar) return [];
    try {
        const now = dayjs();
        const start = now.toISOString();
        const end = now.add(65, 'minute').toISOString(); // Buffer de sicurezza

        const res = await calendar.events.list({
            calendarId,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items || [];

        return events.filter(e => {
            const summary = (e.summary || '').toLowerCase();
            // Ignorar feriados, dispo e bloqueados
            if (summary.includes('disponível') || summary.includes('bloqueado') || summary.includes('feriado')) return false;

            // Filtro rígido de horário (redundância de segurança)
            // Garante que o evento realmente começa DENTRO da janela de 65 minutos
            const eventStart = dayjs(e.start.dateTime || e.start.date);
            const diffMinutes = eventStart.diff(now, 'minute');

            // Aceita apenas se faltar entre 0 e 65 minutos (e não ser negativo, ou seja, passado)
            return diffMinutes >= 0 && diffMinutes <= 65;
        });

    } catch (err) {
        log.error('Erro ao listar agendamentos próximos:', err);
        return [];
    }
}

/**
 * Gera estatísticas para o Dashboard
 * @param {number} days - Dias para analisar (passado e futuro)
 */
async function getDashboardStats(days = 30) {
    if (!calendar) return null;

    try {
        const now = dayjs();
        const start = now.subtract(days, 'day').startOf('day');
        const end = now.add(days, 'day').endOf('day');

        const response = await calendar.events.list({
            calendarId,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];

        // Inicializar métricas
        const stats = {
            total_appointments: 0,
            revenue_estimated: 0,
            appointments_by_status: {
                confirmed: 0,
                completed: 0, // Baseado em data passada
                scheduled: 0
            },
            appointments_by_service: {},
            daily_counts: {}
        };

        events.forEach(event => {
            const summary = (event.summary || '').toLowerCase();

            // Ignorar "Disponível" e "Bloqueado"
            if (summary.includes('disponível') || summary.includes('bloqueado') || summary.includes('feriado')) return;

            // Determinar Status
            const isPast = dayjs(event.end.dateTime || event.end.date).isBefore(now);
            const isConfirmed = summary.includes('confirmado') || (event.colorId === '2'); // Sage = Confirmed

            let status = 'scheduled';
            if (isPast) status = 'completed';
            else if (isConfirmed) status = 'confirmed';

            stats.appointments_by_status[status]++;
            stats.total_appointments++;

            // Estimar Receita (R$ 150,00 ou regex)
            // Tenta pegar do summary ou description se tiver preço
            // Fallback: Se tiver "procedimento" ou "Análise" -> 150/200
            let price = 0;
            if (summary.includes('Lash Design')) price = 180;
            else if (summary.includes('Design Estratégico')) price = 65;
            else if (summary.includes('Limpeza de Pele')) price = 220;
            else if (summary.includes('kevelyn_studio')) price = 45;

            // Se confirmado ou completado, soma receita
            if (status === 'confirmed' || status === 'completed') {
                stats.revenue_estimated += price;
            }

            // Agrupar por Serviço
            let serviceName = 'Outros';
            if (summary.includes('Lash Design')) serviceName = 'Lash Design';
            else if (summary.includes('Design Estratégico')) serviceName = 'Design Estratégico';
            else if (summary.includes('Limpeza de Pele')) serviceName = 'Limpeza de Pele';
            else if (summary.includes('kevelyn_studio')) serviceName = 'Sobrancelha';
            else if (summary.includes('premium')) serviceName = 'Premium';

            stats.appointments_by_service[serviceName] = (stats.appointments_by_service[serviceName] || 0) + 1;

            // Agrupar por Dia (para gráfico)
            const dateKey = dayjs(event.start.dateTime || event.start.date).format('YYYY-MM-DD');
            stats.daily_counts[dateKey] = (stats.daily_counts[dateKey] || 0) + 1;
        });

        return stats;

    } catch (err) {
        log.error('Erro ao gerar stats do dashboard:', err);
        return null;
    }
}
// Verifica se há slots disponíveis para quem está na lista de espera
async function checkWaitingListMatches() {
    try {
        // 1. Buscar pessoas na lista de espera que não foram notificadas
        const { data: waitingUsers, error } = await supabase
            .from('waiting_list')
            .select('*')
            .eq('notified', false);

        if (error || !waitingUsers || waitingUsers.length === 0) return [];

        // 2. Buscar slots disponíveis no futuro próximo (ex: próximos 7 dias)
        // Precisamos de uma função que retorne TODOS os slots livres, não apenas por dia
        // Para simplificar, vamos reutilizar getAvailableSlots para os próximos 3 dias
        let availableSlots = [];
        const today = dayjs();

        for (let i = 0; i < 3; i++) {
            const dateStr = today.add(i, 'day').format('YYYY-MM-DD');
            const slots = await getAvailableSlots(dateStr);
            if (slots && slots.length > 0) {
                slots.forEach(s => s.date = dateStr); // Anexar data
                availableSlots.push(...slots);
            }
        }

        if (availableSlots.length === 0) return [];

        // 3. Cruzar informações
        const matches = [];

        for (const user of waitingUsers) {
            // Se o usuário quer um serviço específico, verificamos (se a lógica de slots suportar filtro de serviço)
            // Por enquanto, assumimos que qualquer slot serve ou que o slot é genérico
            // Vamos pegar o primeiro slot livre
            const matchSlot = availableSlots[0];

            if (matchSlot) {
                matches.push({
                    user,
                    slot: matchSlot
                });
                // Remove slot usado da lista local para não ofertar o mesmo para todos (opcional, mas bom pra evitar flood)
                // availableSlots.shift(); 
            }
        }

        return matches;

    } catch (err) {
        log.error('Erro ao verificar lista de espera:', err);
        return [];
    }
}

module.exports = {
    initCalendar,
    getAvailableSlots,
    bookAppointment,
    createAvailabilitySlots,
    removeSlot,
    getAppointments,
    addToWaitingList,
    listRecentPastAppointments,
    formatSlotsForWhatsApp,
    formatAppointmentsForAdmin,
    normalizeLocation,
    confirmAppointment,
    cancelAppointment,
    markAppointmentAsReminded,
    listUpcomingAppointments,
    markAppointmentAsReminded1h,
    listTomorrowAppointments,
    checkWaitingListMatches,
    markAppointmentAsFeedbackSent,
    checkConsecutiveSlots,
    getDashboardStats
};







