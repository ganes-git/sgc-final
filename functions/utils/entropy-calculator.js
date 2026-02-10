/**
 * Entropy Calculator
 * Responsibilities:
 * - Calculate complexity/entropy of the ingested data.
 * - This metric determines how much "dissolution" is needed.
 */

import { Buffer } from 'node:buffer';

export class EntropyCalculator {
    /**
     * Calculates Shannon Entropy H(X).
     * @param {string|Buffer} input - Data block to analyze.
     * @returns {number} Shannon Entropy value (bits per symbol).
     */
    calculate(input) {
        console.log('[EntropyCalculator] Calculating Shannon Entropy...');

        const data = Buffer.isBuffer(input) ? input : Buffer.from(input);
        const len = data.length;
        if (len === 0) return 0;

        const frequencies = {};
        for (let i = 0; i < len; i++) {
            const byte = data[i];
            frequencies[byte] = (frequencies[byte] || 0) + 1;
        }

        let entropy = 0;
        for (const byte in frequencies) {
            const p = frequencies[byte] / len;
            entropy -= p * Math.log2(p);
        }

        console.log(`[EntropyCalculator] Shannon Entropy: ${entropy.toFixed(4)}`);
        return entropy;
    }

    /**
     * Determines if data is 'Dark Data' based on entropy.
     * @param {number} entropy 
     * @returns {boolean}
     */
    isDarkData(entropy) {
        // Threshold: Low entropy implies repetitive/low-info data (Dark Data).
        // Standard text is usually 3.5-5.0. Random/Compressed is close to 8.
        return entropy < 3.5;
    }
}

export default new EntropyCalculator();
