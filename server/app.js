console.log("Starting server boot...");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));

console.log("Loading modules...");
const ingestionOracle = require('./dissolution-engine/ingestion-oracle');
const entropyCalculator = require('./dissolution-engine/entropy-calculator');
const semanticDistiller = require('./dissolution-engine/semantic-distiller');
const antigravitySDK = require('./antigravity-sdk');
try {
    const dissolutionTrigger = require('./dissolution-engine/dissolution-trigger');
    console.log("DissolutionTrigger OK");
} catch (e) { console.error("DissolutionTrigger Failed", e); }

try {
    const rateLimiter = require('./middleware/rate-limiter');
    console.log("RateLimiter OK");
    app.use(rateLimiter);
} catch (e) { console.error("RateLimiter Failed", e); }


const fs = require('fs');

// API Key Verification
const API_KEY = process.env.API_KEY;
app.use((req, res, next) => {
    const clientKey = req.headers['x-api-key'];
    if (clientKey && clientKey === API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const inputData = req.body.data;
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

app.post('/api/distill', async (req, res) => {
    try {
        const inputData = req.body.data;
        const entropyScore = req.body.entropy_score;
        console.log('--- Distilling Data ---');
        const dataPacket = await ingestionOracle.ingest(inputData);
        const distilled = await semanticDistiller.distill(dataPacket, entropyScore);
        const txHash = await antigravitySDK.commitToImmutableLedger(distilled.vectorEmbedding);
        res.json({
            status: 'DISSOLVED',
            vector_ledger_tx: txHash,
            original_size: dataPacket.content.length,
            distilled_size: distilled.distilled.length,
            reduction_ratio: distilled.reductionRatio
        });
    } catch (error) {
        console.error('Distillation Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
