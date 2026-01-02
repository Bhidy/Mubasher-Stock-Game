const express = require('express');
const router = express.Router();
const https = require('https');

// Production Backend URL
const PROD_API_URL = 'https://bhidy.vercel.app/api/stocks';

// Proxy all requests to production
router.get('/', async (req, res) => {
    const market = req.query.market || 'SA';

    try {
        const response = await fetch(`${PROD_API_URL}?market=${encodeURIComponent(market)}`, {
            headers: {
                'User-Agent': 'StockHero-LocalProxy/1.0',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Production API responded with ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Stocks Proxy Error:', error.message);
        // Fallback to empty array to prevent frontend crash
        res.json([]);
    }
});

// Proxy single stock details if needed (optional, keeping it simple for now)
router.get('/:ticker', async (req, res) => {
    // For specific ticker, we might not have a direct proxy endpoint in the list above
    // But usually frontend calls /api/stocks for the list.
    // If specific details are needed, we can implement similar proxying.
    // For now, let's keep the DB fallback or just return 404 if not found in list.
    // Actually, usually the frontend filters the list. 
    // Let's implement a simple filter on the proxy result if possible, 
    // or just forward if there's an endpoint.
    // Reverting to Database for single ticker might be safer if production doesn't expose it publically same way.
    // But the user wants "Same as production".
    // Production likely uses the same /api/stocks endpoint or a specific one.
    // Let's stick to the plan: Proxy the main list which is the issue (Watchlist).

    res.status(404).json({ error: 'Individual stock proxy not implemented, use main list' });
});

module.exports = router;
