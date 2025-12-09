const yahooFinance = require('yahoo-finance2').default;

// Suppress console.info from yahoo-finance2
const originalConsoleInfo = console.info;
console.info = () => { };

async function debugStock() {
    try {
        const symbol = 'COMI.CA';
        console.log(`Fetching ${symbol}...`);

        // Use standard quote
        const quote = await yahooFinance.quote(symbol);
        console.log('--- QUOTE ---');
        console.log(JSON.stringify(quote, null, 2));

        const summary = await yahooFinance.quoteSummary(symbol, {
            modules: [
                'assetProfile',
                'financialData',
                'defaultKeyStatistics',
                'summaryDetail',
                'earnings'
            ]
        });
        console.log('--- SUMMARY ---');
        console.log(JSON.stringify(summary, null, 2));

    } catch (e) {
        // Restore console.info before error
        console.info = originalConsoleInfo;
        console.error(e);
    }
}

debugStock();
