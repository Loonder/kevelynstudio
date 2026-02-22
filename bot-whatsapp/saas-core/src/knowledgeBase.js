// src/knowledgeBase.js

/**
 * 💡 MOTOR DE REGRAS (EXPERT SYSTEM)
 * Responde dúvidas comuns sem necessidade de Menu.
 */

const { getConfig } = require('./configLoader');

function buildKnowledgeBase() {
    const config = getConfig();
    const servicesText = config.services.map(s => `🔹 *${s.name}:* R$ ${s.price.toFixed(2)}`).join('\n');

    return [
        // 💰 FINANCEIRO / PREÇOS
        {
            tags: ['preço', 'valor', 'custa', 'pagamento', 'investimento', 'pix', 'cartão'],
            answer: `Os valores são:\n\n${servicesText}\n\nPagamento via *Pix*. Chave: ${config.professional.pixKey}`,
            priority: 10
        },
        {
            tags: ['endereço', 'local', 'onde fica'],
            answer: `📍 *Endereço:*\n${config.professional.address}`,
            priority: 10
        },
        {
            tags: ['profissional', 'quem é', 'formação'],
            answer: `👩‍⚕️ *${config.professional.name}*\n${config.professional.title}`,
            priority: 5
        }
        // Adicionar outros dinamicamente...
    ];
}

const KNOWLEDGE_BASE = buildKnowledgeBase();

const { fuzzyMatch } = require('./utils/fuzzy');

function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca a melhor resposta para o texto do usuário.
 */
function findBestMatch(userText) {
    if (!userText || userText.length < 3) return null;

    let bestMatch = null;

    for (const item of KNOWLEDGE_BASE) {
        // Usa Fuzzy Match agora!
        const match = fuzzyMatch(userText, item.tags, 0.75); // 0.75 de tolerância

        if (match) {
            // Se já tem um match, vê qual tem maior prioridade
            if (!bestMatch || item.priority > bestMatch.priority) {
                bestMatch = item;
            }
        }
    }

    return bestMatch ? bestMatch.answer : null;
}

module.exports = { findBestMatch };








