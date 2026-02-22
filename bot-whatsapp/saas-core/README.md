# Assistente Kevelyn Multi-Tenant (SaaS Core)

Bem-vindo ao núcleo da versão SaaS do bot Assistente Kevelyn. Este projeto foi desenhado para ser "White Label", permitindo que múltiplas clínicas (Tenants) usem a mesma base de código com configurações diferentes.

## Estrutura do Projeto

```
saas-core/
├── config/
│   ├── tenants/           # Configurações JSON por cliente
│   │   ├── estetica_flor.json
│   │   ├── dr_pedro.json
│   │   └── default.json
│   └── templates.js       # Mensagens parametrizadas
├── src/
│   ├── core/              # Lógica agnóstica (Engine)
│   ├── adapters/          # Adaptadores (Whatsapp, Calendar)
│   └── services/          # Serviços (Agendamento, Financeiro)
├── docker-compose.yml     # Orquestração de containers por tenant
└── README.md
```

## Como Iniciar um Novo Tenant

1. Duplique `config/tenants/default.json`.
2. Renomeie para `[cliente_id].json`.
3. Preencha os dados (Nome, Pix, Horários).
4. Rode `npm run start --tenant=[cliente_id]`.

## Roadmap de Migração

1. [ ] Extrair lógica do `whatsapp-bot` original.
2. [ ] Substituir strings hardcoded por `loadConfig()`.
3. [ ] Criar API para gerenciamento de Tenants.



