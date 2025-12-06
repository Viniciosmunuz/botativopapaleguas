FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências com npm install
RUN npm install --legacy-peer-deps

# Copiar código da aplicação
COPY . .

# Comando para iniciar a aplicação
CMD ["npm", "start"]
