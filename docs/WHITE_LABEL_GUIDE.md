# 🍰 Receita de Bolo: Como Replicar este Bot em 5 Minutos

Se você está cansado e quer o caminho mais curto, aqui está o que você faz para cada novo cliente:

### 1. Copie a Pasta
Pegue esta pasta inteira do projeto e cole no novo servidor (ou em uma nova pasta na sua VPS).

### 2. O Único Ajuste Obrigatório (`.env`)
Abra o arquivo `.env` e mude apenas o nome:
- `TENANT_ID=nome_do_novo_cliente_aqui`
- *(Isso cria um banco de dados isolado na hora!)*

### 3. Mude o "Cérebro" (Pasta `bot-whatsapp/saas-core/src/`)
Edite apenas estes 3 arquivos para o bot mudar de assunto:
1.  **`knowledge.js`**: Troque o nome do profissional e a lista de preços.
2.  **`knowledgeBase.js`**: Troque o endereço e as perguntas frequentes.
3.  **`prompts.js`**: Mude a personalidade (ex: de "acolhedora" para "vendedor agressivo").

### 4. Ligue o Motor
No terminal da VPS:
```bash
cd bot-whatsapp/saas-core
pm2 start src/index.js --name bot-novo-cliente
```
**Pronto!** O bot já está atendendo o novo segmento.

---

# 🚀 Guia Detalhado (Para quando você estiver descansado)

Este projeto foi arquitetado como um **SaaS Multi-tenant**. Isso significa que você pode hospedar vários clientes no mesmo banco de dados ou isolá-los facilmente, apenas alterando as configurações de ambiente.

## 1. O "Pulo do Gato": O TENANT_ID
A chave mágica é a variável `TENANT_ID` no arquivo `.env`.
- **Como funciona:** Se você mudar de `kevelyn_studio` para `pizzaria_do_ze`, o Admin e o Bot criarão automaticamente um "universo" novo de dados.
- **Dica:** Use sempre o `TENANT_ID` para isolar clientes diferentes no mesmo banco de dados (SaaS) ou para começar um projeto do zero.

## 2. Mudando o Segmento (O Cérebro do Bot)
Para o bot parar de falar de "Cílios" e começar a falar do seu novo negócio, você só precisa editar **3 arquivos** em `bot-whatsapp/saas-core/src/`:

1.  **`knowledge.js`**: Aqui você define a "Identidade" (Nome, serviços e preços).
2.  **`knowledgeBase.js`**: Aqui você define as "FAQs" (Endereço, horários, pagamentos).
3.  **`prompts.js`**: Aqui você define a "Vibe" (Personalidade: direta ou acolhedora).

## 3. Estrutura de "Vendas Rápidas"
Se o seu objetivo não é agendar, mas sim **vender**:
- **Passo A:** No `knowledge.js`, em vez de "Procedimentos", coloque "Produtos".
- **Passo B:** No `bookingHandler.js`, simplifique o fluxo para que, após escolher o serviço, o bot já mande o link de pagamento ou a chave PIX.

## 4. Bot Sem Erros (Estabilidade)
Para garantir que o bot nunca pare:
1.  **Use PM2:** Sempre inicie com `pm2 start index.js --name bot-cliente-x`. Isso faz ele reiniciar sozinho se o servidor cair.
2.  **Supabase RLS:** O Row Level Security garante que os dados do `cliente_A` nunca vazem para o `cliente_B`.
3.  **Logs:** Se algo der errado, olhe o `pm2 logs`.

## 5. Deploy em VPS (Modo Profissional)
Hospedar em uma VPS é a melhor escolha para um SaaS:
- **PM2:** Gerencia os processos 24/7.
- **Sessão:** Na primeira vez, rode `node src/index.js` para ler o QR Code. Depois de logado, pare o processo e use o PM2. A sessão fica salva em `.wwebjs_auth`.

## 🏗️ Resumo para Escalar
1. Crie novo projeto Supabase (ou use o mesmo com novo Tenant).
2. Clone o código na VPS.
3. Ajuste o `.env` (`TENANT_ID` é obrigatório).
4. Edite os 3 arquivos de "Cérebro".
5. Inicie com PM2 e lucre.
