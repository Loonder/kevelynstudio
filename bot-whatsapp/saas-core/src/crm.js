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
            // Fallback: Select -> Update (Scope by Tenant)
            const tenantId = process.env.TENANT_ID || 'default';

            const { data: contact } = await supabase
                .from('contacts')
                .select('tags')
                .eq('phone', phone)
                .eq('tenant_id', tenantId) // Scope check
                .single();

            if (contact) {
                const currentTags = contact.tags || [];
                if (!currentTags.includes(cleanTag)) {
                    await supabase.from('contacts').update({
                        tags: [...currentTags, cleanTag]
                    }).eq('tenant_id', tenantId)
                        .eq('phone', phone);
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
        const tenantId = process.env.TENANT_ID || 'default';

        const { data: contact } = await supabase
            .from('contacts')
            .select('tags')
            .eq('phone', phone)
            .eq('tenant_id', tenantId)
            .single();

        if (contact && contact.tags) {
            const newTags = contact.tags.filter(t => t !== cleanTag);
            await supabase.from('contacts').update({
                tags: newTags
            }).eq('tenant_id', tenantId)
                .eq('phone', phone);
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
        const tenantId = process.env.TENANT_ID || 'default';
        const { data } = await supabase
            .from('contacts')
            .select('tags')
            .eq('phone', phone)
            .eq('tenant_id', tenantId)
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
        const tenantId = process.env.TENANT_ID || 'default';
        const { error } = await supabase
            .from('contacts')
            .update({ opt_out: status })
            .eq('phone', phone)
            .eq('tenant_id', tenantId);

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
        const tenantId = process.env.TENANT_ID || 'default';
        const { data } = await supabase
            .from('contacts')
            .select('opt_out')
            .eq('phone', phone)
            .eq('tenant_id', tenantId)
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
            const tenantId = process.env.TENANT_ID || 'default';
            const { error } = await supabase
                .from('contacts')
                .update({ status })
                .eq('phone', phone)
                .eq('tenant_id', tenantId);
            if (error) throw error;
            return true;
        } catch (e) {
            console.error('Erro ao atualizar status:', e);
            return false;
        }
    },

    /**
     * Busca leads filtrados por tag ou status.
     * @param {string} filterType - 'tag' ou 'status' ou 'all'
     * @param {string} value - Valor do filtro (ex: 'LEAD', 'open')
     */
    getLeads: async (filterType = 'all', value = null) => {
        try {
            const tenantId = process.env.TENANT_ID || 'default';
            let query = supabase
                .from('contacts')
                .select('*')
                .eq('tenant_id', tenantId)
                .order('created_at', { ascending: false })
                .limit(500);

            if (filterType === 'tag' && value) {
                query = query.contains('tags', [value.toUpperCase()]);
            } else if (filterType === 'status' && value) {
                query = query.eq('status', value);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (err) {
            log.error('Erro ao buscar leads:', err);
            return [];
        }
    },

    /**
     * Adiciona uma nota interna ao contato.
     * @param {string} phone - Telefone
     * @param {string} note - Texto da nota
     * @param {string} author - Autor da nota (Admin)
     */
    addNote: async (phone, note, author = 'Admin') => {
        try {
            const tenantId = process.env.TENANT_ID || 'default';

            // Buscar notas atuais
            const { data } = await supabase
                .from('contacts')
                .select('notes')
                .eq('phone', phone)
                .eq('tenant_id', tenantId)
                .single();

            const currentNotes = data && data.notes ? data.notes : '';
            const timestamp = new Date().toLocaleString('pt-BR');
            const newNoteEntry = `[${timestamp}] ${author}: ${note}\n`;
            const updatedNotes = currentNotes + newNoteEntry;

            const { error } = await supabase
                .from('contacts')
                .update({ notes: updatedNotes })
                .eq('phone', phone)
                .eq('tenant_id', tenantId);

            if (error) throw error;
            log.info(`📝 Nota adicionada para ${phone}`);
            return true;
        } catch (e) {
            log.error(`Erro ao adicionar nota para ${phone}:`, e);
            return false;
        }
    },

    /**
     * Recupera as notas de um contato.
     */
    getNotes: async (phone) => {
        try {
            const tenantId = process.env.TENANT_ID || 'default';
            const { data } = await supabase
                .from('contacts')
                .select('notes')
                .eq('phone', phone)
                .eq('tenant_id', tenantId)
                .single();
            return data && data.notes ? data.notes : 'Nenhuma nota registrada.';
        } catch {
            return 'Erro ao buscar notas.';
        }
    }
};









