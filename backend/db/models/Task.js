const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasks: [{
        icon: { type: String },
        category: { type: String },   // renamed from 'type' — Mongoose reserved keyword
        name: { type: String },
        sub: { type: String },
        status: {
            type: String,
            enum: ['pending', 'progress', 'submitted', 'done'],
            default: 'pending'
        },
        notes: { type: String },
        updatedAt: { type: Date }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
