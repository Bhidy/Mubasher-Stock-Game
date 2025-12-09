const yahooFinance = require('yahoo-finance2').default;

async function run() {
    try {
        const q = await yahooFinance.quote('AAPL');
        console.log('AAPL Price:', q.regularMarketPrice);

        const q2 = await yahooFinance.quote('COMI.CA');
        console.log('COMI.CA Price:', q2.regularMarketPrice);
    } catch (e) {
        console.error('Error:', e);
    }
}
run();
