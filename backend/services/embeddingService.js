require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.embed = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values; // float32 array
    } catch (err) {
        console.error('Embedding error:', err.message || err);
        throw err;
    }
};
