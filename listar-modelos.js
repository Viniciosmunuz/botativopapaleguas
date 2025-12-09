const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        const response = await axios.get(url);
        console.log('📋 Modelos disponíveis:');
        response.data.models.forEach(model => {
            console.log(`  - ${model.name}`);
        });
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
    }
}

listModels();
