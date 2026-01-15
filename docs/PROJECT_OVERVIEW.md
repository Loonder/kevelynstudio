# KEVELYN STUDIO - Documentação Completa do Projeto

## 📋 VISÃO GERAL

**Kevelyn Studio** é uma plataforma web completa para um estúdio de beleza premium especializado em design de sobrancelhas e extensão de cílios. O sistema combina site institucional, agendamento online, CRM, painel administrativo, blog/revista digital e plataforma de cursos (Academy).

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Principal
- **Framework**: Next.js 16.1.1 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Autenticação**: Supabase Auth
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI
- **Animações**: Framer Motion, Lenis (smooth scroll)
- **Ícones**: Lucide React
- **Formulários/Validação**: Zod
- **Notificações**: Sonner (toast)
- **Calendário**: React Big Calendar

### Estrutura de Pastas
```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Grupo de rotas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (public)/               # Grupo de rotas públicas (site institucional)
│   │   ├── about/
│   │   ├── services/
│   │   ├── gallery/
│   │   ├── methodology/
│   │   └── contact/
│   ├── (customer)/             # Área do cliente
│   │   └── agendamento/        # Fluxo de agendamento online
│   ├── (reception)/            # Área da recepção
│   ├── admin/                  # Painel administrativo
│   │   ├── calendar/           # Agenda/Calendário
│   │   ├── clients/            # Gestão de clientes (CRM)
│   │   ├── professionals/      # Gestão da equipe
│   │   ├── services/           # Gestão de serviços
│   │   ├── blog/               # Gestão do blog
│   │   ├── academy/            # Gestão de cursos
│   │   └── reviews/            # Gestão de avaliações
│   ├── blog/                   # Blog público
│   └── api/                    # API routes
├── actions/                    # Server Actions
├── components/                 # Componentes React
│   ├── ui/                     # Componentes UI genéricos
│   ├── admin/                  # Componentes do painel admin
│   └── layout/                 # Header, Footer, NavBar
├── db/                         # Database schema (Drizzle)
├── lib/                        # Utilitários e configurações
│   ├── supabase/               # Clients Supabase
│   └── schema/                 # Schemas adicionais
└── styles/                     # Estilos globais
```

---

## 🗄️ BANCO DE DADOS (Schema)

### Tabelas Principais

#### `professionals`
- Profissionais/barbeiros do estúdio
- Campos: id, name, slug, role, bio, instagramHandle, imageUrl, **color** (cor da agenda), isActive
- Utilizado na agenda para identificar quem atende cada horário

#### `services`
- Serviços oferecidos (extensão de cílios, design de sobrancelhas, etc.)
- Campos: id, title, description, price (em centavos), durationMinutes, category, imageUrl
- Categories: 'Lashes', 'Brows', etc.

#### `clients`
- Clientes do estúdio (CRM completo)
- Campos: id, fullName, email, phone, authUserId, role
- **sensoryPreferences** (JSONB): favoriteMusic, drinkPreference, temperature, musicVolume
  - *Conceito "Studio com Memória"*: guardar preferências sensoriais para experiência personalizada
- technicalNotes: histórico técnico (mapeamento, cola usada, etc.)
- notes: notas gerais de CRM
- totalVisits, lastVisit, birthDate

#### `client_logs`
- Logs/histórico de interações com clientes
- Campos: clientId, author, content, type ('note', 'call', 'complaint')

#### `appointments`
- Agendamentos (core do sistema)
- Campos: id, clientId, professionalId, serviceId
- startTime, endTime
- status: 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
- googleEventId (integração futura com Google Calendar)

#### `courses` & `lessons`
- Plataforma de cursos/masterclasses (Academy)
- courses: id, title, description, thumbnail, price, active
- lessons: courseId, title, videoUrl, duration, order, resources (JSONB)

#### `blog_posts`
- Sistema de blog/revista digital
- Campos: slug, title, excerpt, coverImage
- **content** (JSONB): array de blocos estruturados (paragraphs, h2, h3, images, blockquotes)
- published, authorId

#### `reviews`
- Avaliações/depoimentos de clientes
- Campos: clientName, rating (1-5), comment, photoUrl, approved

#### `gallery_images`
- Galeria de trabalhos
- Campos: imageUrl, title, category, isBeforeAfter

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores
- **Primary (Dourado)**: `#D4AF37` (gold premium)
- **Background**: `#050505` (preto profundo)
- **Cards/Glass**: `#0A0A0A` com glassmorphism (`bg-white/5`, `backdrop-blur`)
- **Text**: Branco com opacidades variadas (`text-white`, `text-white/60`, `text-white/40`)

### Componentes UI Customizados
- **GlassCard**: Cards com efeito vidro fosco
- **LuxuryButton**: Botões premium com gradientes e animações
- **AmbientLights**: Efeitos de luz ambiente (gradientes radiais animados)

### Tipografia
- **Serif** (títulos, elegância): `font-serif`
- **Sans-serif** (corpo, legibilidade): padrão

### Estética Geral
- **Dark Mode Premium**: fundo escuro, acentos dourados
- **Glassmorphism**: efeitos de vidro fosco em cards e modais
- **Micro-animações**: hover effects, transições suaves
- **Smooth Scroll**: implementado com Lenis

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 1. Site Institucional (Público)
- ✅ Homepage com hero section, serviços, depoimentos
- ✅ Página "Sobre" (história, missão, valores)
- ✅ Página de Serviços (cards visuais com descrição e preços)
- ✅ Galeria de trabalhos (Before/After)
- ✅ Metodologia/Processo
- ✅ Contato (formulário, mapa, redes sociais)
- ✅ Layout responsivo e animações suaves

### 2. Sistema de Autenticação
- ✅ Login/Registro (Supabase Auth)
- ✅ Forgot Password
- ✅ Route protection (middleware)
- ✅ Multi-role: Admin, Recepção, Cliente
- ✅ UI de auth com layout dark premium

### 3. Agendamento Online (Cliente)
- ✅ Fluxo completo de reserva:
  1. Seleção de serviço
  2. Escolha do profissional
  3. Seleção de data/horário
  4. Preferências sensoriais (música, bebida, temperatura)
  5. Confirmação
- ✅ Integração com database (appointments)
- ✅ WhatsApp redirect após confirmação
- ✅ Validação de horários ocupados

### 4. Painel Administrativo (Admin)
- ✅ **Dashboard**: métricas, KPIs, gráficos
- ✅ **Calendar/Agenda**: visualização mensal de agendamentos
  - Códigos de cor por profissional
  - Filtro por profissional
  - Modal de detalhes do agendamento
  - Status tracking
- ✅ **Clientes (CRM)**:
  - Listagem com DataTable
  - Busca/filtro
  - Detalhes do cliente (histórico, preferências)
  - Client Logs
- ✅ **Profissionais**:
  - Gestão de equipe (CRUD)
  - Cards visuais (Team Gallery)
  - Color picker para cor da agenda
  - Toggle ativo/inativo
  - Modal de criação/edição
- ✅ **Blog**:
  - Listagem de posts
  - Editor de conteúdo estruturado (blocos)
  - Suporte a: parágrafos, H2/H3, imagens, citações
  - Rascunhos e publicação
  - Criação e edição de posts
- ✅ **Academy**:
  - Gestão de cursos
  - Lições com vídeos (YouTube/Vimeo)
  - Recursos (PDFs, links)
- ✅ **Reviews**:
  - Moderação de avaliações
  - Aprovação/rejeição
- ✅ **Services**:
  - CRUD de serviços
  - Upload de imagens
  - Categorização

### 5. Área da Recepção
- ✅ Check-in de clientes
- ✅ Visualização de agenda do dia
- ✅ Atualização de status de agendamentos

### 6. Componentes Reutilizáveis
- ✅ DataTable (tabelas com paginação, ordenação)
- ✅ Modais/Dialogs (Radix UI)
- ✅ Forms com validação (Zod)
- ✅ Toast notifications (Sonner)
- ✅ Color Picker
- ✅ Date/Time pickers
- ✅ ScrollArea customizada

---

## 🚧 FUNCIONALIDADES PENDENTES / ROADMAP

### Prioridade Alta
- [ ] **Integração Google Calendar**: sincronizar agendamentos
- [ ] **Notificações/Lembretes**: SMS/Email/WhatsApp automáticos
- [ ] **Pagamentos Online**: integração Stripe/Mercado Pago
- [ ] **Upload de Imagens**: implementar storage (Supabase Storage ou Cloudinary)
  - Atualmente usa URLs diretas
- [ ] **Edição de Clientes**: modal para editar dados e preferências
- [ ] **Relatórios/Analytics**: relatórios financeiros, gráficos avançados

### Prioridade Média
- [ ] **Sistema de Recorrência**: agendamentos recorrentes (ex: a cada 3 semanas)
- [ ] **Bloqueio de Horários**: permitir admin bloquear horários no calendário
- [ ] **Conflito de Horários**: validação mais robusta de double booking
- [ ] **Edição de Agendamentos**: permitir admin/cliente editar agendamentos
- [ ] **Multi-idioma**: suporte PT/EN/ES
- [ ] **PWA**: transformar em Progressive Web App
- [ ] **Testes**: implementar testes unitários e E2E

### Prioridade Baixa / Futuro
- [ ] **Programa de Fidelidade**: sistema de pontos/recompensas
- [ ] **Integração Redes Sociais**: auto-post no Instagram após serviço
- [ ] **Chat/Suporte**: chat em tempo real
- [ ] **Marketplace**: venda de produtos (cílios, colas, etc.)
- [ ] **App Mobile**: versão nativa iOS/Android

---

## 🔧 CONFIGURAÇÃO E SETUP

### Variáveis de Ambiente (.env)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

### Comandos Principais
```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Build de produção
npm run start        # Start production server
npm run lint         # ESLint

# Database
npx drizzle-kit generate  # Gerar migrations
npx drizzle-kit push      # Aplicar schema ao DB
npx tsx seed.ts           # Seed inicial (serviços, profissionais)
```

---

## 🎯 CONCEITOS-CHAVE DO PROJETO

### 1. "Studio com Memória"
- Sistema de preferências sensoriais (música, bebida, temperatura)
- Histórico técnico detalhado (mapeamento, produtos usados)
- CRM completo com logs de interação
- Objetivo: experiência ultra-personalizada

### 2. Design Premium / Luxo
- Estética dark com dourado (gold)
- Glassmorphism e micro-animações
- Tipografia serif para elegância
- Smooth scroll e transições suaves

### 3. Multi-Role Architecture
- **Admin**: controle total
- **Recepção**: check-in, agenda do dia
- **Cliente**: agendamento online, histórico

### 4. Agendamento Inteligente
- Validação de horários disponíveis
- Duração automática baseada no serviço
- Buffer entre agendamentos (futuro)
- Códigos de cor por profissional

### 5. Conteúdo Estruturado (Blog)
- Editor de blocos customizado
- JSONB para flexibilidade
- Suporte a diferentes tipos de mídia
- Preview antes de publicar

---

## 🐛 PROBLEMAS CONHECIDOS / RESOLVIDOS

### Resolvidos Recentemente
- ✅ Hydration error no sidebar (pathname mismatch) → Solucionado com useEffect + mounted state
- ✅ Module not found 'fs' (postgres em client component) → Removido 'use client' de pages que usam DB
- ✅ Functions cannot be passed to client components → Separação de column definitions em arquivo client
- ✅ Blog edit route missing → Criado `/admin/blog/edit/[id]` com suporte a edição

### Em Observação
- HMR (Hot Module Reload) ocasionalmente causa erros de módulo deletado
  - Solução: refresh da página ou restart do dev server
- Font preload warnings (performance)
  - Não impacta funcionalidade, apenas otimização

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### Produção
- `next`: Framework React
- `react` + `react-dom`: Biblioteca UI
- `drizzle-orm`: ORM TypeScript-first
- `postgres`: Driver PostgreSQL
- `@supabase/supabase-js`: Client Supabase
- `@tanstack/react-table`: Tabelas avançadas
- `react-big-calendar`: Componente de calendário
- `date-fns`: Manipulação de datas
- `zod`: Validação de schemas
- `framer-motion`: Animações
- `lucide-react`: Ícones
- `sonner`: Toast notifications
- `tailwindcss`: Utility-first CSS

### Dev
- `typescript`: Tipagem estática
- `drizzle-kit`: CLI do Drizzle
- `eslint`: Linter
- `@tailwindcss/postcss`: Compilador TailwindCSS v4

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

1. **Implementar Upload de Imagens**
   - Configurar Supabase Storage
   - Criar componente de upload
   - Integrar em Professional, Service, Gallery

2. **Sistema de Notificações**
   - WhatsApp API (Twilio/Meta)
   - Email transacional (Resend/SendGrid)
   - Lembretes 24h antes do agendamento

3. **Pagamentos Online**
   - Stripe Checkout
   - Webhook para confirmar pagamento
   - Status "confirmed" automático após pagamento

4. **Google Calendar Sync**
   - OAuth2 com Google
   - Criar eventos automaticamente
   - Webhook para cancelamentos

5. **Melhorias de UX**
   - Loading states mais robustos
   - Error boundaries
   - Skeleton loaders
   - Otimistic updates

---

## 📝 NOTAS IMPORTANTES

- **Database Connection**: usar `DATABASE_URL` (pooler, porta 6543) no runtime, `DIRECT_URL` só para migrations
- **Prepare Statements**: desabilitado (`prepare: false`) pois Supabase usa pgBouncer
- **Server Actions**: marcados com `"use server"`, usados para mutations
- **Client Components**: marcados com `"use client"`, evitar importar DB diretamente
- **Auth Flow**: Supabase Auth + route middleware para proteção
- **Color System**: cada profissional tem uma cor para identificação visual na agenda

---

## 🎨 BRANDING

**Nome**: Kevelyn Studio
**Tagline**: "Where Beauty Meets Precision"
**Logo**: Texto "KEVELYN." com ponto dourado
**Conceito**: Estúdio de beleza premium, científico, com foco em precisão técnica e experiência sensorial memorável.

---

**Versão do Documento**: 1.0
**Última Atualização**: Janeiro 2026
**Projeto**: Kevelyn Studio - Beauty Studio Management Platform
