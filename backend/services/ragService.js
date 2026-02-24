const fs = require('fs');
const path = require('path');
const faiss = require('faiss-node');
const embeddingService = require('./embeddingService');

let index = null;
let chunks = [];

const indexDir = path.join(__dirname, '../rag/index');

const loadIndex = () => {
    try {
        const indexPath = path.join(indexDir, 'faiss.index');
        const chunksPath = path.join(indexDir, 'chunks.json');
        if (fs.existsSync(indexPath) && fs.existsSync(chunksPath)) {
            index = faiss.IndexFlatL2.read(indexPath);
            chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
            console.log('FAISS index loaded.');
        } else {
            console.log('FAISS index not found. Using simple text search fallback.');
        }
    } catch (e) {
        console.error('Error loading FAISS index:', e);
    }
};

// Load on startup
loadIndex();

exports.retrieve = async (query, accounts = [], topK = 5) => {
    if (!index || chunks.length === 0) {
        // Fallback if index not ingested yet
        const rawMock = fs.readFileSync(path.join(__dirname, '../rag/sources/digital_platforms.txt'), 'utf8');
        return [{ text: rawMock, source: 'digital_platforms.txt', accountType: 'General' }];
    }

    try {
        const queryVector = await embeddingService.embed(query);
        const { distances, labels } = index.search(queryVector, topK * 2);

        let results = [];
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] !== -1 && chunks[labels[i]]) {
                results.push(chunks[labels[i]]);
            }
        }

        // Optional: filter by accounts
        // ...

        return results.slice(0, topK);
    } catch (e) {
        console.error('Retrieval error:', e);
        return [];
    }
};
