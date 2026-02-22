// src/security/antiFlood.js
const { log } = require('../logger');

const MESSAGE_LIMIT = 50; // Max messages per minute
const TIME_WINDOW = 60 * 1000; // 1 minute
const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes

const userCounters = new Map();
const blockedUsers = new Map();

/**
 * Checks if a user is flooding.
 * Returns true if allowed, false if blocked.
 */
function checkFlood(phone) {
    const now = Date.now();

    // 1. Check if already blocked
    if (blockedUsers.has(phone)) {
        const unblockTime = blockedUsers.get(phone);
        if (now < unblockTime) {
            log.warn(`🚫 Bloqueado por Flood: ${phone} (até ${new Date(unblockTime).toLocaleTimeString()})`);
            return false;
        } else {
            blockedUsers.delete(phone); // Unblock
            log.info(`🔓 Desbloqueado: ${phone}`);
        }
    }

    // 2. Update Counter
    let userData = userCounters.get(phone);
    if (!userData || now - userData.startTime > TIME_WINDOW) {
        // Reset window
        userData = { count: 1, startTime: now };
    } else {
        userData.count++;
    }
    userCounters.set(phone, userData);

    // 3. Check Limit
    if (userData.count > MESSAGE_LIMIT) {
        const unblockTime = now + BLOCK_DURATION;
        blockedUsers.set(phone, unblockTime);
        userCounters.delete(phone);
        log.warn(`🚨 FLOOD DETECTADO: ${phone} enviou ${userData.count} msgs em 1 min. Bloqueado por 10min.`);
        return false;
    }

    return true;
}

module.exports = { checkFlood };






