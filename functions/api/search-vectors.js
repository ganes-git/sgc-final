import antigravitySDK from '../utils/antigravity-sdk.js';

export async function onRequestPost({ request }) {
    try {
        const body = await request.json();
        const query = body.query;

        if (!query) {
            return new Response(JSON.stringify({ error: 'Missing search query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('--- Vector Search (Edge) ---');
        const results = await antigravitySDK.searchVectors(query);

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            results: results
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
