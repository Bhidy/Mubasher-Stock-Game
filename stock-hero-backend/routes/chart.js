const express = require('express');
const router = express.Router();
// Fix: Correct instantiation
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Yahoo Finance Chart API Proxy (Using yahoo-finance2 library)
// Solves 429 Rate Limits by handling Cookies/Crumbs automatically
// Maps 'range' to 'period1' to satisfy strict library validation

router.get('/', async (req, res) => {
    try {
        const { symbol, range = '1d' } = req.query;

        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }

        // 1. Map Range to Interval AND Period1
        let interval = '2m';
        const now = Date.now();
        let period1 = new Date(now - 86400000); // Default 1d

        const rangeLower = range.toLowerCase();

        // Helper to subtract days
        const days = (n) => n * 24 * 60 * 60 * 1000;

        switch (rangeLower) {
            case '1d':
                interval = '2m';
                period1 = new Date(now - days(2)); // Go back 2 days to ensure full trading day coverage (Yahoo filters automatically)
                // Actually 24h is usually enough, but weekend safety suggests 2-3 days or verify trading days.
                // Let's stick to simple days math first.
                period1 = new Date(now - days(1));
                break;
            case '5d':
                interval = '15m'; // 15m is good for 5d
                period1 = new Date(now - days(5));
                break;
            case '1m':
            case '1mo':
                interval = '60m'; // 60m is standard for 1mo
                period1 = new Date(now - days(30));
                break;
            case '6m':
            case '6mo':
                interval = '1d';
                period1 = new Date(now - days(180));
                break;
            case 'ytd':
                interval = '1d';
                period1 = new Date(new Date().getFullYear(), 0, 1); // Jan 1st
                break;
            case '1y':
                interval = '1d';
                period1 = new Date(now - days(365));
                break;
            case '5y':
                interval = '1wk';
                period1 = new Date(now - days(365 * 5));
                break;
            case 'max':
                interval = '1mo';
                period1 = new Date(0); // 1970
                break;
            default:
                interval = '1d';
                period1 = new Date(now - days(1));
        }

        console.log(`[Chart] Fetching ${symbol} period1=${period1.toISOString()} interval=${interval} via yahoo-finance2`);

        // 2. Fetch using Library
        // MUST NOT pass 'range'. MUST pass 'period1'.
        const queryOptions = {
            period1: period1,
            interval: interval,
            includePrePost: false
            // period2 defaults to now
        };

        const result = await yahooFinance.chart(symbol, queryOptions);

        if (!result || !result.quotes || result.quotes.length === 0) {
            console.log(`[Chart] No data found for ${symbol}`);
            return res.json({ quotes: [] });
        }

        // 3. Transform Data
        const quotes = result.quotes.map(q => ({
            date: q.date.toISOString(),
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume,
            price: q.close
        }));

        res.json({
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            quotes: quotes
        });

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
