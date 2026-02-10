import ingestionOracle from '../utils/ingestion-oracle.js';
import semanticDistiller from '../utils/semantic-distiller.js';
import antigravitySDK from '../utils/antigravity-sdk.js';

export async function onRequestPost({ request }) {
    try {
        const body = await request.json();
        const inputData = body.data;
        const entropyScore = body.entropy_score;

        console.log('--- Distilling Data (Edge) ---');

        // Re-ingest (stateless)
        const dataPacket = await ingestionOracle.ingest(inputData);

        // 3. Semantic Distillation
        const distilled = await semanticDistiller.distill(dataPacket, entropyScore);

        // 4. Ledger Storage (Immutable Ledger)
        const txHash = await antigravitySDK.commitToImmutableLedger(distilled.vectorEmbedding);

        return new Response(JSON.stringify({
            status: 'DISSOLVED',
            vector_ledger_tx: txHash,
            original_size: dataPacket.content.length,
            distilled_size: distilled.distilledSize,
            reduction_ratio: distilled.reductionRatio
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
