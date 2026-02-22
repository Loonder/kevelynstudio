const { Client, LocalAuth } = require('whatsapp-web.js');
const EventEmitter = require('events');

class WWebJSProvider extends EventEmitter {
    constructor() {
        super();
        this.client = null;
    }

    async initialize(tenantId) {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: tenantId,
                dataPath: './.wwebjs_auth'
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                ],
            }
        });

        // Repassar eventos WWebJS como eventos do Provider
        const events = ['qr', 'ready', 'authenticated', 'auth_failure', 'disconnected', 'change_state', 'message_create', 'message'];
        events.forEach(evt => {
            this.client.on(evt, (...args) => this.emit(evt, ...args));
        });

        await this.client.initialize();
    }

    async destroy() {
        if (this.client) {
            await this.client.destroy();
        }
    }

    async sendMessage(to, content, options) {
        if (this.client) {
            return await this.client.sendMessage(to, content, options);
        }
        throw new Error("WWebJS Client not initialized.");
    }
}

module.exports = WWebJSProvider;








