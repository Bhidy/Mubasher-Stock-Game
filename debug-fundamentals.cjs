const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
console.info = () => { };

async function testFundamentals(symbol) {
    console.log(`Checking ${symbol}...`);
    try {
        const result = await yahooFinance.fundamentalsTimeSeries(symbol, {
            period1: '2020-01-01',
            module: 'annualTotalRevenue'
        });
        console.log('Fundamentals Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.log('Fundamentals Failed:', e.message);
    }
}

async function run() {
    await testFundamentals('COMI.CA');
}

run();
