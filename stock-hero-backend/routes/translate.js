const express = require('express');
const router = express.Router();

const PROD_API_URL = 'https://bhidy.vercel.app/api/translate';

router.post('/', async (req, res) => {
    try {
        const response = await fetch(PROD_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'StockHero-LocalProxy/1.0'
            },
            body: JSON.stringify(req.body)
        });

        res.status(response.status).json(await response.json());
    } catch (error) {
        console.error('Translate Proxy Error:', error.message);
        res.status(500).json({ error: 'Proxy failed' });
    }
});

module.exports = router;
