t# 🚀 GUIA DE INSTALAÇÃO - BOT PAPALEGUAS

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação do Node.js](#instalação-do-nodejs)
3. [Instalação do Chrome](#instalação-do-chrome)
4. [Transferência do Código](#transferência-do-código)
5. [Configuração Inicial](#configuração-inicial)
6. [Iniciando o Bot](#iniciando-o-bot)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

Antes de começar, você vai precisar de:

- ✅ Acesso de administrador no PC
- ✅ Conexão com internet
- ✅ Pelo menos 2GB de espaço em disco
- ✅ Acesso ao WhatsApp no seu celular

---

## 💻 Instalação do Node.js

### Passo 1: Baixar Node.js
1. Acesse: **https://nodejs.org/**
2. Clique em **"LTS"** (versão recomendada)
3. Escolha a versão para **Windows**
4. Clique para baixar o arquivo `.msi`

### Passo 2: Instalar Node.js
1. Abra o arquivo baixado (duplo clique)
2. Clique em **"Next"** em todas as telas
3. ✅ Marque a opção **"Add to PATH"** (importante!)
4. Clique em **"Install"**
5. Aguarde a conclusão

### Passo 3: Verificar Instalação
1. Abra o **PowerShell** (pesquise por "PowerShell" no menu Iniciar)
2. Digite os comandos abaixo (um de cada vez) e pressione Enter:

```powershell
node --version
npm --version
```

**Resultado esperado:**
```
v18.19.0  (ou similar)
9.6.4     (ou similar)
```

Se aparecer a versão, está instalado corretamente! ✅

---

## 🌐 Instalação do Chrome

### Passo 1: Baixar Chrome
1. Acesse: **https://www.google.com/chrome/**
2. Clique em **"Download Chrome"**
3. Escolha a versão para **Windows**

### Passo 2: Instalar Chrome
1. Abra o arquivo baixado
2. Siga as instruções na tela
3. Aguarde a instalação

### Passo 3: Verificar
1. Procure por "Chrome" no menu Iniciar
2. Abra o Chrome para confirmar que está funcionando

---

## 📁 Transferência do Código

### Opção A: Copiar Pasta (Mais Fácil)

1. **No PC atual (onde tem o código):**
   - Localize a pasta: `chatboot 02 - PAPALEGUAS V0.1`
   - Copie a pasta inteira (clique direito > Copiar)

2. **No novo PC:**
   - Crie uma pasta: `C:\chatbot` (ou em outro local de sua preferência)
   - Cole a pasta dentro: `C:\chatbot\chatboot 02 - PAPALEGUAS V0.1`

### Opção B: Usar Pen Drive

1. Copie a pasta inteira para um pen drive
2. No novo PC, copie o pen drive para: `C:\chatbot\`

### Opção C: Google Drive / OneDrive

1. Faça upload da pasta em uma nuvem
2. No novo PC, baixe de volta para: `C:\chatbot\`

---

## ⚙️ Configuração Inicial

### Passo 1: Abrir a Pasta do Projeto
1. Navegue até onde você copiou a pasta
2. Abra a pasta: `chatboot 02 - PAPALEGUAS V0.1`

### Passo 2: Configurar `.env`
1. Dentro da pasta, encontre o arquivo: `.env`
2. Abra com um editor de texto (bloco de notas)
3. Configure com seus dados:

```env
OWNER_NUMBER=5592999130838@c.us
CARDAPIO_LINK=https://seu-link-do-cardapio
OPENAI_API_KEY=sua-chave-openai
GEMINI_API_KEY=sua-chave-gemini
```

**Importantes:**
- `OWNER_NUMBER`: Seu número (formato: 559XXXXXXXXXX@c.us)
- `CARDAPIO_LINK`: Link do seu cardápio (Google Drive, etc)
- As outras chaves: Deixe como estão por enquanto

### Passo 3: Salvar
- Pressione: `Ctrl + S`
- Feche o arquivo

---

## 🚀 Iniciando o Bot

### Passo 1: Abrir PowerShell na Pasta

1. Abra a pasta do projeto: `chatboot 02 - PAPALEGUAS V0.1`
2. Clique na barra de endereço (onde está o caminho)
3. Digite: `powershell`
4. Pressione Enter

Ou:

1. Abra o PowerShell
2. Digite:
```powershell
cd C:\chatbot\chatboot 02 - PAPALEGUAS V0.1
```

### Passo 2: Instalar Dependências (Primeira Vez)

```powershell
npm install
```

Isso vai baixar todas as bibliotecas necessárias. Aguarde (pode levar 1-2 minutos).

### Passo 3: Iniciar o Bot

```powershell
npm start
```

**Resultado esperado:**

```
🍽️ BOT PAPALEGUAS iniciando...

📱 QR CODE gerado! Escaneie com WhatsApp Web:

[QR Code ASCII aqui]

══════════════════════════════════════════════════════════════════════
🔗 QR CODE URL:
══════════════════════════════════════════════════════════════════════
2@0yNjOvX2XyZpMvPaCzN9Fa+bllUb0gpSEsHcgyywP79TMZXETJlpb7mMOTT9...
```

---

## 📱 Autenticação no WhatsApp Web

### Passo 1: Escanear QR Code
1. Abra **WhatsApp Web** no navegador: **https://web.whatsapp.com**
2. Clique em **"Escanear código QR"**
3. Aponte a câmera do seu **celular** para o código QR que aparece no terminal
4. Aguarde a confirmação

### Passo 2: Confirmar
1. Após escanear, você verá:
```
✅ Bot conectado e pronto para receber pedidos!
```

2. O bot está pronto para usar! 🎉

---

## ✨ Testando o Bot

1. **No seu celular**, abra WhatsApp
2. Mande uma mensagem para você mesmo (seu número):
   - Digite: `oi`
3. **Resultado esperado:**
```
Olá! Bem-vindo(a) ao Restaurante PAPALEGUAS 🍽️

📋 CARDÁPIO: [seu-link]
⏰ Horário: 17:30 - 23:00 (todos os dias)
💰 Taxa de Entrega: R$ 3,00

1️⃣ Fazer um Pedido
2️⃣ Falar com Atendente
```

Se aparecer isso, está funcionando! ✅

---

## 🔧 Troubleshooting

### Problema: "Node não encontrado"

**Solução:**
1. Reinicie o PowerShell
2. Ou reinicie o PC
3. Verifique se instalou corretamente: `node --version`

---

### Problema: "npm install falha"

**Solução:**
1. Apague a pasta `node_modules` (se existir)
2. Tente novamente: `npm install`
3. Se continuar, tente com:
```powershell
npm install --legacy-peer-deps
```

---

### Problema: "Chrome não encontrado"

**Solução:**
1. Instale o Chrome: https://www.google.com/chrome/
2. Ou configure o caminho no `.env`:
```env
PUPPETEER_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

---

### Problema: "EBUSY: resource busy"

**Solução:**
```powershell
Remove-Item -Path ".\.wwebjs_auth" -Recurse -Force
npm start
```

Após isso, escaneie o QR code novamente.

---

### Problema: Bot não responde

**Verificar:**
1. Bot está rodando? (PowerShell ativo)
2. QR code foi escaneado?
3. WhatsApp Web está ativo?
4. Internet está funcionando?

**Solução:**
1. Feche o PowerShell (Ctrl + C)
2. Limpe a sessão:
```powershell
Remove-Item -Path ".\.wwebjs_auth" -Recurse -Force
npm start
```
3. Escaneie o QR code novamente

---

## 📞 Mantendo o Bot Rodando

### No PC do Restaurante:

O bot precisa estar **sempre rodando** para responder mensagens.

**Opção 1: Manter PowerShell Aberto**
- Deixe a janela do PowerShell aberta o tempo todo
- ⚠️ Não feche a janela!

**Opção 2: Usar Task Scheduler** (Recomendado)
- Configure para iniciar automaticamente quando ligar o PC
- [Ver tutorial avançado]

**Opção 3: Executar em Servidor**
- Deploy em um servidor online (Railway, Heroku, etc)
- Bot roda 24/7 na nuvem

---

## 📝 Resumo Rápido

```
1. Instalar Node.js ✅
2. Instalar Chrome ✅
3. Copiar pasta do projeto ✅
4. Configurar .env com seus dados ✅
5. npm install ✅
6. npm start ✅
7. Escanear QR code ✅
8. Testar mandando "oi" ✅
```

Se todos os passos estiverem OK, o bot está funcionando! 🚀

---

## 🆘 Precisa de Ajuda?

Se encontrar algum erro:

1. **Anote o código do erro** (copie a mensagem de erro)
2. **Tire screenshot** da tela
3. **Tente os passos novamente**
4. Se persistir, entre em contato

---

## 📚 Arquivos Importantes

Na pasta do projeto você encontrará:

- `chatbot-papaleguas.js` → Código principal do bot
- `.env` → Configurações (número, cardápio, etc)
- `package.json` → Dependências do projeto
- `DOCUMENTACAO.md` → Documentação técnica completa
- `README.md` → Informações do projeto

---

**Data:** 09/12/2025  
**Versão:** 1.0  
**Bot:** PAPALEGUAS  
**Desenvolvedor:** Seu Nome Aqui

