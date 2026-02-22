# 🚀 Lista de Requisitos para o Sistema (Checklist)

Para o sistema **Kevelyn Studio (Site + Bot)** funcionar 100%, você precisa providenciar os seguintes itens:

## 1. Integrações (Essencial)

### 📱 WhatsApp (Para o Bot)
- [ ] **Celular com WhatsApp**: Um número dedicado para o estúdio (ou o seu pessoal, se preferir).
- [ ] **Ação**: Escanear o QR Code em `/admin` a cada reinicialização do bot (ou manter a sessão salva no servidor).

### 📅 Google Calendar (Para Agendamentos)
Sem isso, o widget mostrará sempre "Lista de Espera".
- [ ] **Conta Google / Google Cloud Platform**:
    1.  Criar um Projeto no [Google Cloud Console](https://console.cloud.google.com/).
    2.  Ativar a **Google Calendar API**.
    3.  Criar uma **Service Account**.
    4.  Baixar a chave JSON e renomear para `google-credentials.json`.
    5.  **Colocar o arquivo em**: `bot-whatsapp/saas-core/google-credentials.json`.
    6.  **Compartilhar sua Agenda**: Adicionar o email da Service Account (ex: `bot@projeto.iam.gserviceaccount.com`) na sua agenda do Google Calendar com permissão de "Fazer alterações nos eventos".

## 2. Hospedagem (Onde colocar no ar)

### 🌐 Frontend (O Site)
- [ ] **Vercel (Recomendado)**:
    -   Conectar seu GitHub.
    -   Importar o projeto `kevelynstudio`.
    -   Adicionar as Variáveis de Ambiente (`.env`) no painel da Vercel.

### 🤖 Backend (O Bot)
O bot precisa ficar rodando 24/7. O Vercel **NÃO** serve para isso (ele "dorme").
- [ ] **VPS (Servidor Virtual)**:
    -   DigitalOcean ou Hetzner (aprox. $5/mês).
    -   Instalar **Node.js 18+**.
    -   Instalar **PM2** (para manter o bot rodando sempre: `npm install -g pm2`).
    -   Rodar: `pm2 start src/index.js --name "kevelyn-bot"`.

## 3. Variáveis de Ambiente (.env)
Você já tem o arquivo, mas certifique-se de que ele esteja seguro no servidor.

```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Backend (Bot)
PORT=7778
ADMIN_PHONE=5511...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Resumo: O que falta fisicamente agora?
1.  **Arquivo JSON do Google** (para liberar a agenda).
2.  **Servidor VPS** (para hospedar o bot definitivamente).



