const yahooFinance = require('yahoo-finance2').default;

async function debugIndices() {
    console.log('--- Debugging Market Indices ---');
    const indices = ['^TASI.SR', '^EGX30.CA', '^DJI'];

    for (const symbol of indices) {
        try {
            const quote = await yahooFinance.quote(symbol);
            console.log(`\nSymbol: ${symbol}`);
            console.log(`Price: ${quote.regularMarketPrice}`);
            console.log(`PrevClose: ${quote.regularMarketPreviousClose}`);
            console.log(`Open: ${quote.regularMarketOpen}`);
            console.log(`Volume: ${quote.regularMarketVolume}`);
            console.log(`AvgVol(3m): ${quote.averageDailyVolume3Month}`);

            // Raw JSON to see what fields are available
            // console.log(JSON.stringify(quote, null, 2));

        } catch (e) {
            console.error(`Failed to fetch ${symbol}: ${e.message}`);
        }
    }
}

debugIndices();
