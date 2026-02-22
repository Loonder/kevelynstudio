// =====================================================
// KNOWLEDGE BASE - SaaS CORE
// Carrega dados dinâmicos do Tenant via ConfigLoader
// =====================================================

const { getConfig } = require('./configLoader');

// Retorna um objeto que sempre lê a configuração atual (getters)
const KNOWLEDGE_BASE = {
    get professional() { return getConfig().professional; },
    get services() { return getConfig().services || []; },
    get locations() {
        return getConfig().locations || [
            { id: 'online', name: 'Atendimento Online', emoji: '💻', address: 'Via Google Meet/WhatsApp' }
        ];
    },
    get faq() { return getConfig().faq || []; },
    get packages() { return getConfig().packages || []; },
    get paymentInfo() { return getConfig().paymentInfo || ''; },

    // Estáticos / Hardcoded (seguros)
    quizzes: [],
    blogPosts: [],
    education: [],

    emergency: {
        support: 'https://wa.me/5511967422133',
        instagram: 'https://www.instagram.com/kevelynbeauty_',
    }
};

module.exports = KNOWLEDGE_BASE;








