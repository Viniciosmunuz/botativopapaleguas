FROM node:18-alpine

# Instalar dependências do sistema necessárias para Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-dejavu \
    dumb-init

WORKDIR /app

ENV NODE_ENV=production

# Copiar package.json
COPY package.json ./

# Instalar dependências npm
RUN npm install --legacy-peer-deps --omit=dev

# Copiar código da aplicação
COPY . .

# Usar dumb-init para iniciar o processo
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
