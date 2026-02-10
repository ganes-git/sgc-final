/**
 * Ingestion Oracle
 * Responsibilities: 
 * - Validate and sanitize input data.
 * - Prepare data for the Entropy Calculator.
 */

class IngestionOracle {
    constructor() { }

    /**
     * Ingests raw data.
     * @param {string} rawData 
     * @returns {object} Processed data packet
     */
    async ingest(rawData) {
        if (!rawData || typeof rawData !== 'string') {
            throw new Error('Invalid input: Data must be a non-empty string.');
        }

        console.log('[IngestionOracle] processing data...');

        // Basic sanitization (simulated)
        const sanitizedData = rawData.trim();

        return {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            content: sanitizedData,
            meta: {
                source: 'user_input',
                originalLength: rawData.length
            }
        };
    }
}

module.exports = new IngestionOracle();
