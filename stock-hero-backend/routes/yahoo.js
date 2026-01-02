const express = require('express');
const router = express.Router();
// Fix: Correct instantiation of yahoo-finance2
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Yahoo Finance API Proxy (Using yahoo-finance2 for reliability)
// Solves 429 Rate Limits by handling Cookies/Crumbs automatically

router.get('/', async (req, res) => {
    const symbol = req.query.symbol || 'AAPL';
    // range/interval are ignored for simple quote, but kept for compatibility invalidation

    try {
        // Use quote() for current price data (mimics v8/finance/chart meta)
        const quote = await yahooFinance.quote(symbol);

        if (!quote) {
            throw new Error('No data found from Yahoo');
        }

        // Map fields to match the original structure expected by Frontend/Cloudflare Function
        // Original: result.meta.{regularMarketPrice, chartPreviousClose, etc}
        // Library Quote: { regularMarketPrice, regularMarketPreviousClose, ... }

        const price = quote.regularMarketPrice;
        const prevClose = quote.regularMarketPreviousClose;
        const change = price - prevClose;
        const changePercent = (change / prevClose) * 100;

        res.json({
            symbol: quote.symbol,
            price: price,
            change: change,
            changePercent: changePercent,
            currency: quote.currency,
            volume: quote.regularMarketVolume,
            dayHigh: quote.regularMarketDayHigh,
            dayLow: quote.regularMarketDayLow,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Yahoo Proxy Error (${symbol}):`, error.message);

        // Handle Rate Limits specifically if they bubble up
        if (error.message.includes('429')) {
            res.status(429).json({ error: 'Rate Limited by Yahoo' });
        } else {
            res.status(500).json({
                error: 'Failed to fetch data',
                details: error.message
            });
        }
    }
});

module.exports = router;
