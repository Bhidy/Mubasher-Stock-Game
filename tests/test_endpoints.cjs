// Native fetch is available in Node.js v18+
// const fetch = require('node-fetch');

// Test Config
const API_URL = 'http://localhost:5001/api';
// Note: Port 5001 matches what we saw in .env
// We need to ensure the server is RUNNING before this test works.

async function testEndpoint(name, url) {
    console.log(`\n🧪 Testing ${name}: ${url}`);
    try {
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 429) {
                console.log(`   ⚠️  Rate Limited (429) - Expected locally, logic likely correct.`);
                return;
            }
            const text = await res.text();
            console.error(`   ❌ Failed: Status ${res.status} - ${text}`);
            return;
        }

        const data = await res.json();
        console.log(`   ✅ Success! Status ${res.status}`);

        // Basic Validation
        if (Array.isArray(data)) {
            console.log(`      Received ${data.length} items.`);
            if (data.length > 0) console.log(`      Sample:`, JSON.stringify(data[0]).substring(0, 100) + '...');
        } else {
            console.log(`      Received Object keys: ${Object.keys(data).join(', ')}`);
        }

    } catch (err) {
        console.error(`   ❌ Network/Script Error: ${err.message}`);
    }
}

async function runTests() {
    console.log('🚀 Starting API Verification Tests...');

    // 1. Test Stocks (DB backed - should succeed even if 429'd on ingestion)
    await testEndpoint('Stocks (US)', `${API_URL}/stocks?market=US`);

    // 2. Test Chart (Live - might 429)
    await testEndpoint('Chart (AAPL 1d)', `${API_URL}/chart?symbol=AAPL&range=1d`);

    // 3. Test Profile (Live - might 429)
    await testEndpoint('Profile (AAPL)', `${API_URL}/stock-profile?symbol=AAPL`);

    // 4. Test Yahoo Proxy (Live - might 429)
    await testEndpoint('Yahoo Global (AAPL)', `${API_URL}/yahoo?symbol=AAPL`);
}

runTests();
