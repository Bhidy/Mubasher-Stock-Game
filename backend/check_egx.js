const yahooFinance = require('yahoo-finance2').default;

async function checkEgx() {
    console.log('--- Checking EGX Tickers ---');
    const tickers = ['^CASE30', 'CASE30.CA', '^EGX30.CA']; // Check candidates

    for (const t of tickers) {
        try {
            const q = await yahooFinance.quote(t);
            console.log(`${t} Price: ${q.regularMarketPrice} (${q.shortName})`);
        } catch (e) {
            console.log(`${t} Failed: ${e.message}`);
        }
    }
}

checkEgx();
