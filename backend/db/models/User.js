const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String },
    relationship: { type: String },
    state: { type: String },
    employment: { type: String },
    accounts: [{ type: String }],
    chatHistory: [{
        role: { type: String },
        content: { type: String },
        sources: [{ type: String }],
        showDocCTA: { type: Boolean }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
