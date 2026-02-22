const EventEmitter = require('events');

class WhatsAppEngine extends EventEmitter {
    constructor() {
        super();
        this.providerName = process.env.WHATSAPP_PROVIDER || 'wwebjs';
        this.provider = null;
    }

    async initialize(tenantId) {
        if (this.providerName === 'wwebjs') {
            const WWebJSProvider = require('./providers/WWebJSProvider');
            this.provider = new WWebJSProvider();
        } else {
            throw new Error(`[WhatsAppEngine] Provider '${this.providerName}' não implementado.`);
        }

        // Bridge: Repassar os eventos gerados pelo provider para a Engine Base
        const events = ['qr', 'ready', 'authenticated', 'auth_failure', 'disconnected', 'change_state', 'message_create', 'message'];
        events.forEach(evt => {
            this.provider.on(evt, (...args) => this.emit(evt, ...args));
        });

        await this.provider.initialize(tenantId);
    }

    async destroy() {
        if (this.provider) {
            await this.provider.destroy();
        }
    }

    async sendMessage(to, content, options) {
        if (!this.provider) throw new Error("[WhatsAppEngine] Engine não inicializada.");
        return await this.provider.sendMessage(to, content, options);
    }

    // --- PROPRIEDADES NATIVAS EXPOSTAS (Para Retrocompatibilidade durante a Fase 4) ---
    get info() {
        return this.provider && this.provider.client ? this.provider.client.info : null;
    }

    get pupPage() {
        return this.provider && this.provider.client ? this.provider.client.pupPage : null;
    }

    // Acesso sujo ao cliente para não quebrar módulos como Calendar/Broadcast da noite pro dia
    get nativeClient() {
        return this.provider ? this.provider.client : null;
    }
}

// Singleton global
const engineInstance = new WhatsAppEngine();
module.exports = engineInstance;








