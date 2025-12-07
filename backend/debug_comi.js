const yahooFinance = require('yahoo-finance2').default;

async function testCOMI() {
    console.log('Testing COMI.CA history...');
    try {
        const queryOptions = {
            period1: '2023-01-01',
            range: '1y',
            interval: '1d'
        };
        const result = await yahooFinance.chart('COMI.CA', queryOptions);
        console.log(`COMI.CA 1Y: ${result.quotes.length} points.`);
        if (result.quotes.length > 0) {
            console.log('Last:', result.quotes[result.quotes.length - 1]);
        }
    } catch (e) {
        console.error('COMI.CA Failed:', e.message);
    }
}

testCOMI();
