const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));

// Core Modules
const ingestionOracle = require('./dissolution-engine/ingestion-oracle');
const entropyCalculator = require('./dissolution-engine/entropy-calculator');
const semanticDistiller = require('./dissolution-engine/semantic-distiller');
const antigravitySDK = require('./antigravity-sdk');
const dissolutionTrigger = require('./dissolution-engine/dissolution-trigger');
const rateLimiter = require('./middleware/rate-limiter');

const fs = require('fs');

// Middleware
app.use(rateLimiter);

// API Key Verification
const API_KEY = process.env.API_KEY;
app.use((req, res, next) => {
    // Skip auth for OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') return next();

    const clientKey = req.headers['x-api-key'];
    if (clientKey && clientKey === API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
});

// Mount routes on router
router.post('/analyze', async (req, res) => {
    try {
        const inputData = req.body.data;
        // In this demo, we handle raw content. File upload would pass base64 or similar.
        // For simplicity, we assume text or base64 text for now.

        console.log('--- Analyzing Data ---');
        const dataPacket = await ingestionOracle.ingest(inputData);
        const entropy = entropyCalculator.calculate(dataPacket.content);
        const isDarkData = entropyCalculator.isDarkData(entropy);

        res.json({
            status: 'ANALYZED',
            entropy_score: entropy,
            is_dark_data: isDarkData,
            message: isDarkData ? 'Dark Data Detected. Dissolution Recommended.' : 'Active Data. No action needed.'
        });
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Step 2: Distill (Dissolution) ---
router.post('/distill', async (req, res) => {
    try {
        const inputData = req.body.data;
        const entropyScore = req.body.entropy_score; // Pass score from client for this demo flow

        console.log('--- Distilling Data ---');

        // Re-ingest to be safe (stateless in this simple demo)
        const dataPacket = await ingestionOracle.ingest(inputData);

        // 3. Semantic Distillation (Vector Distillation with Gemini 3)
        const distilled = await semanticDistiller.distill(dataPacket, entropyScore);

        // 4. Ledger Storage (Immutable Ledger)
        const txHash = await antigravitySDK.commitToImmutableLedger(distilled.vectorEmbedding);

        res.json({
            status: 'DISSOLVED',
            vector_ledger_tx: txHash,
            original_size: dataPacket.content.length,
            distilled_size: distilled.distilledSize, // Use explicit size from distiller (handles vector replacement)
            reduction_ratio: distilled.reductionRatio
        });
    } catch (error) {
        console.error('Distillation Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mount the router
app.use('/api', router);
app.use('/.netlify/functions/api', router); // For Netlify Functions path

// Export for serverless
module.exports = app;

// Only listen if running directly (local dev)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
