/**
 * Dissolution Trigger
 * Responsibilities:
 * - Securely delete the raw source file (overwrite + unlink).
 * - Create a Stub file pointer for semantic retrieval.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const stat = util.promisify(fs.stat);

class DissolutionTrigger {
    constructor() { }

    /**
     * Securely dissolves a file and leaves a stub.
     * @param {string} filePath - Absolute path to the file.
     * @param {string} txHash - Vector Ledger transaction hash.
     * @param {object} meta - Additional metadata.
     */
    async dissolve(filePath, txHash, meta) {
        console.log(`[DissolutionTrigger] Initiating dissolution for: ${filePath}`);

        try {
            // 1. Verify file exists
            await stat(filePath);

            // 2. Mock Secure Deletion: Overwrite with random bytes
            // In a real scenario, we might do multiple passes (DoD 5220.22-M)
            const fileSize = (await stat(filePath)).size;
            const randomBuffer = crypto.randomBytes(fileSize);
            await writeFile(filePath, randomBuffer);
            console.log('[DissolutionTrigger] File overwritten with entropy.');

            // 3. Delete the file
            await unlink(filePath);
            console.log('[DissolutionTrigger] File unlinked.');

            // 4. Create Stub
            const stubPath = filePath + '.stub';
            const stubContent = JSON.stringify({
                original_path: filePath,
                dissolved_at: new Date().toISOString(),
                ledger_tx: txHash,
                meta: meta,
                vector_retrieval_pointer: `antigravity://${txHash}`
            }, null, 2);

            await writeFile(stubPath, stubContent);
            console.log(`[DissolutionTrigger] Stub created at: ${stubPath}`);

            return {
                status: 'DISSOLVED',
                stub: stubPath
            };

        } catch (error) {
            console.error('[DissolutionTrigger] Error during dissolution:', error);
            // Don't throw, just return error status so process doesn't crash
            return { status: 'ERROR', error: error.message };
        }
    }
}

// Simple crypto polyfill for random bytes if needed, but Node 'crypto' is standard
const crypto = require('crypto');

module.exports = new DissolutionTrigger();
