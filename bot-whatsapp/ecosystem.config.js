module.exports = {
    apps: [{
        name: "whatsapp-bot-kevelyn",
        script: "./src/index.js",
        watch: false, // Em produção, melhor desligar watch e reiniciar manualmente no deploy
        max_memory_restart: "1G", // Reinicia se passar de 1GB (vazamento de memória do Chrome)
        env: {
            NODE_ENV: "production",
            TZ: "America/Sao_Paulo",
            // Adicione aqui outras variáveis se não estiverem no .env
        },
        // Configurações de log
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        error_file: "./logs/pm2-error.log",
        out_file: "./logs/pm2-out.log",

        // Politica de reinício
        exp_backoff_restart_delay: 100, // Espera progressiva se falhar muito rápido
    }]
}



