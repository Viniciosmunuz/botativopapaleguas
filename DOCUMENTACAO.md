# 📚 Documentação - Bot PAPALEGUAS

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Fluxos de Conversa](#fluxos-de-conversa)
4. [Estados do Usuário](#estados-do-usuário)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Configuração](#configuração)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Bot PAPALEGUAS** é um assistente de WhatsApp automático para gerenciar pedidos em um restaurante/lanchonete. Ele:

- Recebe mensagens via WhatsApp Web
- Guia clientes através de um fluxo de pedido
- Notifica o proprietário sobre novos pedidos
- Gerencia atendimento manual quando necessário

**Stack Técnico:**
- Node.js
- whatsapp-web.js (conexão WhatsApp)
- dotenv (variáveis de ambiente)
- qrcode-terminal (autenticação)

---

## 🏗️ Arquitetura

### Estrutura de Dados

```javascript
userStages = {
  '559XXXXXXXXXX@c.us': 'MENU_PRINCIPAL',
  '559YYYYYYYYY@c.us': 'AGUARDANDO_DADOS_COMPLETOS'
}

userData = {
  '559XXXXXXXXXX@c.us': {
    lastActivity: 1702000000000,
    pedidoCompleto: 'Eu quero pizza com refrigerante...'
  }
}

userInAttendance = {
  '559XXXXXXXXXX@c.us': { startTime: 1702000000000 }
}
```

### Fluxo Geral

```
Cliente envia mensagem
         ↓
Bot verifica se é grupo (ignora se for)
         ↓
Bot verifica se está em atendimento manual (aguarda 15 min)
         ↓
Bot verifica inatividade (reseta após 1 hora)
         ↓
Bot processa mensagem baseado no estado atual
         ↓
Bot responde apropriadamente
```

---

## 💬 Fluxos de Conversa

### 1️⃣ Fluxo de Pedido (Opção 1)

```
Gatilho: Cliente digita "oi", "menu", "olá", etc
   ↓
Bot envia: Tela inicial com 2 opções
   ↓
Cliente digita "1" (Fazer Pedido)
   ↓
Bot envia: Instruções para enviar pedido completo
   (Pedido + Endereço + Ponto de Ref + Pagamento)
   ↓
Cliente envia tudo em UMA mensagem
   ↓
Bot pede confirmação (SIM / NÃO)
   ↓
Cliente digita "SIM"
   ↓
Bot encaminha para proprietário com instruções
   Bot marca cliente em atendimento (15 min)
   ↓
Bot aguarda resposta manual do dono
```

### 2️⃣ Fluxo de Suporte (Opção 2)

```
Cliente digita "2" no menu
   ↓
Bot envia aviso para proprietário com link WhatsApp
   Bot envia mensagem de confirmação ao cliente
   Bot marca cliente em atendimento (15 min)
   ↓
Proprietário responde manualmente
   (Bot fica "silencioso" durante 15 min)
   ↓
Após 15 min sem mensagem do cliente:
   Cliente pode digitar "menu" para recomeçar
```

---

## 🔄 Estados do Usuário

### Estados Possíveis

| Estado | Descrição | Próximo Estado |
|--------|-----------|---|
| `null` | Cliente novo ou inativo | `MENU_PRINCIPAL` |
| `MENU_PRINCIPAL` | Menu de opções inicial | `AGUARDANDO_DADOS_COMPLETOS` ou `SUPORTE` |
| `AGUARDANDO_DADOS_COMPLETOS` | Aguardando pedido completo | `AGUARDANDO_CONFIRMACAO` |
| `AGUARDANDO_CONFIRMACAO` | Pedido enviado, aguardando confirmação | `AGUARDANDO_DADOS_COMPLETOS` (se NÃO) ou `SUPORTE` (se SIM) |
| `SUPORTE` | Em atendimento manual | `MENU_PRINCIPAL` (se digitar menu) |

### Transições de Estado

```javascript
// Ativa um estado
userStages[from] = 'NOVO_ESTADO';

// Limpa estado (volta ao neutro)
delete userStages[from];
```

---

## ⚙️ Funcionalidades Principais

### 1. **Máquina de Estados**
- Cada usuário tem seu próprio estado
- Estado persiste em memória durante a sessão
- Reseta após 1 hora de inatividade

### 2. **Timeout de Inatividade**
```javascript
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora
```
- Se usuário não enviar mensagem por 1 hora → estado reseta
- Cliente pode recomeçar digitando "menu"

### 3. **Atendimento Manual**
```javascript
const ATTENDANCE_TIMEOUT = 15 * 60 * 1000; // 15 minutos
```
- Após pedido confirmado: bot fica 15 min "silencioso"
- Proprietário pode responder manualmente
- Bot ignora mensagens do cliente durante esse período

### 4. **Encaminhamento Automático**
- Pedidos são enviados para `OWNER_NUMBER`
- Suporte é notificado com link direto WhatsApp
- Inclui instruções de ação necessária

### 5. **Detecção de Gatilhos**
```javascript
isInitialTrigger(text) = /oi|ola|olá|menu|boa tarde|...|help/i
```
- Detecta quando cliente quer iniciar ou voltar ao menu
- Case-insensitive (funciona com maiúsculas/minúsculas)

### 6. **Ignora Grupos**
```javascript
if (from.endsWith('@g.us')) return; // Ignora grupos
```
- Responde apenas para contatos individuais
- Útil para evitar spam em grupos

### 7. **Efeito de Digitação**
```javascript
await msg.getChat().then(chat => chat.sendStateTyping());
await delay(300); // Aguarda 300ms
```
- Simula bot "digitando" para melhor UX
- Deixa mais natural a conversa

---

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
OWNER_NUMBER=559XXXXXXXXXX@c.us
PUPPETEER_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

**OWNER_NUMBER:**
- Número do proprietário que recebe notificações
- Formato: `559XXXXXXXXXX@c.us` (sem espaços ou hífens)

**PUPPETEER_EXECUTABLE_PATH:**
- Caminho do navegador Chrome/Chromium
- Necessário para automação do WhatsApp Web

### Constantes Configuráveis

```javascript
INACTIVITY_TIMEOUT = 60 * 60 * 1000  // Tempo até resetar (1 hora)
ATTENDANCE_TIMEOUT = 15 * 60 * 1000  // Tempo de atendimento manual (15 min)
```

---

## 📬 Fluxo de Mensagens

### Mensagens do Cliente

```
Cliente envia:
"Eu quero 2 pizzas grandes, 1 refrigerante
Endereço: Rua das Flores, 123
Ponto de Ref: Perto da farmácia
Pagamento: Pix"
```

### Mensagem para Proprietário

```
🚨 NOVO PEDIDO 🚨

📱 Cliente: https://wa.me/559XXXXXXXXXX

📝 Mensagem do Cliente:
Eu quero 2 pizzas grandes, 1 refrigerante
Endereço: Rua das Flores, 123
...

⚠️ AÇÃO NECESSÁRIA:
1️⃣ Calcular o valor do pedido
2️⃣ Enviar o valor e detalhes para o cliente
```

### Respostas do Bot

| Situação | Resposta |
|----------|----------|
| Cliente novo/menu | Tela com 2 opções |
| Escolhe pedido | Instruções de formato |
| Envia pedido | Pedido para confirmação |
| Confirma (SIM) | Pedido processando |
| Confirma (NÃO) | Volta para instruções |
| Resposta inválida | "Digite SIM ou NÃO" |
| Fora do fluxo | "Não entendi. Digite Menu" |

---

## 📊 Sequência Completa - Exemplo

```
1. Cliente: "oi"
   Bot: [Menu Principal com 2 opções]
   
2. Cliente: "1"
   Bot: [Instruções de pedido]
   Estado: AGUARDANDO_DADOS_COMPLETOS
   
3. Cliente: "Quero pizza\nRua A, 100\nPerto da escola\nPix"
   Bot: [Resumo do pedido para confirmar]
   Estado: AGUARDANDO_CONFIRMACAO
   
4. Cliente: "sim"
   Bot: [Pedido enviado para dono + Aguardando resposta]
   Estado: SUPORTE (atendimento manual)
   Cliente em: userInAttendance[from]
   
5. [Bot fica silencioso por 15 min]
   
6. Dono: "Olá, sua pizza sai em 30 min. Total R$ 45"
   Cliente recebe resposta manual
   
7. Após 15 min, cliente pode digitar "menu" para novo pedido
```

---

## 🛠️ Troubleshooting

### Problema: Bot não responde

**Causas possíveis:**
1. Bot não está rodando (`npm start`)
2. QR code não foi escaneado
3. WhatsApp Web foi desconectado

**Solução:**
```bash
npm start
# Escaneie o QR code com seu celular
# Aguarde mensagem "✅ Bot conectado..."
```

### Problema: Mensagens não chegam ao proprietário

**Verificar:**
1. `OWNER_NUMBER` está correto no `.env`?
2. Formato é `559XXXXXXXXXX@c.us`?
3. Bot tem acesso ao WhatsApp Web?

**Solução:**
```env
OWNER_NUMBER=559XXXXXXXXXX@c.us  # Seu número aqui
```

### Problema: Cliente fica preso em um estado

**Causa:** Provavelmente em atendimento manual

**Solução:**
- Aguarde 15 minutos
- Ou digite "menu" para sair

### Problema: "EBUSY: resource busy"

**Causa:** Arquivo de sessão travado

**Solução:**
```bash
Remove-Item -Path ".\.wwebjs_auth" -Recurse -Force
npm start
```

---

## 📝 Código - Fluxo Principal

```javascript
client.on('message', async (msg) => {
  // 1. Extrair dados
  const from = msg.from;
  const body = msg.body.trim();

  // 2. Ignorar grupos
  if (from.endsWith('@g.us')) return;

  // 3. Verificar atendimento manual
  if (userInAttendance[from]) {
    if (passou tempo de atendimento) {
      liberar cliente
    } else {
      return; // Ignorar mensagem
    }
  }

  // 4. Verificar inatividade
  if (passou 1 hora sem mensagem) {
    resetar estado
  }

  // 5. Processar por estado
  if (state === 'MENU_PRINCIPAL') {
    // processar menu
  } else if (state === 'AGUARDANDO_DADOS_COMPLETOS') {
    // processar pedido
  } else if (state === 'AGUARDANDO_CONFIRMACAO') {
    // processar confirmação
  }
});
```

---

## 🚀 Deploy para Produção

### Recomendações

1. **Use variáveis de ambiente** (já implementado)
2. **Use banco de dados** para persistência (futuro)
3. **Configure logs** para debugging (futuro)
4. **Implemente rate limiting** para evitar spam (futuro)
5. **Use servidor dedicado** (não máquina local)

### Próximas Melhorias

- [ ] Persistência de dados em banco de dados
- [ ] Dashboard para gerenciar pedidos
- [ ] Histórico de pedidos por cliente
- [ ] Notificações de status automáticas
- [ ] Integração com sistema de preços
- [ ] Respostas automáticas com IA

---

## 📞 Contato & Suporte

Dúvidas sobre o código? Entre em contato com o desenvolvedor.

---

**Versão:** 1.0  
**Data:** 09/12/2025  
**Linguagem:** JavaScript (Node.js)  
**Dependências:** whatsapp-web.js, dotenv, qrcode-terminal
