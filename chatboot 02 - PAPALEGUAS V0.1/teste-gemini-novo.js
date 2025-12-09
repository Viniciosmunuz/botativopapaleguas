// Script de teste para Gemini
require('dotenv').config();
const { analisarMensagemDoCliente } = require('./gemini');

async function testar() {
    console.log('🧪 Testando Gemini com mensagem completa...\n');
    
    const mensagem = "uma pizza grande na rua itauba n 23 rua vitória régia aida mendonça vou pagar no pix";
    
    const resultado = await analisarMensagemDoCliente(mensagem, {
        pedido: '',
        endereco: '',
        pagamento: '',
        referencia: ''
    });
    
    console.log('\n📊 RESULTADO:');
    console.log('Mensagem:', resultado.mensagem);
    console.log('Dados:', resultado.dados);
}

testar().catch(console.error);
