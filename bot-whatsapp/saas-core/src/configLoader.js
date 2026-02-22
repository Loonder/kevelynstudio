const fs = require('fs');
const path = require('path');

let currentConfig = null;

function loadConfig(tenantId = 'default') {
    if (currentConfig) return currentConfig;

    const configPath = path.join(__dirname, '../config/tenants', `${tenantId}.json`);

    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuração não encontrada para o Tenant: ${tenantId}`);
    }

    const raw = fs.readFileSync(configPath, 'utf8');
    currentConfig = JSON.parse(raw);

    console.log(`🔧 Configuração carregada para: ${currentConfig.professional.name} (${tenantId})`);
    return currentConfig;
}

function getConfig() {
    if (!currentConfig) {
        // Tenta carregar do env ou default
        const tenantId = process.env.TENANT_ID || 'default';
        return loadConfig(tenantId);
    }
    return currentConfig;
}

function saveConfig(newConfig, tenantId = 'default') {
    // Mesclar com a config atual para evitar perda de dados
    const current = getConfig();
    const updated = { ...current, ...newConfig };

    // Caminho do arquivo
    const configPath = path.join(__dirname, '../config/tenants', `${tenantId}.json`);

    fs.writeFileSync(configPath, JSON.stringify(updated, null, 4), 'utf8');
    currentConfig = updated;
    console.log(`💾 Configuração salva e recarregada para: ${tenantId}`);
    return currentConfig;
}

module.exports = { loadConfig, getConfig, saveConfig };








