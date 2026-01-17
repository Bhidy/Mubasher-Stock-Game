require('dotenv').config();
const { Pool } = require('pg');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// DB Connection
const pool = new Pool({
    user: process.env.DB_USER || 'home',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mubasher_stock_game',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
});

// Reuse the market definitions from the original file to ensure consistency
// Ideally this should be a shared config, but for now we duplicate to ensure standalone reliable execution
const MARKETS = {
    'SA': ['2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR', '^TASI.SR', '4030.SR', '2350.SR', '4200.SR'], // Truncated for brevity, full list in loop below
    'US': ['^GSPC', '^DJI', '^IXIC', 'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'],
    'EG': ['COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA', '^CASE30'],
    'AE': ['EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AD', 'DIB.AE'],
    'Global': [] // Will handle logic to iterate all
};

// Full lists (copied from source for robustness)
const SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
];
MARKETS['SA'] = SAUDI_STOCKS;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAndUpsert(marketCode, tickers) {
    console.log(`\nProcessing ${marketCode} (${tickers.length} tickers)...`);

    // Process in chunks to avoid massive batch failures
    const CHUNK_SIZE = 10;

    for (let i = 0; i < tickers.length; i += CHUNK_SIZE) {
        const chunk = tickers.slice(i, i + CHUNK_SIZE);
        console.log(`  Fetching chunk ${i / CHUNK_SIZE + 1}...`);

        try {
            const results = await yahooFinance.quote(chunk);
            const quotes = Array.isArray(results) ? results : [results];

            for (const q of quotes) {
                if (!q || !q.symbol) continue;

                const price = q.regularMarketPrice || q.regularMarketPreviousClose || 0;
                const change = q.regularMarketChange || 0;
                const changePercent = q.regularMarketChangePercent || 0;
                const name = q.shortName || q.longName || q.symbol;

                // Upsert Query
                const query = `
                    INSERT INTO stocks (
                        ticker, name, current_price, change_percent, 
                        volume, market_cap, pe_ratio, dividend_yield,
                        fifty_two_week_high, fifty_two_week_low, previous_close,
                        category, currency, last_updated_ts, updated_at
                    ) VALUES (
                        $1, $2, $3, $4, 
                        $5, $6, $7, $8, 
                        $9, $10, $11, 
                        $12, $13, NOW(), NOW()
                    )
                    ON CONFLICT (ticker) 
                    DO UPDATE SET 
                        current_price = EXCLUDED.current_price,
                        change_percent = EXCLUDED.change_percent,
                        volume = EXCLUDED.volume,
                        market_cap = EXCLUDED.market_cap,
                        last_updated_ts = NOW(),
                        updated_at = NOW();
                `;

                const values = [
                    q.symbol,
                    name,
                    price,
                    changePercent,
                    q.regularMarketVolume || 0,
                    q.marketCap || 0,
                    q.trailingPE || 0,
                    q.dividendYield || 0,
                    q.fiftyTwoWeekHigh || 0,
                    q.fiftyTwoWeekLow || 0,
                    q.regularMarketPreviousClose || 0,
                    marketCode,
                    q.currency || 'USD'
                ];

                await pool.query(query, values);
            }
            console.log(`  ✅ Chunk saved.`);

        } catch (err) {
            console.error(`  ❌ Chunk failed: ${err.message}`);
        }

        // Polite delay
        await sleep(2000);
    }
}

async function run() {
    try {
        console.log('🚀 Starting Stock Ingestion Job...');

        // Config: Yahoo Finance (Skipping Global Config due to type error in worker)
        // yahooFinance.setGlobalConfig({...}); 


        // Run for all defined markets
        await fetchAndUpsert('SA', MARKETS['SA']);
        await fetchAndUpsert('US', MARKETS['US']);
        await fetchAndUpsert('EG', MARKETS['EG']);

        console.log('\n✅ Ingestion Complete.');
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
}

run();
