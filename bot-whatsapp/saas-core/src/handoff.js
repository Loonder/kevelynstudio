const supabase = require('./db');
const { log } = require('./logger');

/**
 * CHATWOOT-STYLE STATE MACHINE
 * Pending: Bot Active (Default)
 * Open: Human Active (Bot Mute)
 * Resolved: Bot Resumes
 */

const STATUS = {
    PENDING: 'pending',   // Bot Automation Active
    OPEN: 'open',         // Human Agent Active
    RESOLVED: 'resolved', // Conversation Closed / Bot Back
};

// SYNCHRONOUS CACHE (The "Interruptor")
// Stores phones that are in 'OPEN' status for 0ms latency check.
const activeHandoffs = new Set();

/**
 * Checks if Handover (Human Intervention) is active.
 * Used at the start of message processing.
 */
function isHandoverActive(phone) {
    return activeHandoffs.has(phone);
}

/**
 * Activates "Human" mode (Status: OPEN).
 * Bot goes silent immediately.
 */
async function startHandover(phone, adminUser = 'SYSTEM') {
    activeHandoffs.add(phone);
    log.info(`👨‍💻 Handover STARTED for ${phone} (Human Active)`);

    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const { updateSessionState, STATES } = require('./conversation');

        // Update Bot Session
        await updateSessionState(phone, STATES.HUMAN, {
            humanTakeover: true,
            handoverValues: {
                startTime: new Date().toISOString(),
                agent: adminUser
            }
        });

        // Update Contacts table (Sync state)
        await supabase.from('contacts').update({
            human_takeover: true,
            status: STATUS.OPEN
        }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio')
            .eq('phone', phone)
            .eq('tenant_id', tenantId);

    } catch (err) {
        log.error(`Error persisting handover for ${phone}:`, err);
    }
}

/**
 * Ends human intervention (Status: RESOLVED).
 * Bot takes back control.
 */
async function resolveHandover(phone, adminUser = 'SYSTEM') {
    activeHandoffs.delete(phone);
    log.info(`🤖 Handover RESOLVED for ${phone} (Bot Active)`);

    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const { updateSessionState, STATES } = require('./conversation');

        // Reset to MENU
        await updateSessionState(phone, STATES.MENU, {
            humanTakeover: false,
            handoverValues: null
        });

        await supabase.from('contacts').update({
            human_takeover: false,
            status: STATUS.RESOLVED
        }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio')
            .eq('phone', phone)
            .eq('tenant_id', tenantId);

    } catch (err) {
        log.error(`Error resolving handover for ${phone}:`, err);
    }
}

/**
 * Initialization: Loads handover states from DB on restart.
 */
async function loadHandoverState() {
    try {
        const tenantId = process.env.TENANT_ID || 'default';
        const { data, error } = await supabase
            .from('contacts')
            .select('phone')
            .eq('human_takeover', true)
            .eq('tenant_id', tenantId);

        if (error) throw error;

        if (data && data.length > 0) {
            data.forEach(row => activeHandoffs.add(row.phone));
            log.info(`🔄 Handover State restored for ${data.length} contacts.`);
        }
    } catch (err) {
        log.error('Error loading handover states:', err);
    }
}

module.exports = {
    STATUS,
    isHandoverActive,
    startHandover,
    resolveHandover,
    loadHandoverState
};









