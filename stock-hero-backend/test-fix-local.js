const express = require('express');
const request = require('supertest');
const stocksRoute = require('./routes/stocks');

const app = express();
app.use('/api/stocks', stocksRoute);

async function testMarket(market) {
    console.log(`\nTesting Market: ${market}...`);
    try {
        const res = await request(app).get(`/api/stocks?market=${market}`);
        if (res.status === 200) {
            console.log(`✅ Success for ${market}! Got ${res.body.length} stocks.`);
            if (res.body.length > 0) {
                console.log('Sample:', JSON.stringify(res.body[0], null, 2));
            }
        } else {
            console.error(`❌ Failed for ${market}: Status ${res.status}`, res.body);
        }
    } catch (err) {
        console.error(`❌ Exception for ${market}:`, err.message);
    }
}

async function runTests() {
    await testMarket('US'); // Global
    await testMarket('SA'); // Saudi
    await testMarket('EG'); // Egypt
}

runTests();
