#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando Setup do Kevelyn Studio na VPS ===${NC}"

# 1. Verificar/Instalar Node.js (v20)
echo -e "${YELLOW}> Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js já instalado: $(node -v)"
fi

# 2. Verificar/Instalar PM2
echo -e "${YELLOW}> Verificando PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "PM2 não encontrado. Instalando..."
    sudo npm install -g pm2
    pm2 startup
else
    echo "PM2 já instalado."
fi

# 3. Clone/Pull do Repositório
APP_DIR="/Loonder/kevelyn-studio"
REPO_URL="https://github.com/Loonder/kevelyn-studio.git"

if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}> Atualizando repositório existente em $APP_DIR...${NC}"
    cd $APP_DIR
    git pull
else
    echo -e "${YELLOW}> Clonando repositório em $APP_DIR...${NC}"
    sudo mkdir -p /var/www
    sudo git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# 4. Setup do .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}> Criando arquivo .env...${NC}"
    echo "Por favor, cole o conteúdo do seu .env abaixo (pressione Ctrl+D quando terminar):"
    cat > .env
    echo -e "${GREEN}.env salvo!${NC}"
fi

# 5. Instalar Dependências e Build
echo -e "${YELLOW}> Instalando dependências...${NC}"
npm install

echo -e "${YELLOW}> Gerando build da aplicação...${NC}"
npm run build

# 6. Iniciar com PM2
echo -e "${YELLOW}> Iniciando aplicação com PM2...${NC}"
pm2 delete kevelyn-studio 2>/dev/null || true
pm2 start npm --name "kevelyn-studio" -- start -- -p 3000

echo -e "${GREEN}=== Deploy Concluído! ===${NC}"
echo "Aplicação rodando em: http://localhost:3000"
echo "Para expor na web (porta 80), configure o Nginx."
