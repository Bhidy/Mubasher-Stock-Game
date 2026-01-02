const express = require('express');
const router = express.Router();

const PROD_API_URL = 'https://bhidy.vercel.app/api/content';

router.get('/', async (req, res) => {
    try {
        const url = req.query.url;
        const title = req.query.title;

        const fetchUrl = `${PROD_API_URL}?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        const response = await fetch(fetchUrl, {
            headers: { 'User-Agent': 'StockHero-LocalProxy/1.0' }
        });

        // Forward status and body
        res.status(response.status).json(await response.json());
    } catch (error) {
        console.error('Content Proxy Error:', error.message);
        res.status(500).json({ error: 'Proxy failed' });
    }
});

module.exports = router;
