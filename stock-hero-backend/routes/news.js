const express = require('express');
const router = express.Router();

const PROD_API_URL = 'https://bhidy.vercel.app/api/news';

router.get('/', async (req, res) => {
    try {
        const market = req.query.market || 'SA';
        const response = await fetch(`${PROD_API_URL}?market=${encodeURIComponent(market)}`, {
            headers: { 'User-Agent': 'StockHero-LocalProxy/1.0' }
        });
        if (!response.ok) throw new Error(`Production API Error: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('News Proxy Error:', error.message);
        res.json([]); // Fallback
    }
});

module.exports = router;
