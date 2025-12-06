FROM node:18-alpine

# Instalar dependências do sistema necessárias para Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    ca-certificates \
    ttf-dejavu

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências npm
RUN npm install --legacy-peer-deps

# Copiar código da aplicação
COPY . .

# Comando para iniciar a aplicação
CMD ["npm", "start"]
