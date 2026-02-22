const stringSimilarity = require('string-similarity');

/**
 * Verifica se o texto do usuário corresponde a alguma das tags com tolerância a erros.
 * @param {string} userText - Texto do usuário
 * @param {string[]} tags - Lista de tags/palavras-chave
 * @param {number} threshold - Nível de semelhança (0 a 1). Default: 0.8
 * @returns {boolean}
 */
function fuzzyMatch(userText, tags, threshold = 0.8) {
    if (!userText || !tags || tags.length === 0) return false;

    const normalize = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanUserText = normalize(userText);
    const words = cleanUserText.split(' ');

    // Estratégia 1: Verificar se alguma tag está "contida" (match exato de substring) - Mais rápido
    // Mantemos isso pois 'preço' deve matchar 'qual o preço?'
    if (tags.some(tag => cleanUserText.includes(normalize(tag)))) return true;

    // Estratégia 2: Fuzzy Match palavra por palavra
    // Se o usuário digitou "preos" em vez de "preços", o 'includes' falha.
    // Vamos comparar cada palavra do userText com cada tag.

    for (const tag of tags) {
        const cleanTag = normalize(tag);

        // Verifica se alguma palavra do userText é similar à tag
        const bestMatch = stringSimilarity.findBestMatch(cleanTag, words);
        if (bestMatch.bestMatch.rating >= threshold) {
            return true;
        }
    }

    return false;
}

module.exports = { fuzzyMatch };






