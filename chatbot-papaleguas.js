require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// ═════════════════════════════════════════════════════════════════════
// 🍽️ BOT PAPALEGUAS - RESTAURANTE E LANCHONETE
// ═════════════════════════════════════════════════════════════════════

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-resources'
        ]
    }
});

// Estados e dados dos usuários
const userStages = {};
const userData = {};
const userInAttendance = {};

// Configurações
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora
const ATTENDANCE_TIMEOUT = 60 * 60 * 1000; // 1 hora
const OWNER_NUMBER = process.env.OWNER_NUMBER || '5592999130838@c.us';
const CARDAPIO_LINK = process.env.CARDAPIO_LINK || 'https://drive.google.com/file/d/1-exemplo-cardapio/view?usp=drive_link';

// Funções auxiliares
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const isInitialTrigger = text => /(oi|ola|olá|menu|boa tarde|boa noite|bom dia|oi tudo|olá tudo|e aí|oq|start|help)/i.test(text);

console.log('🍽️ BOT PAPALEGUAS iniciando...');

// Mensagens do bot
const RESPONSES = {
    BOAS_VINDAS: `Olá! Bem-vindo(a) ao Restaurante PAPALEGUAS 🍽️\n\n📋 *CARDÁPIO:* ${CARDAPIO_LINK}\n⏰ *Horário:* 17:30 - 23:00 (todos os dias)\n💰 *Taxa de Entrega:* R$ 3,00\n\n1️⃣ Fazer um Pedido\n2️⃣ Falar com Atendente`,
    
    PEDIDO_TUDO_JUNTO: '⚠️ *Envie seu pedido em UMA MENSAGEM:*\n\n🍽️ O que você quer\n📍 Endereço (rua, número)\n🏘️ Ponto de Referência\n💳 Pagamento (Pix / Dinheiro / Cartão)',
    
    PEDIDO_CONFIRMACAO: (msg) => `⚠️ *CONFIRME SEU PEDIDO*\n\n${msg}\n\nEstá correto? Digite *SIM* ou *NÃO*`,
    
    PEDIDO_EM_PROCESSO: '⏳ *Pedido Processando!*\n\nUm atendente confirmará em breve e enviará:\n✅ Detalhes do pedido\n💰 Valor total\n⏱️ Tempo de entrega\n\nObrigado! 🍽️',
    
    SUPORTE_INICIO: 'Um atendente vai responder em breve! 🎯',
    SUPORTE_AVISO_DONO: (numero) => `👤 *CLIENTE SOLICITANDO ATENDIMENTO*\n\n📱 https://wa.me/${numero}`,
    
    RESPOSTA_PADRAO: 'Não entendi. Digite *Menu* para ver as opções.',
};

// Inicialização
client.on('qr', qr => {
    console.log('\n📱 QR CODE gerado! Escaneie com WhatsApp Web:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n' + '═'.repeat(70));
    console.log('🔗 QR CODE URL:');
    console.log('═'.repeat(70));
    console.log(qr);
    console.log('═'.repeat(70) + '\n');
});

client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para receber pedidos!');
    
    // Limpar todos os dados quando WhatsApp conecta
    Object.keys(userStages).forEach(key => delete userStages[key]);
    Object.keys(userData).forEach(key => delete userData[key]);
    Object.keys(userInAttendance).forEach(key => delete userInAttendance[key]);
    console.log('🔄 Dados resetados - sessão limpa!\n');
});

client.on('error', error => {
    console.error('❌ Erro:', error.message);
});

client.initialize().catch(error => {
    console.error('❌ Falha ao inicializar:', error.message);
    process.exit(1);
});

// Handler de mensagens
client.on('message', async (msg) => {
  try {
    const from = msg.from;
    const body = (msg.body || '').trim();

    // Ignora grupos
    if (!from || from.endsWith('@g.us')) {
        return;
    }

    console.log(`📨 ${from}: "${body}"`);

    // Verifica se cliente está em atendimento
    if (userInAttendance[from]) {
        const timeInAttendance = Date.now() - userInAttendance[from].startTime;
        
        if (timeInAttendance > ATTENDANCE_TIMEOUT) {
            delete userInAttendance[from];
            delete userStages[from];
            delete userData[from];
        } else {
            return;
        }
    }

    let state = userStages[from] || null;
    const now = Date.now();

    // Reset após 1 hora de inatividade
    if (state && userData[from]?.lastActivity && (now - userData[from].lastActivity > INACTIVITY_TIMEOUT)) {
        state = null;
        delete userStages[from];
        delete userData[from];
    }

    // Atualizar atividade
    if (state !== 'SUPORTE') {
        userData[from] = userData[from] || {};
        userData[from].lastActivity = now;
    }

    // Efeito de digitação
    await msg.getChat().then(chat => chat.sendStateTyping());
    await delay(300);

    // Menu a partir de suporte
    if (state === 'SUPORTE' && isInitialTrigger(body)) {
        await client.sendMessage(from, RESPONSES.BOAS_VINDAS);
        userStages[from] = 'MENU_PRINCIPAL';
        return;
    }

    // Iniciar conversa
    if (!state && isInitialTrigger(body)) {
      await client.sendMessage(from, RESPONSES.BOAS_VINDAS);
      userStages[from] = 'MENU_PRINCIPAL';
      return;
    }

    // Menu principal
    if (state === 'MENU_PRINCIPAL') {
      if (body === '1') {
        await client.sendMessage(from, RESPONSES.PEDIDO_TUDO_JUNTO);
        userStages[from] = 'AGUARDANDO_DADOS_COMPLETOS';
        userData[from] = userData[from] || {};
        return;
      }
      if (body === '2') {
        const numeroCliente = from.replace('@c.us', '');
        await client.sendMessage(OWNER_NUMBER, RESPONSES.SUPORTE_AVISO_DONO(numeroCliente));
        await client.sendMessage(from, RESPONSES.SUPORTE_INICIO);
        
        userInAttendance[from] = { startTime: Date.now() };
        delete userStages[from];
        return;
      }
      await client.sendMessage(from, RESPONSES.RESPOSTA_PADRAO);
      return;
    }

    // Fluxo de pedido
    if (state === 'AGUARDANDO_DADOS_COMPLETOS') {
      userData[from] = userData[from] || {};
      userData[from].pedidoCompleto = body;
      
      await client.sendMessage(from, RESPONSES.PEDIDO_CONFIRMACAO(body));
      userStages[from] = 'AGUARDANDO_CONFIRMACAO';
      return;
    }

    // Confirmação de pedido
    if (state === 'AGUARDANDO_CONFIRMACAO') {
      if (/^sim$/i.test(body)) {
        const numeroCliente = from.replace('@c.us', '');
        const ownerMessage = `🚨 *NOVO PEDIDO* 🚨\n\n📱 Cliente: https://wa.me/${numeroCliente}\n\n📝 *Mensagem do Cliente:*\n${userData[from].pedidoCompleto}\n\n⚠️ *AÇÃO NECESSÁRIA:*\n1️⃣ Calcular o valor do pedido\n2️⃣ Enviar o valor e detalhes para o cliente`;
        
        await client.sendMessage(OWNER_NUMBER, ownerMessage);
        await client.sendMessage(from, RESPONSES.PEDIDO_EM_PROCESSO);
        
        userInAttendance[from] = { startTime: Date.now() };
        delete userStages[from];
        delete userData[from];
        return;
      } else if (/^não|nao$/i.test(body)) {
        await client.sendMessage(from, RESPONSES.PEDIDO_TUDO_JUNTO);
        userStages[from] = 'AGUARDANDO_DADOS_COMPLETOS';
        delete userData[from].pedidoCompleto;
        return;
      } else {
        await client.sendMessage(from, '⚠️ Digite *SIM* ou *NÃO*');
        return;
      }
    }

    // Resposta padrão
    if (state && state !== 'SUPORTE') {
        await client.sendMessage(from, RESPONSES.RESPOSTA_PADRAO);
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
});
