const yahooFinance = require('yahoo-finance2').default;

async function testHistorical(symbol) {
    console.log(`\nTesting .historical() for ${symbol}...`);
    try {
        const queryOptions = {
            period1: '2023-01-01',
            interval: '1d'
        };
        const result = await yahooFinance.historical(symbol, queryOptions);
        console.log(`Found ${result.length} quotes.`);
        if (result.length > 0) {
            console.log('First:', result[0]);
            console.log('Last:', result[result.length - 1]);
        }
    } catch (e) {
        console.error(`Failed: ${e.message}`);
    }
}

async function run() {
    await testHistorical('^CASE30');
    await testHistorical('^EGX30.CA');
}
run();
