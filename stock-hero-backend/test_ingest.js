const fetch = require('node-fetch');

async function testIngest() {
    console.log('🚀 Triggering Ingestion Protocol via Localhost...');
    try {
        const res = await fetch('http://localhost:3000/api/ingest?key=UpdateMe2026', {
            method: 'POST'
        });
        const data = await res.json();
        console.log('✅ Ingestion Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ Trigger Error:', err.message);
    }
}

testIngest();
