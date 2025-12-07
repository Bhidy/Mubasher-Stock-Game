const yahooFinance = require('yahoo-finance2').default;

async function test() {
    console.log('Testing ^EGX30.CA history...');
    try {
        const queryOptions = {
            period1: '2023-01-01',
            range: '1y',
            interval: '1d'
        };
        const result = await yahooFinance.chart('^EGX30.CA', queryOptions);
        console.log(`^EGX30.CA 1Y: ${result.quotes.length} points.`);
        if (result.quotes.length > 0) {
            console.log('Last:', result.quotes[result.quotes.length - 1]);
        }
    } catch (e) {
        console.error('^EGX30.CA Failed:', e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

test();
