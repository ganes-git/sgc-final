import ingestionOracle from '../utils/ingestion-oracle.js';
import entropyCalculator from '../utils/entropy-calculator.js';

export async function onRequestPost({ request }) {
    try {
        const body = await request.json();
        const inputData = body.data;

        if (!inputData) {
            return new Response(JSON.stringify({ error: 'Missing input data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('--- Analyzing Data (Edge) ---');
        const dataPacket = await ingestionOracle.ingest(inputData);
        const entropy = entropyCalculator.calculate(dataPacket.content);
        const isDarkData = entropyCalculator.isDarkData(entropy);

        return new Response(JSON.stringify({
            status: 'ANALYZED',
            entropy_score: entropy,
            is_dark_data: isDarkData,
            message: isDarkData ? 'Dark Data Detected. Dissolution Recommended.' : 'Active Data. No action needed.'
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
