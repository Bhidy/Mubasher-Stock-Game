const yahooFinance = require('yahoo-finance2').default;

async function testChartFetch(symbol) {
    console.log(`Testing chart fetch for: ${symbol}`);
    try {
        const queryOptions = {
            period1: '2023-01-01', // Validation requirement test
            range: '1d',
            interval: '5m',
            includePrePost: false
        };
        const result = await yahooFinance.chart(symbol, queryOptions);
        console.log(`Success ${symbol}: ${result.quotes ? result.quotes.length : 0} quotes`);
        if (result.quotes && result.quotes.length > 0) {
            console.log('Sample:', result.quotes[0]);
        }
    } catch (error) {
        console.error(`Failed ${symbol}:`, error.message);
        if (error.errors) console.error(JSON.stringify(error.errors, null, 2));
    }
}

async function run() {
    await testChartFetch('^TASI.SR');
    await testChartFetch('^CASE30');
    await testChartFetch('^DJI');
}

run();
