# 🤖 INTEGRAÇÃO GOOGLE GEMINI - GUIA DE CONFIGURAÇÃO

## ✅ Resumo da Integração

Seu chatbot foi **integrado com sucesso** ao Google Gemini! 

A IA agora analisa mensagens dos clientes de forma inteligente, extrai informações estruturadas e responde de forma amigável.

---

## 📋 ONDE INSERIR A API KEY DO GEMINI

### **Opção 1: Usando arquivo `.env` (RECOMENDADO)**

1. **Abra o arquivo `.env`** na raiz do seu projeto:
   ```
   c:\Users\jvini\Documents\chatbot\chatboot 02 - TESTE IA\.env
   ```

2. **Adicione esta linha** ao final do arquivo:
   ```dotenv
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **Obtenha sua chave gratuita** em: https://aistudio.google.com/app/apikey

---

### **Opção 2: Usando variável de ambiente do sistema (Servidor/Railway)**

Se você estiver deployando em um servidor (Railway, Heroku, etc.):

1. **Vá para o painel de variáveis de ambiente do seu servidor**
2. **Crie uma nova variável:**
   - **Nome:** `GEMINI_API_KEY`
   - **Valor:** Sua chave do Google Gemini

---

## 🔍 ONDE A API KEY É USADA NO CÓDIGO

A chave é **carregada automaticamente** pelo arquivo `gemini.js`:

### **Arquivo: `gemini.js` (linhas 6-15)**
```javascript
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ ERRO: GEMINI_API_KEY não foi definida!');
    console.error('📋 Configure a variável de ambiente GEMINI_API_KEY com sua chave do Google Gemini');
    process.exit(1);
}
```

**O que acontece:**
- Quando o bot inicia, ele procura pela variável `process.env.GEMINI_API_KEY`
- Se não encontrar, o bot **para de funcionar** e mostra um erro no console

---

## 🚀 COMO OBTER SUA CHAVE DO GEMINI (GRATUITA)

1. **Acesse:** https://aistudio.google.com/app/apikey
2. **Faça login** com sua conta Google
3. **Clique em "Create API Key"**
4. **Selecione o projeto** (ou crie um novo)
5. **Copie a chave** que aparecerá (exemplo: `AIzaSyDxxx...`)
6. **Cole no arquivo `.env`** conforme as instruções acima

---

## 🔄 COMO A IA FUNCIONA NO SEU BOT

### **Fluxo de integração:**

1. **Cliente envia mensagem** → `Oi, quero um hambúrguer para entregar`
2. **Bot recebe** no estado `AGUARDANDO_DADOS_COMPLETOS`
3. **Chama o Gemini** via função `analisarMensagemDoCliente(texto)`
4. **IA analisa e extrai dados:**
   ```json
   {
     "nome": "",
     "pedido": "hambúrguer",
     "endereco": "",
     "pagamento": "",
     "duvida": ""
   }
   ```
5. **Responde ao cliente** com mensagem amigável (gerada pela IA)
6. **Envia ao proprietário** com dados estruturados para análise

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### **Novos arquivos:**
- ✅ `gemini.js` - Integração completa com Google Gemini
- ✅ `.env.example` - Atualizado com a variável GEMINI_API_KEY

### **Arquivos modificados:**
- ✅ `chatbot-papaleguas.js` - Integração no fluxo principal
- ✅ `package.json` - Adicionada dependência `@google/generative-ai`

---

## 🧪 TESTANDO A INTEGRAÇÃO

Depois de adicionar a API KEY:

1. **Execute o bot:**
   ```bash
   npm start
   ```

2. **Observe o console** para verificar se aparece:
   ```
   ✅ Bot conectado e pronto para receber pedidos!
   ```

3. **Se não aparecer**, verifique:
   - A chave foi inserida corretamente no `.env`?
   - O arquivo `.env` está **na mesma pasta** de `chatbot-papaleguas.js`?
   - Você salvou o arquivo `.env`?
   - Precisou reiniciar o bot após adicionar a chave?

---

## ⚠️ TROUBLESHOOTING

### **Erro: "GEMINI_API_KEY não foi definida"**
- ✅ Verifique o arquivo `.env`
- ✅ Confirme se a linha está exatamente assim: `GEMINI_API_KEY=sua_chave`
- ✅ Sem espaços antes/depois do `=`

### **Erro: "Erro ao chamar Gemini"**
- ✅ A chave está correta?
- ✅ Você tem saldo/cota no Google Gemini? (geralmente a camada gratuita tem limites)
- ✅ Verifique sua conexão com internet

### **O bot não responde**
- ✅ Pode estar aguardando a resposta da IA (demora alguns segundos)
- ✅ Verifique os logs no console para erros

---

## 📊 FORMATO DE DADOS EXTRAÍDOS

A IA sempre tenta extrair estas informações:

```json
{
  "nome": "Nome do cliente (se mencionado)",
  "pedido": "O que o cliente quer pedir",
  "endereco": "Endereço de entrega completo",
  "pagamento": "Método de pagamento (Pix, Dinheiro, Cartão)",
  "duvida": "Qualquer dúvida mencionada"
}
```

Se um campo não for mencionado, fica vazio (`""`).

---

## 🎯 PRÓXIMOS PASSOS (OPCIONAL)

Melhorias futuras que você pode considerar:

- [ ] Armazenar dados do cliente em um banco de dados
- [ ] Usar a IA para gerar sugestões personalizadas de cardápio
- [ ] Validar endereços automaticamente
- [ ] Integrar com sistema de pagamento automático

---

## 📞 DÚVIDAS?

Se tiver problemas, verifique:
1. O console do Node.js para mensagens de erro
2. Se a chave do Gemini está válida em: https://aistudio.google.com/app/apikey
3. Sua conexão com internet

Boa sorte! 🚀
