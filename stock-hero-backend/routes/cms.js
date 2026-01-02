const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Hybrid CMS Proxy + Local Storage
// 1. Reads/Writes local generations to data/cms_news.json
// 2. Proxies GET requests to Vercel to fetch "Source Pool" articles
// 3. Merges them for the frontend

const PROD_API_URL = 'https://bhidy.vercel.app/api/cms';
const DATA_DIR = path.join(__dirname, '../data');
const NEWS_FILE = path.join(DATA_DIR, 'cms_news.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read local news
function getLocalNews() {
    if (!fs.existsSync(NEWS_FILE)) return [];
    try {
        const data = fs.readFileSync(NEWS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to save local news
function saveLocalNews(articles) {
    fs.writeFileSync(NEWS_FILE, JSON.stringify(articles, null, 2));
}

// GET (Read) - Merge Local + Remote
router.get('/', async (req, res) => {
    try {
        const entity = req.query.entity;

        // If it's NEWS, we do the merge logic
        if (entity === 'news') {
            // 1. Get Local
            const localNews = getLocalNews();

            // 2. Get Remote (Source Pool) - Optional, don't crash if fails
            let remoteNews = [];
            try {
                const url = new URL(PROD_API_URL);
                Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));

                const response = await fetch(url.toString(), {
                    headers: { 'User-Agent': 'StockHero-LocalProxy/1.0' }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) remoteNews = data;
                }
            } catch (e) {
                console.warn('Remote CMS fetch failed (ignoring):', e.message);
            }

            // 3. Merge (Local overrides Remote if IDs clash, though IDs should be unique)
            // Local items are typically "AI Rewrite" or "Created Locally"
            const merged = [...localNews, ...remoteNews];

            // Sort by publishedAt desc
            merged.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

            return res.json(merged);
        }

        // For other entities, just proxy to Prod for now (or implement similar local logic if needed)
        // Default Proxy Fallback
        const url = new URL(PROD_API_URL);
        Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));
        const response = await fetch(url.toString(), { headers: { 'User-Agent': 'StockHero-LocalProxy/1.0' } });
        res.status(response.status).json(await response.json());

    } catch (error) {
        console.error('CMS GET Error:', error.message);
        res.status(500).json({ error: 'CMS Request Failed' });
    }
});

// POST (Create) - Intercept NEWS writes locally
router.post('/', async (req, res) => {
    try {
        const entity = req.query.entity;

        if (entity === 'news') {
            const newArticle = req.body;

            // Assign ID if missing
            if (!newArticle.id) {
                newArticle.id = 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            // Assign dates if missing
            if (!newArticle.createdAt) newArticle.createdAt = new Date().toISOString();
            if (!newArticle.publishedAt) newArticle.publishedAt = new Date().toISOString();

            const localNews = getLocalNews();
            localNews.unshift(newArticle); // Add to top
            saveLocalNews(localNews);

            console.log(`[CMS] Saved local article: "${newArticle.title}"`);
            return res.status(201).json(newArticle);
        }

        // For other entities, try proxy (will likely fail 401/403, but behavior preserved)
        const response = await fetch(PROD_API_URL + '?entity=' + entity, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'StockHero-LocalProxy/1.0'
            },
            body: JSON.stringify(req.body)
        });
        res.status(response.status).json(await response.json());

    } catch (error) {
        console.error('CMS POST Error:', error.message);
        res.status(500).json({ error: 'Create Failed' });
    }
});

// PUT/DELETE - Implement if needed, for now just proxy or basic file ops could be added
// keeping it simple for "Generation" success.

module.exports = router;
