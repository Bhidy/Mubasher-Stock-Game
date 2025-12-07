const yahooFinance = require('yahoo-finance2').default;

async function testChart() {
    const symbol = '^CASE30'; // Test with our problematic one too
    try {
        const result = await yahooFinance.chart(symbol, {
            period1: "2023-01-01", // Or just use range string if supported by the library's specific method overload, but standard queryOptions often take period1/period2 or range
            // yahoo-finance2 queryOptions: { period1, period2, interval, includePrePost, range }
            range: '1d',
            interval: '15m'
        });
        console.log(`Chart data for ${symbol}: ${result.quotes.length} points`);
        console.log(result.quotes[0]);
    } catch (e) {
        console.error(e);
    }
}

testChart();
