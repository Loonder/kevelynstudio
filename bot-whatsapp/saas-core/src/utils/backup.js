const fs = require('fs');
const path = require('path');
const supabase = require('../db');
const { log } = require('../logger');
const dayjs = require('dayjs');

async function performBackup() {
    try {
        log.info('💾 Iniciando backup automático dos contatos...');

        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*');

        if (error) throw error;

        const backupDir = path.join(__dirname, '../../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const filename = `backup_contacts_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`;
        const filePath = path.join(backupDir, filename);

        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

        log.info(`✅ Backup realizado com sucesso: ${filename} (${contacts.length} registros)`);

        // Limpeza de backups antigos (manter últimos 7 dias)
        cleanOldBackups(backupDir);

    } catch (err) {
        log.error('❌ Falha no backup automático:', err);
    }
}

function cleanOldBackups(dir) {
    try {
        const files = fs.readdirSync(dir);
        const now = Date.now();
        const RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (now - stats.mtimeMs > RETENTION_MS) {
                fs.unlinkSync(filePath);
                log.info(`🗑️ Backup antigo removido: ${file}`);
            }
        });
    } catch (e) {
        log.warn('Erro ao limpar backups antigos:', e);
    }
}

module.exports = { performBackup };









