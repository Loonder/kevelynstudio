const supabase = require('./db');
const { log } = require('./logger');
require('dotenv').config();

// Simple in-memory cache
let messageCache = {};
let lastFetch = 0;
const CACHE_TTL = 300000; // 5 minutes

/**
 * Fetch all messages from Supabase or Cache
 */
async function getMessages(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && Object.keys(messageCache).length > 0 && (now - lastFetch < CACHE_TTL)) {
        return messageCache;
    }

    try {
        const { data, error } = await supabase
            .from('bot_messages')
            .select('*')
            .eq('tenant_id', process.env.TENANT_ID || 'default');

        if (error) throw error;

        // Map array to object for easy lookup: { 'key': 'content' }
        const newCache = {};
        data.forEach(msg => {
            newCache[msg.key] = msg.content;
        });

        messageCache = newCache;
        lastFetch = now;
        log.info('Messages refreshed from Supabase');
        return messageCache;
    } catch (err) {
        log.error('Error fetching messages:', err);
        // Return existing cache if fetch fails, or empty object
        return messageCache || {};
    }
}

/**
 * Get a specific message by key
 * @param {string} key - The message key (e.g., 'saudacao_inicial')
 * @param {object} replacements - Variables to replace {name} -> 'John'
 */
async function getMessage(key, replacements = {}) {
    const messages = await getMessages();
    let content = messages[key];

    if (!content) {
        log.warn(`Message key not found: ${key}`);
        return `[Mensagem não configurada: ${key}]`;
    }

    // Replace variables: {name}
    for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }

    // Unescape literal \n from DB
    content = content.replace(/\\n/g, '\n');

    return content;
}

const { getTemplate } = require('./templates');

/**
 * Internal helper to get raw content with fallback
 */
async function getContent(key) {
    const messages = await getMessages();
    if (messages[key]) return messages[key];

    // Check templates (Static Config-based)
    const template = getTemplate(key);
    if (template && !template.startsWith('[Template não encontrado')) {
        return template;
    }

    return null;
}

// Override getMessage to use new getContent helper
async function getMessage(key, replacements = {}) {
    let content = await getContent(key);

    if (!content) {
        log.warn(`Message key not found: ${key}`);
        return `[Mensagem não configurada: ${key}]`;
    }

    // Replace variables: {name}
    for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }

    // Unescape literal \n from DB (only if it came from DB string)
    if (typeof content === 'string') {
        content = content.replace(/\\n/g, '\n');
    }

    return content;
}

/**
 * Get a message with optional media (Rich Message)
 * @returns {Promise<{text: string, media?: string, mediaType?: 'audio'|'image'}>}
 */
async function getRichMessage(key, replacements = {}) {
    let content = await getContent(key);
    let media = null;
    let mediaType = null;

    // Check if content is JSON (Rich Media stored in DB)
    if (content && typeof content === 'string' && content.startsWith('{') && content.includes('"text"')) {
        try {
            const parsed = JSON.parse(content);
            content = parsed.text;
            media = parsed.media;
            mediaType = parsed.mediaType;
        } catch (e) {
            // Not JSON, treat as string
        }
    }

    if (!content) {
        log.warn(`Message key not found: ${key}`);
        content = `[Mensagem não configurada: ${key}]`;
    }

    // Replace variables
    for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }

    if (typeof content === 'string') {
        content = content.replace(/\\n/g, '\n');
    }

    return { text: content, media, mediaType };
}

module.exports = {
    getMessages,
    getMessage,
    getRichMessage
};









