const { YahooFinance } = require('yahoo-finance2');
const yahooFinance = new YahooFinance();

// Suppress console.info from yahoo-finance2
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
                'summaryDetail', // Vital for price/volume
                'quoteType',
                'calendarEvents',
                'earnings'
            ]
        });

        const quote = await yahooFinance.quote(symbol);

        // Helper to check values
        const check = (label, val, raw) => {
            console.log(`${label.padEnd(25)}: ${val ?? 'N/A'} (Raw: ${raw ? JSON.stringify(raw) : 'N/A'})`);
        };

        const s = result.summaryDetail || {};
        const d = result.defaultKeyStatistics || {};
        const f = result.financialData || {};

        console.log('--- Price / Volume ---');
        check('Price', quote.regularMarketPrice, s.previousClose);
        check('Volume', quote.regularMarketVolume, s.volume);

        console.log('--- Valuation ---');
        check('Market Cap', quote.marketCap, s.marketCap);
        check('Trailing PE', quote.trailingPE, s.trailingPE);

        console.log('--- Financials ---');
        check('Total Revenue', f.totalRevenue?.fmt, f.totalRevenue);
        check('Total Cash', f.totalCash?.fmt, f.totalCash);
        check('Total Debt', f.totalDebt?.fmt, f.totalDebt);

        console.log('--- Ownership ---');
        check('Shares Outstanding', d.sharesOutstanding?.fmt, d.sharesOutstanding);
        check('Float Shares', d.floatShares?.fmt, d.floatShares);

    } catch (e) {
        console.error(`FAILED ${symbol}:`, e.message);
        if (e.errors) console.error(e.errors);
    }
}

async function run() {
    await debugStock('AAPL');    // US
    await debugStock('2222.SR'); // Saudi
    await debugStock('COMI.CA'); // Egypt
}

run();
