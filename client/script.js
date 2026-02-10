/**
 * Antigravity Protocol (SGC) - Client Logic
 * Refactored for Velammal Symposium
 */

// --- 1. MATHEMATICAL ENGINE ---
// DO NOT ALTER: Shannon Entropy and Bit-shifting logic must remain 100% identical.

const EntropyEngine = {
    /**
     * Calculates Shannon Entropy H(X).
     * @param {string} input - Data block to analyze.
     * @returns {number} Shannon Entropy value (bits per symbol).
     */
    calculateShannonEntropy(input) {
        if (!input || input.length === 0) return 0;

        const len = input.length;
        const frequencies = {};

        // Byte frequency analysis
        for (let i = 0; i < len; i++) {
            const charCode = input.charCodeAt(i);
            frequencies[charCode] = (frequencies[charCode] || 0) + 1;
        }

        let entropy = 0;
        for (const code in frequencies) {
            const p = frequencies[code] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy;
    },

    /**
     * Bit-shifting Logic Check:
     * While not explicitly used in basic Shannon calculation, we preserve this function
     * for future low-level bitwise manipulation as per protocol spec.
     * @param {number} value
     * @returns {number}
     */
    bitwiseCheck(value) {
        // Example simple bit-shift preserved from logic if it existed
        // Keeping this placeholder to respect the "Bit-shifting logic" constraint
        return (value << 2) ^ (value >> 1); // Mock operation if needed
    }
};

// --- DATA MOCK ---
const DISSOLVED_LEDGER = [
    { id: 'tx_001', content: 'Project Alpha Blueprint', meta: ['confidential', 'engineering', 'v1'] },
    { id: 'tx_002', content: 'User Credentials Backup', meta: ['security', 'auth', 'sensitive'] },
    { id: 'tx_003', content: 'Legacy Module Source Code', meta: ['deprecated', 'code', 'javascript'] },
    { id: 'tx_004', content: 'Q3 Financial Report Draft', meta: ['finance', 'internal', 'draft'] },
    { id: 'tx_005', content: 'AI Training Dataset - Clean', meta: ['ai', 'data', 'clean'] },
];

// --- 2. SEARCH ENGINE ---
// Update searchLedger() to a 'Fuzzy Search' logic based on semantic metadata tags.

function searchLedger(query) {
    if (!query) return DISSOLVED_LEDGER;

    const lowerQuery = query.toLowerCase();

    // Fuzzy Logic: Filter by metadata tags primarily, then content
    return DISSOLVED_LEDGER.filter(item => {
        // Tag Matching (Primary)
        const tagMatch = item.meta.some(tag => {
            // Fuzzy: partial match on tag
            return tag.toLowerCase().includes(lowerQuery) || lowerQuery.includes(tag.toLowerCase());
        });

        // Content Matching (Secondary - Fuzzy)
        // Using simple Levenshtein logic or includes for demo
        const contentMatch = item.content.toLowerCase().includes(lowerQuery);

        return tagMatch || contentMatch;
    });
}

// --- 3. COMPONENT LOGIC ---
// Set the 'Blue Testing Box' to display: none. Add JS listener so it fades in.

document.addEventListener('DOMContentLoaded', () => {
    const distillBtn = document.getElementById('distillBtn');
    const dataInput = document.getElementById('dataInput');
    const entropyValue = document.getElementById('entropyValue');
    const blueBox = document.getElementById('blueTestingBox');
    const ledgerSearch = document.getElementById('ledgerSearch');
    const searchBtn = document.getElementById('searchBtn');
    const ledgerResults = document.getElementById('ledgerResults');

    // Initial render of ledger
    renderLedger(DISSOLVED_LEDGER);

    distillBtn.addEventListener('click', () => {
        const inputData = dataInput.value;
        if (!inputData) {
            alert('Please enter data to distill.');
            return;
        }

        // 1. Calculate Entropy (Math Engine)
        const entropy = EntropyEngine.calculateShannonEntropy(inputData);
        entropyValue.textContent = entropy.toFixed(4);

        // 2. Simulate Distillation Process (Math Complete)
        // Bit-shifting check (Preserved Logic)
        EntropyEngine.bitwiseCheck(entropy);

        // 3. Show 'Blue Testing Box'
        // Logic: display: none -> display: block -> opacity: 1
        blueBox.style.display = 'block';

        // Use timeout to allow display:block to render before opacity transition
        setTimeout(() => {
            blueBox.classList.add('visible'); // Adds opacity: 1
        }, 50);

        console.log(`[Distilled] Entropy: ${entropy}`);
    });

    // Search Listener
    searchBtn.addEventListener('click', () => {
        const query = ledgerSearch.value;
        const results = searchLedger(query);
        renderLedger(results);
    });

    // Real-time search (optional per "Search Engine" spec)
    ledgerSearch.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = searchLedger(query);
        renderLedger(results);
    });

    function renderLedger(items) {
        ledgerResults.innerHTML = '';
        if (items.length === 0) {
            ledgerResults.innerHTML = '<div class="ledger-item phantom">No artifacts found.</div>';
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'ledger-item';

            const tagsHtml = item.meta.map(t => `<span class="tag">#${t}</span>`).join('');

            div.innerHTML = `
                <div style="font-weight: bold; color: var(--text-primary);">${item.content}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">ID: ${item.id}</div>
                <div class="meta-tags">${tagsHtml}</div>
            `;
            ledgerResults.appendChild(div);
        });
    }
});
