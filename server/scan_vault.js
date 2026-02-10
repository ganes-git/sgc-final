/**
 * Vault Scanner (Dry Run)
 * Scans a directory for 'Dark Data', calculates entropy, and generates vector embeddings.
 * Does NOT delete files (Dry Run mode).
 */

const fs = require('fs');
const path = require('path');
const entropyCalculator = require('./dissolution-engine/entropy-calculator');
const semanticDistiller = require('./dissolution-engine/semantic-distiller');
const antigravitySDK = require('./antigravity-sdk');
const ingestionOracle = require('./dissolution-engine/ingestion-oracle');

const VAULT_DIR = path.join(__dirname, '../test_vault');

async function scanVault() {
    console.log(`[Scanner] Starting Dry Run scan of: ${VAULT_DIR}`);

    if (!fs.existsSync(VAULT_DIR)) {
        console.error(`[Scanner] Error: Vault directory not found at ${VAULT_DIR}`);
        return;
    }

    const files = fs.readdirSync(VAULT_DIR);
    console.log(`[Scanner] Found ${files.length} files.`);

    for (const file of files) {
        const filePath = path.join(VAULT_DIR, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) continue;

        console.log(`\n--- Analyzing: ${file} ---`);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 1. Ingestion
        const dataPacket = await ingestionOracle.ingest(content);

        // 2. Entropy
        const entropy = entropyCalculator.calculate(dataPacket.content);
        const isDarkData = entropyCalculator.isDarkData(entropy);

        console.log(`[Scanner] Entropy Score: ${entropy.toFixed(4)}`);

        if (isDarkData) {
            console.log(`[Scanner] STATUS: DARK DATA DETECTED. Initiating Semantic Distillation...`);

            // 3. Distillation & Vectorization
            const distilled = await semanticDistiller.distill(dataPacket, entropy);

            // 4. Ledger (Dry Run - just logging)
            // We commit to get the hash but we don't trigger dissolution
            const txHash = await antigravitySDK.commitToImmutableLedger(distilled.vectorEmbedding);

            console.log(`[Scanner] DRY RUN SUCCESS:`);
            console.log(`          - Vector Embedding Created (Dim: ${distilled.vectorEmbedding.length})`);
            console.log(`          - Ledger Transaction Hash: ${txHash}`);
            console.log(`          - File retained (Dissolution skipped).`);
        } else {
            console.log(`[Scanner] STATUS: Active Data. Skipping dissolution.`);
        }
    }
    console.log('\n[Scanner] Scan Complete.');
}

scanVault().catch(err => console.error(err));
