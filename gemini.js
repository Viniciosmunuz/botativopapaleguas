// ═══════════════════════════════════════════════════════════════════
// 🤖 INTEGRAÇÃO GOOGLE GEMINI - ANÁLISE DE MENSAGENS
// ═══════════════════════════════════════════════════════════════════

const axios = require('axios');

// ─── INICIALIZAR GEMINI ───

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ ERRO: GEMINI_API_KEY não foi definida!');
    console.error('📋 Configure a variável de ambiente GEMINI_API_KEY com sua chave do Google Gemini');
    process.exit(1);
}

// Função auxiliar para validar resposta da API
function validarResposta(response) {
    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// ─── PROMPTS DO SISTEMA ───

const SYSTEM_PROMPT = `Você é um garçom do restaurante PAPALEGUAS. Seja breve e natural.

Responda assim:
[Uma frase natural confirmando os dados]
JSON_ESTRUTURADO: {"pedido": "...", "endereco": "...", "pagamento": "...", "referencia": "..."}

Dados coletados: ${'{pedido}'}
Preencha os campos vazios conforme a nova mensagem.`;







// ─── FUNÇÃO PARA ANALISAR MENSAGEM ───

/**
 * Analisa mensagem do cliente usando Gemini
 * @param {string} texto - Texto da mensagem do cliente
 * @param {Object} dadosAnterior - Dados já coletados anteriormente
 * @returns {Promise<Object>} { mensagem: string, dados: { nome, pedido, endereco, pagamento, duvida } }
 */
async function analisarMensagemDoCliente(texto, dadosAnterior = {}) {
    try {
        console.log('🤖 Analisando mensagem com Gemini...');

        // Identificar EXATAMENTE o que falta (SEM NOME)
        const faltando = [];
        if (!dadosAnterior.pedido) faltando.push("PEDIDO");
        if (!dadosAnterior.endereco) faltando.push("ENDEREÇO");
        if (!dadosAnterior.pagamento) faltando.push("PAGAMENTO");

        // Construir prompt com instrução clara sobre o que ainda falta
        const instrucaoFaltante = faltando.length > 0 
            ? `\n⚠️ DADOS AINDA FALTANDO: ${faltando.join(", ")}\nVocê DEVE pedir especificamente por esses dados! Não peça por dados já obtidos.`
            : `\n✅ TODOS OS DADOS FORAM COLETADOS! Confirme o pedido completo do cliente.`;

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: `${SYSTEM_PROMPT}

DADOS JÁ COLETADOS:
- PEDIDO: ${dadosAnterior.pedido || "[vazio]"}
- ENDEREÇO: ${dadosAnterior.endereco || "[vazio]"}
- PAGAMENTO: ${dadosAnterior.pagamento || "[vazio]"}
- REFERÊNCIA: ${dadosAnterior.referencia || "[vazio]"}

${instrucaoFaltante}

NOVA MENSAGEM DO CLIENTE: "${texto}"

Agora responda de forma natural e alegre, como um garçom conversando!`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1000,
                topP: 0.95,
                topK: 40
            }
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        // Validar resposta com segurança
        const resultado = validarResposta(response);
        
        if (!resultado) {
            console.error('❌ Resposta do Gemini vazia ou estrutura inválida');
            console.error('Estrutura da resposta:', JSON.stringify(response.data).substring(0, 300));
            
            // Se houver erro, tenta extrair mensagem de erro
            if (response.data?.error) {
                console.error('Erro da API:', response.data.error);
            }
            
            return {
                mensagem: 'Houve um problema ao processar sua mensagem. Pode tentar novamente?',
                dados: dadosAnterior
            };
        }

        console.log('✅ Resposta do Gemini recebida');
        console.log('📝 CONTEÚDO COMPLETO:\n' + resultado);

        // Extrair resposta amigável (primeira linha até JSON)
        const respostaMatch = resultado.match(/^(.+?)(?=JSON_ESTRUTURADO:|$)/s);
        const mensagem = respostaMatch ? respostaMatch[1].trim() : 'Certo, anotado! 😊';
        
        if (!jsonMatch) {
            console.warn('⚠️ JSON não encontrado!');
            console.warn('Resposta completa:', resultado);
        }
        
        let dados = {
            pedido: dadosAnterior.pedido || '',
            endereco: dadosAnterior.endereco || '',
            pagamento: dadosAnterior.pagamento || '',
            referencia: dadosAnterior.referencia || ''
        };

        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[1]);
                // Mesclar: manter dados antigos e adicionar novos
                dados = {
                    pedido: parsed.pedido || dadosAnterior.pedido || '',
                    endereco: parsed.endereco || dadosAnterior.endereco || '',
                    pagamento: parsed.pagamento || dadosAnterior.pagamento || '',
                    referencia: parsed.referencia || dadosAnterior.referencia || ''
                };
                console.log('✅ Dados extraídos:', dados);
            } catch (parseError) {
                console.warn('⚠️ Erro ao fazer parse do JSON:', parseError.message);
                console.warn('JSON recebido:', jsonMatch[1]);
            }
        } else {
            console.warn('⚠️ JSON_ESTRUTURADO não encontrado na resposta. Mantendo dados anteriores.');
        }

        return {
            mensagem,
            dados
        };

    } catch (error) {
        console.error('❌ Erro ao chamar Gemini:', error.message);
        
        // Se for erro de rede ou timeout
        if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
            console.error('⚠️ Problema de conexão com a API do Gemini');
        }
        
        // Se for erro da API
        if (error.response?.data?.error) {
            console.error('🔴 Erro da API Gemini:', error.response.data.error);
        }
        
        console.error('Stack:', error.stack);
        
        return {
            mensagem: 'Desculpe, não consegui processar sua mensagem no momento. Pode tentar de novo em alguns segundos?',
            dados: dadosAnterior
        };
    }
}

// ─── EXPORTAR FUNÇÃO ───

module.exports = {
    analisarMensagemDoCliente
};
