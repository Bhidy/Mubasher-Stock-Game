const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// ROUTE: GET /api/chart?symbol=AAPL&range=1d&interval=5m
router.get('/', async (req, res) => {
    try {
        const { symbol, range = '1d' } = req.query;
        let { interval } = req.query;

        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }

        // Default constraints (matches frontend logic)
        if (!interval) {
            if (range === '1d') interval = '2m';
            else if (range === '5d') interval = '15m';
            else if (range.includes('mo')) interval = '60m';
            else interval = '1d';
        }

        console.log(`[Chart] Request for ${symbol} range=${range} interval=${interval}`);

        // 1. Check DB Cache
        const cacheKey = [symbol, range, interval];
        const cacheRes = await pool.query(
            'SELECT * FROM chart_cache WHERE symbol = $1 AND range = $2 AND interval = $3',
            cacheKey
        );
        const cached = cacheRes.rows[0];

        // Cache Rules
        // Intraday (1d, 5d): 15 mins cache
        // History: 24 hours cache
        const isIntraday = range === '1d' || range === '5d';
        const TTL = isIntraday ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000;

        const isFresh = cached && (new Date() - new Date(cached.updated_at) < TTL);
        console.log(`[Chart] Cached Row:`, cached ? 'FOUND' : 'NULL');
        if (cached) console.log(`[Chart] Freshness: ${new Date() - new Date(cached.updated_at)}ms / ${TTL}ms`);


        if (isFresh) {
            console.log(`[Chart] Returning Cached for ${symbol} (${range})`);
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached.data);
        }

        console.log(`[Chart] Cache miss/stale for ${symbol}. Fetching live...`);

        try {
            // 2. Map Range to Yahoo Period
            const now = Date.now();
            let period1;
            const days = (n) => n * 86400000;

            switch (range.toLowerCase()) {
                case '1d': period1 = new Date(now - days(2)); break; // 2 days for safe buffer
                case '5d': period1 = new Date(now - days(7)); break;
                case '1m': case '1mo': period1 = new Date(now - days(32)); break;
                case '6m': case '6mo': period1 = new Date(now - days(185)); break;
                case 'ytd': period1 = new Date(new Date().getFullYear(), 0, 1); break;
                case '1y': period1 = new Date(now - days(365)); break;
                case '5y': period1 = new Date(now - days(365 * 5)); break;
                case 'max': period1 = new Date(0); break;
                default: period1 = new Date(now - days(2));
            }

            const queryOptions = {
                period1: period1,
                interval: interval,
                includePrePost: false
            };

            const result = await yahooFinance.chart(symbol, queryOptions);

            if (!result || !result.quotes || result.quotes.length === 0) {
                // Try fallback or throw
                if (cached) throw new Error('Empty result from Yahoo');
                return res.json({ quotes: [] });
            }

            // 3. Transform
            const quotes = result.quotes.map(q => ({
                date: q.date.toISOString(),
                open: q.open,
                high: q.high,
                low: q.low,
                close: q.close,
                volume: q.volume,
                price: q.close
            }));

            const finalData = {
                symbol: result.meta.symbol,
                currency: result.meta.currency,
                quotes: quotes
            };

            // 4. Upsert Cache
            await pool.query(
                `INSERT INTO chart_cache (symbol, range, interval, data, updated_at)
                 VALUES ($1, $2, $3, $4, NOW())
                 ON CONFLICT (symbol, range, interval) 
                 DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
                [symbol, range, interval, finalData]
            );

            res.setHeader('X-Cache', 'MISS');
            res.json(finalData);

        } catch (yahooErr) {
            console.error(`[Chart] Yahoo Error: ${yahooErr.message}`);

            // 5. Fallback Stale
            if (cached) {
                console.warn(`[Chart] Returning STALE for ${symbol}`);
                res.setHeader('X-Cache', 'STALE');
                return res.json({ ...cached.data, _stale: true });
            }

            throw yahooErr;
        }

    } catch (error) {
        console.error('[Chart] Library Error:', error.message);
        if (error.message.includes('429')) {
            res.status(429).json({ error: 'Rate Limited by Yahoo' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
