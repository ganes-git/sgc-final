/**
 * Semantic Distiller
 * Responsibilities:
 * - 'Distill' the content based on entropy score.
 * - Remove 'garbage' semantically (filtering noise).
 */

const antigravitySDK = require('../antigravity-sdk');

class SemanticDistiller {
    constructor() { }

    /**
     * Distills the content and vectorizes it.
     * @param {object} dataPacket 
     * @param {number} entropyScore 
     * @returns {object} Distilled result with vector embedding
     */
    async distill(dataPacket, entropyScore) {
        console.log(`[SemanticDistiller] Distilling with entropy factor: ${entropyScore}`);

        const originalText = dataPacket.content;

        // 1. Semantic Analysis
        // If entropy is low (< 3.5), we treat it as "Dark Data" and fully dissolve it into the vector.
        const isDarkData = entropyScore < 3.5;

        let distilledContent;
        let distilledSize;

        // 2. Vector Distillation (Gemini 3 via SDK)
        // We always vectorize, as the vector is the "ghost" of the data.
        // For simulation, we create a mock vector first to know its "size".
        const vector = await antigravitySDK.vectorizeGemini3(originalText.substring(0, 100)); // Vectorize header/sample

        if (isDarkData) {
            console.log('[SemanticDistiller] Dark Data detected. Dissolving to pure vector state.');
            // content is REPLACED by the vector.
            // Vector dimensionality: 1536 floats. 
            // In a real system, this might be 1536 * 4 bytes = ~6KB, or compressed to ~4KB as per prompt requirement.
            distilledSize = 4096; // 4KB fixed for this simulation requirement
            distilledContent = "[DISSOLVED_TO_VECTOR_LEDGER]";
        } else {
            console.log('[SemanticDistiller] High entropy data. Performing standard compression.');
            const words = originalText.split(/\s+/);
            const threshold = entropyScore > 50 ? 4 : 2;
            distilledContent = words.filter(w => w.length >= threshold).join(' ');
            distilledSize = distilledContent.length;
        }

        return {
            original: originalText,
            distilled: distilledContent, // This might be just the marker or the compressed text
            // Vital: we override the size for the response to reflect the vector size if dissolved
            distilledSize: distilledSize,
            reductionRatio: (originalText.length - distilledSize) / originalText.length,
            vectorEmbedding: vector
        };
    }
}

module.exports = new SemanticDistiller();
