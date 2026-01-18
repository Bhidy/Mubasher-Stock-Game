const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Version: DB-FIRST-V1
// Serves data strictly from the 'stocks' table populated by the ingestion worker.

// CACHE HEADERS
const CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=120';

// ROUTE: GET /api/stocks?market=US
router.get('/', async (req, res) => {
    const market = req.query.market || 'US';

    try {
        console.log(`[API] Serving stocks for market: ${market}`);

        // 1. Query DB
        const result = await pool.query(
            `SELECT 
                ticker as symbol, 
                name, 
                current_price as price, 
                change_percent, 
                previous_close as "prevClose",
                volume, 
                market_cap as "marketCap",
                category, 
                currency,
                last_updated_ts as "lastUpdated"
             FROM stocks 
             WHERE category = $1
             ORDER BY market_cap DESC`,
            [market]
        );

        let data = result.rows;

        // 2. Fallback / Stale Data Handling
        // The app MUST NOT CRASH if ingestion fails. We serve what we have.
        if (data.length === 0) {
            console.warn(`[API] No data found for ${market}. Returning empty list.`);
            // In a real disaster scenario, we could return a static backup JSON here.
        }

        // Check freshness of data
        const now = new Date();
        const staleThreshold = 15 * 60 * 1000; // 15 minutes
        let isStale = false;

        if (data.length > 0 && data[0].lastUpdated) {
            const lastUpdate = new Date(data[0].lastUpdated);
            if (now - lastUpdate > staleThreshold) {
                console.warn(`[WARN] Data for ${market} is stale (older than 15m). Serving anyway to prevent crash.`);
                isStale = true;
            }
        }

        // 3. Format/Transform if necessary to match frontend expectations
        // The frontend expects keys like 'change' (absolute change).
        // We only stored change_percent. Let's calculate 'change' if missing.
        data = data.map(stock => {
            const price = parseFloat(stock.price || 0);
            const prev = parseFloat(stock.prevClose || price); // fallback to price ensures 0 change

            // Re-calculate absolute change if feasible, or rely on stored?
            // If we didn't store absolute change, we can derive it.
            const change = price - prev;

            // Country Flags Map
            const COUNTRY_FLAGS = {
                'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧',
                'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'CA': '🇨🇦', 'AU': '🇦🇺',
                'HK': '🇭🇰', 'CH': '🇨🇭', 'NL': '🇳🇱', 'ES': '🇪🇸', 'IT': '🇮🇹',
                'BR': '🇧🇷', 'MX': '🇲🇽', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬',
                'AE': '🇦🇪', 'ZA': '🇿🇦', 'QA': '🇶🇦'
            };

            return {
                ...stock,
                change: parseFloat(change.toFixed(2)),
                country: COUNTRY_FLAGS[market] || '🌍',
                // Frontend often handles formatting, but let's ensure numbers
                price: price,
                changePercent: parseFloat(stock.change_percent || 0),
                volume: parseInt(stock.volume || 0),
                marketCap: parseInt(stock.marketCap || 0)
            };
        });

        // 4. Response
        res.setHeader('Cache-Control', CACHE_CONTROL);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);

    } catch (error) {
        console.error('DB Stocks Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve stock data', details: error.message });
    }
});

module.exports = router;
