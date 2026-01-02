const express = require('express');
const router = express.Router();

const PROD_API_URL = 'https://bhidy.vercel.app/api/stock-profile';

router.get('/', async (req, res) => {
    try {
        const symbol = req.query.symbol;
        const response = await fetch(`${PROD_API_URL}?symbol=${encodeURIComponent(symbol)}`, {
            headers: { 'User-Agent': 'StockHero-LocalProxy/1.0' }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Production API Error' });
        }

        res.json(await response.json());
    } catch (error) {
        console.error('Stock Profile Proxy Error:', error.message);
        res.status(500).json({ error: 'Proxy failed' });
    }
});

module.exports = router;
