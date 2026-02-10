const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

export const analyzeData = async (data) => {
    const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data })
    });

    if (!response.ok) {
        if (response.status === 429) throw new Error('Rate Limit Exceeded. Please wait.');
        throw new Error(`Analysis Failed: ${response.statusText}`);
    }
    return response.json();
};

export const distillData = async (data, entropyScore) => {
    const response = await fetch(`${API_BASE}/distill`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data, entropy_score: entropyScore })
    });

    if (!response.ok) {
        if (response.status === 429) throw new Error('Rate Limit Exceeded. Please wait.');
        throw new Error(`Distillation Failed: ${response.statusText}`);
    }
    return response.json();
};

export const searchVectors = async (query) => {
    const response = await fetch(`${API_BASE}/search-vectors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`Vector Search Failed: ${response.statusText}`);
    }
    return response.json();
};
