const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

async function testarResposta() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: `Você é um assistente para pedidos.
SEMPRE responda EXATAMENTE neste formato:

RESPOSTA_AMIGAVEL: [sua resposta aqui]
JSON_ESTRUTURADO: {"pedido": "", "endereco": "", "pagamento": "", "referencia": ""}

Input: "uma pizza grande qui na rua itauba n 23 rua vitória regiua aida mendonça vou paga no pix"

Responda agora:`
                        }
                    ]
                }
            ]
        };

        console.log('📡 Enviando para Gemini...');
        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        console.log('\n✅ Resposta recebida!');
        console.log('\n📊 Status:', response.status);
        console.log('\n📦 Candidates:', response.data.candidates ? 'SIM' : 'NÃO');
        
        if (response.data.candidates && response.data.candidates[0]) {
            console.log('✅ Candidates[0] existe');
            console.log('📦 Content:', response.data.candidates[0].content ? 'SIM' : 'NÃO');
            
            if (response.data.candidates[0].content && response.data.candidates[0].content.parts) {
                console.log('✅ Parts existe');
                console.log('📦 Parts[0]:', response.data.candidates[0].content.parts[0] ? 'SIM' : 'NÃO');
                
                if (response.data.candidates[0].content.parts[0]) {
                    const texto = response.data.candidates[0].content.parts[0].text;
                    console.log('\n\n========== RESPOSTA COMPLETA DO GEMINI ==========\n');
                    console.log(texto);
                    console.log('\n==========================================\n');
                }
            }
        } else {
            console.log('❌ Erro: candidates não encontrado');
            console.log('Response:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testarResposta();
