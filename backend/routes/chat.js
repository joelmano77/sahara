const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const ragService = require('../services/ragService');
const openaiService = require('../services/geminiService');

// Get chat history for a user
router.get('/:userId', async (req, res, next) => {
    try {
        if (!global.USE_DB || req.params.userId === 'mock-user-id-123') {
            return res.json([]);
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.chatHistory || []);
    } catch (err) {
        next(err);
    }
});

// Post a new message
router.post('/', async (req, res, next) => {
    try {
        const { message, history, userId, accounts } = req.body;

        let userProfile = { name: 'User', relationship: '', state: '', employment: '', accounts: [] };
        let dbUser = null;
        if (global.USE_DB && userId && userId !== 'mock-user-id-123') {
            dbUser = await User.findById(userId);
            if (dbUser) {
                userProfile = dbUser;
            }
        }

        const ragChunks = await ragService.retrieve(message, accounts, 5);

        const systemPrompt = `You are Sahara, a compassionate post-bereavement navigation assistant for India. Help bereaved families navigate legal, financial, and digital account closure after a loved one's death.

USER PROFILE:
Name: ${userProfile.name}, Relationship: ${userProfile.relationship}, State: ${userProfile.state},
Employment: ${userProfile.employment}, Accounts: ${(userProfile.accounts || []).join(', ')}

RETRIEVED KNOWLEDGE BASE (cite sources in responses):
${ragChunks.map(c => c.text).join('\n\n')}

INSTRUCTIONS:
- Be warm, empathetic, concise
- Always cite sources: 'Per RBI Direction...' or 'As per IRDAI...'
- List required documents clearly
- Keep responses under 180 words unless detailed steps requested
- Use plain text; no markdown; use line breaks for readability
- If asked to generate a doc: say 'tap Documents tab to download'
- If outside knowledge base: acknowledge and suggest official portals`;

        const reply = await openaiService.chat(systemPrompt, history, message);
        const showDocCTA = reply.toLowerCase().includes('document') || reply.toLowerCase().includes('form');

        const aiReply = {
            reply,
            sources: ragChunks.map(c => c.source),
            showDocCTA
        };

        // Save history if connected to DB
        if (dbUser) {
            // Reconstruct the history correctly merging previous list with current single back-and-forth
            dbUser.chatHistory = [
                ...history,
                { role: 'user', content: message },
                { role: 'assistant', content: aiReply.reply, sources: aiReply.sources, showDocCTA: aiReply.showDocCTA }
            ];
            await dbUser.save();
        }

        res.json(aiReply);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
