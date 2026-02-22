// src/knowledgeBase.js

/**
 * 💡 MOTOR DE REGRAS (EXPERT SYSTEM) - Kevelyn Studio
 * Responde dúvidas comuns sem necessidade de Menu.
 */

// Categorias de Perguntas e Respostas
const KNOWLEDGE_BASE = [
    // 💰 FINANCEIRO / PREÇOS
    {
        tags: ['preço', 'valor', 'custa', 'pagamento', 'investimento', 'pix', 'cartão'],
        answer: 'Nossos principais serviços:\n\n🔹 *Volume Russo:* R$ 350,00\n🔹 *Design de Sobrancelhas:* R$ 45,00\n🔹 *Lash Lifting:* R$ 120,00\n\nAceitamos Pix, Cartão de Crédito e Débito. ✨',
        priority: 10
    },
    {
        tags: ['curso', 'academy', 'mentoria', 'vip', 'aluna', 'formação'],
        answer: 'A Kevelyn Academy oferece formações de elite para profissionais da beleza. Nossa Mentoria VIP foca em técnicas avançadas de fios e gestão de estúdio. Digite *Academy* para saber mais!',
        priority: 10
    },
    // 📍 LOGÍSTICA / LOCAL
    {
        tags: ['onde fica', 'endereço', 'local', 'localização', 'presencial', 'estúdio'],
        answer: '📍 *Endereço:* R. Marajó, 9 - Jardim Santa Julia, Itapecerica da Serra - SP, 06867-440\n\nPróximo ao centro comercial do Santa Julia.',
        priority: 10
    },

    // ✨ SOBRE A GABRIELA KEVELYN
    {
        tags: ['quem é', 'especialista', 'formação', 'experiência'],
        answer: 'Gabriela Kevelyn é Master Lash Designer com mais de 7 anos de experiência e +2.000 alunas formadas. Referência em arquitetura facial em São Paulo.',
        priority: 5
    },

    // ⏰ AGENDA / HORÁRIOS
    {
        tags: ['sábado', 'sabado', 'horário', 'atendimento'],
        answer: 'Atendemos de **Segunda a Sábado, das 09h às 19h**. Para agendar, digite *Agendar* ou escolha a opção 2 no menu.',
        priority: 5
    }
];

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
        const match = fuzzyMatch(userText, item.tags, 0.75);

        if (match) {
            if (!bestMatch || item.priority > bestMatch.priority) {
                bestMatch = item;
            }
        }
    }

    return bestMatch ? bestMatch.answer : null;
}

module.exports = { findBestMatch };





