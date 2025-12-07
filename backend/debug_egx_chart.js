const yahooFinance = require('yahoo-finance2').default;

async function testEGX() {
    console.log('Testing ^CASE30 for different ranges...');
    const ranges = ['1mo', '3mo', '6mo', 'ytd', '1y', '5y', 'max'];

    for (const range of ranges) {
        try {
            const queryOptions = {
                period1: '2020-01-01',
                range: range,
                interval: ['1mo', '3mo', 'ytd', '1y', '5y', 'max'].includes(range) ? '1d' : '15m',
                includePrePost: false
            };
            // Adjust interval for long ranges to avoid "too many data points" or similar if needed
            if (range === '5y' || range === 'max') queryOptions.interval = '1wk';

            console.log(`Fetching ${range} for ^EGX30.CA...`);
            const result = await yahooFinance.chart('^EGX30.CA', queryOptions);
            const quotes = result.quotes || [];
            console.log(`Success ${range}: ${quotes.length} quotes. Last: ${quotes.length > 0 ? JSON.stringify(quotes[quotes.length - 1]) : 'N/A'}`);
        } catch (e) {
            console.error(`Failed ${range}: ${e.message}`);
        }
    }
}

testEGX();
