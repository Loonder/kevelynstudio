const supabase = require('./db');
const { log } = require('./logger');

/**
 * Adiciona uma tag ao contato.
 * @param {string} phone - Telefone (com 55)
 * @param {string} tag - Tag a ser adicionada (ex: 'LEAD', 'Cliente', 'LISTA_ESPERA')
 */
async function addTag(phone, tag) {
    try {
        // Normalizar tag (uppercase)
        const cleanTag = tag.toUpperCase().trim();

        const { data, error } = await supabase.rpc('append_tag', {
            p_phone: phone,
            p_tag: cleanTag
        });

        // Se RPC não existir, faz via JS (menos eficiente mas funciona)
        if (error) {
            // Fallback: Select -> Update
            const { data: contact } = await supabase.from('contacts').select('tags').eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', phone).single();
            if (contact) {
                const currentTags = contact.tags || [];
                if (!currentTags.includes(cleanTag)) {
                    await supabase.from('contacts').update({
                        tags: [...currentTags, cleanTag]
                    }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', phone);
                }
            }
        }

        log.info(`🏷️ Tag adicionada: [${cleanTag}] para ${phone}`);
        return true;
    } catch (err) {
        log.error(`Erro ao adicionar tag ${tag} para ${phone}:`, err);
        return false;
    }
}

/**
 * Remove uma tag do contato.
 */
async function removeTag(phone, tag) {
    try {
        const cleanTag = tag.toUpperCase().trim();

        // Fallback JS
        const { data: contact } = await supabase.from('contacts').select('tags').eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', phone).single();
        if (contact && contact.tags) {
            const newTags = contact.tags.filter(t => t !== cleanTag);
            await supabase.from('contacts').update({
                tags: newTags
            }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', phone);
        }

        log.info(`🏷️ Tag removida: [${cleanTag}] de ${phone}`);
        return true;
    } catch (err) {
        log.error(`Erro ao remover tag ${tag} de ${phone}:`, err);
        return false;
    }
}

/**
 * Verifica se contato tem uma tag.
 */
async function hasTag(phone, tag) {
    try {
        const { data } = await supabase
            .from('contacts')
            .select('tags')
            .eq('phone', phone)
            .contains('tags', [tag.toUpperCase()])
            .single();
        return !!data;
    } catch {
        return false;
    }
}

/**
 * Define o status de opt-out (bloqueio de mensagens automáticas).
 * @param {string} phone - Telefone
 * @param {boolean} status - true para bloquear, false para desbloquear
 */
async function setOptOut(phone, status) {
    try {
        const { error } = await supabase
            .from('contacts')
            .update({ opt_out: status })
            .eq('phone', phone);

        if (error) throw error;

        log.info(`🚫 Opt-out ${status ? 'ATIVADO' : 'DESATIVADO'} para ${phone}`);
        return true;
    } catch (err) {
        log.error(`Erro ao definir opt-out para ${phone}:`, err);
        return false;
    }
}

/**
 * Verifica se o contato optou por não receber mensagens.
 */
async function checkOptOut(phone) {
    try {
        const { data } = await supabase
            .from('contacts')
            .select('opt_out')
            .eq('phone', phone)
            .single();

        return data ? !!data.opt_out : false;
    } catch {
        return false;
    }
}

module.exports = {
    addTag,
    removeTag,
    hasTag,
    setOptOut,
    checkOptOut,
    updateStatus: async (phone, status) => {
        try {
            const { error } = await supabase.from('contacts').update({ status }).eq('tenant_id', process.env.TENANT_ID || 'kevelyn_studio').eq('phone', phone);
            if (error) throw error;
            return true;
        } catch (e) {
            console.error('Erro ao atualizar status:', e);
            return false;
        }
    }
};







