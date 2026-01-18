const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const YahooFinancePkg = require('yahoo-finance2').default;
const yahooFinance = new YahooFinancePkg({ suppressNotices: ['yahooSurvey'] });

// Helper: Robust Retry with Exponential Backoff
async function fetchWithRetry(symbol, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await yahooFinance.quote(symbol);
        } catch (err) {
            if (err.message.includes('429') || err.message.includes('network')) {
                console.warn(`⚠️ Rate Limit (429) for ${symbol}. Retrying in ${Math.pow(2, i + 1)}s...`);
                await new Promise(r => setTimeout(r, Math.pow(2, i + 1) * 1000 + Math.random() * 1000));
            } else {
                throw err; // Throw non-retriable errors immediately
            }
        }
    }
    throw new Error(`Failed to fetch ${symbol} after ${retries} retries.`);
}

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon
});

// Secure Ingestion Endpoint
// Triggered by Cron-Job.org every 5 minutes
router.post('/', async (req, res) => {
    // 1. Security Check
    const apiKey = req.query.key || req.headers['x-api-key'];
    if (apiKey !== process.env.INGEST_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('🔄 Starting Scheduled Ingestion...');

        // 2. Fetch Stocks to Update
        // (Optimized: Only update stocks older than 5 mins or never updated)
        const result = await pool.query(`
            SELECT ticker FROM stocks 
            WHERE last_updated_ts IS NULL 
            OR last_updated_ts < NOW() - INTERVAL '5 minutes'
            LIMIT 50
        `);

        const stocksToUpdate = result.rows;
        console.log(`📉 Found ${stocksToUpdate.length} stocks to update.`);

        if (stocksToUpdate.length === 0) {
            return res.json({ status: 'Skipped', message: 'All stocks are fresh.' });
        }

        const symbols = stocksToUpdate.map(s => s.ticker);
        const updates = [];
        const errors = [];

        // 3. Batch Fetch from Yahoo
        // Fetch in chunks of 5 to avoid rate limits
        for (let i = 0; i < symbols.length; i += 5) {
            const batch = symbols.slice(i, i + 5);

            await Promise.all(batch.map(async (symbol) => {
                try {
                    const quote = await fetchWithRetry(symbol);
                    if (quote) {
                        await pool.query(`
                            UPDATE stocks SET
                                current_price = $1,
                                change_percent = $2,
                                volume = $3,
                                market_cap = $4,
                                pe_ratio = $5,
                                dividend_yield = $6,
                                fifty_two_week_high = $7,
                                fifty_two_week_low = $8,
                                previous_close = $9,
                                currency = $10,
                                country = $11,
                                last_updated_ts = NOW()
                            WHERE ticker = $12
                        `, [
                            quote.regularMarketPrice,
                            quote.regularMarketChangePercent,
                            quote.regularMarketVolume,
                            quote.marketCap,
                            quote.trailingPE,
                            quote.dividendYield,
                            quote.fiftyTwoWeekHigh,
                            quote.fiftyTwoWeekLow,
                            quote.regularMarketPreviousClose,
                            quote.currency,
                            quote.region || 'US',
                            symbol
                        ]);
                        updates.push(symbol);
                    }
                } catch (err) {
                    console.error(`❌ Failed ${symbol}:`, err.message);
                    errors.push(symbol);
                }
            }));

            // Artificial Delay to respect rate limits
            await new Promise(r => setTimeout(r, 3000));
        }

        console.log('✅ Ingestion Complete.');
        res.json({
            status: 'Success',
            updated: updates.length,
            errors: errors.length,
            sample: updates.slice(0, 5)
        });

    } catch (error) {
        console.error('🔥 Ingestion Fatal Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
