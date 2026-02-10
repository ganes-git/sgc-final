const fs = require('fs');
const http = require('http');
const path = require('path');

const TEST_FILE = path.join(__dirname, 'test-garbage.txt');
const TEST_CONTENT = "This is some dark data that needs dissolution. It has low entropy repeats repeats repeats.";

// 1. Create a dummy file
fs.writeFileSync(TEST_FILE, TEST_CONTENT);
console.log(`[Test] Created dummy file: ${TEST_FILE}`);

// 2. Call the API
const postData = JSON.stringify({
    data: TEST_FILE,
    isFilePath: true
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/ingest',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('[Test] Response:', JSON.parse(data));

        // 3. Verify Deletion
        if (!fs.existsSync(TEST_FILE)) {
            console.log('[Test] SUCCESS: Original file deleted.');
        } else {
            console.error('[Test] FAILURE: Original file still exists.');
        }

        // 4. Verify Stub
        if (fs.existsSync(TEST_FILE + '.stub')) {
            console.log('[Test] SUCCESS: Stub file created.');
            console.log('[Test] Stub content:', fs.readFileSync(TEST_FILE + '.stub', 'utf-8'));
        } else {
            console.error('[Test] FAILURE: Stub file not created.');
        }
    });
});

req.on('error', (e) => {
    console.error(`[Test] Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
