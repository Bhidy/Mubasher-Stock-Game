const yahooFinance = require('yahoo-finance2').default;

async function test() {
    const tickers = ['^EGX30', 'EGX30', 'CASE30', '^CASE30'];
    for (const t of tickers) {
        try {
            console.log(`Checking ${t}...`);
            const res = await yahooFinance.chart(t, { range: '1mo' });
            console.log(`${t}: ${res.quotes.length} quotes.`);
        } catch (e) {
            console.log(`${t}: Failed - ${e.message}`);
        }
    }
}
test();
