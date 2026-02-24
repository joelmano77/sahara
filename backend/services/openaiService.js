require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chat = async (systemPrompt, history, newMessage) => {
    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: newMessage }
        ];
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 600,
            messages
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error('OpenAI Error:', err);
        return 'I apologize, but I am currently experiencing a service interruption. Please try again later.';
    }
};
