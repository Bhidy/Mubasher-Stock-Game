const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Suppress console.info
const originalConsoleInfo = console.info;
console.info = () => { };

async function debugStock(symbol) {
    console.log(`\n\n=== DEBUGGING ${symbol} ===`);
    try {
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: [
                'assetProfile',
                'financialData',
                'defaultKeyStatistics',
                'summaryDetail',
                'price' // Added price module
            ]
        });

        const quote = await yahooFinance.quote(symbol);

        // --- Output ---
        const s = result.summaryDetail || {};
        const d = result.defaultKeyStatistics || {};
        const f = result.financialData || {};
        const p = result.price || {};

        console.log(`Price: ${quote.regularMarketPrice}`);
        console.log(`Open: ${s.open} (Quote: ${quote.regularMarketOpen})`);
        console.log(`High: ${s.dayHigh} (Quote: ${quote.regularMarketDayHigh})`);
        console.log(`Low: ${s.dayLow} (Quote: ${quote.regularMarketDayLow})`);
        console.log(`Prev Close: ${s.previousClose} (Quote: ${quote.regularMarketPreviousClose})`);
        console.log(`Volume: ${s.volume?.fmt} (Quote: ${quote.regularMarketVolume})`);
        console.log(`Avg Vol: ${s.averageVolume?.fmt} (Quote: ${quote.averageDailyVolume10Day})`); // Fixed key

        console.log(`Market Cap: ${s.marketCap?.fmt || quote.marketCap}`);
        console.log(`Trailing PE: ${s.trailingPE?.fmt || quote.trailingPE}`);
        console.log(`Forward PE: ${d.forwardPE?.fmt || quote.forwardPE}`);

        console.log(`Revenue: ${f.totalRevenue?.fmt}`);
        console.log(`Shares Outstanding: ${d.sharesOutstanding?.fmt}`);
        console.log(`Float: ${d.floatShares?.fmt}`);
        console.log(`Short: ${d.sharesShort?.fmt}`);

    } catch (e) {
        console.error(e.message);
    }
}

async function run() {
    await debugStock('COMI.CA');
    await debugStock('2222.SR');
}
run();
