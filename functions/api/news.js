/**
 * News API - Cumulative Storage
 * Fetches fresh news from sources AND accumulates them in KV storage
 * Returns the full accumulated history, not just fresh articles
 */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'SA';

    // CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    const NEWS_DATA = env.CMS_DATA; // Reuse CMS_DATA KV namespace
    const storageKey = `news_archive_${market}`;

    if (!NEWS_DATA) {
        console.error("CRITICAL ERROR: 'CMS_DATA' KV binding is missing! News archiving will fail.");
    }

    try {
        // 1. FETCH FRESH NEWS from Vercel
        const vercelUrl = `https://bhidy.vercel.app/api/news?market=${encodeURIComponent(market)}`;
        let freshNews = [];

        try {
            const response = await fetch(vercelUrl, {
                headers: {
                    'User-Agent': 'StocksHero-Cloudflare/1.0',
                    'Accept': 'application/json'
                }
            });
            freshNews = await response.json();
            if (!Array.isArray(freshNews)) freshNews = [];
        } catch (e) {
            console.error('Failed to fetch fresh news:', e);
            freshNews = [];
        }

        // 2. LOAD EXISTING ARCHIVE from KV
        let archive = [];
        if (NEWS_DATA) {
            try {
                const raw = await NEWS_DATA.get(storageKey);
                archive = raw ? JSON.parse(raw) : [];
                if (!Array.isArray(archive)) archive = [];
            } catch (e) {
                console.error('Failed to load archive:', e);
                archive = [];
            }
        }

        // 3. MERGE: Add fresh news that doesn't already exist
        const existingUrls = new Set(archive.map(a => a.link || a.url));
        const existingTitles = new Set(archive.map(a => (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')));

        let newCount = 0;
        for (const article of freshNews) {
            const normalizedTitle = (article.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const articleUrl = article.link || article.url;

            // Skip if already exists (by URL or title match)
            if (existingUrls.has(articleUrl)) continue;
            if (existingTitles.has(normalizedTitle)) continue;

            // Add to archive
            archive.unshift({
                ...article,
                archivedAt: new Date().toISOString()
            });
            existingUrls.add(articleUrl);
            existingTitles.add(normalizedTitle);
            newCount++;
        }

        // 4. SORT by date (newest first)
        archive.sort((a, b) => {
            const dateA = new Date(a.time || a.pubDate || a.archivedAt || 0);
            const dateB = new Date(b.time || b.pubDate || b.archivedAt || 0);
            return dateB - dateA;
        });

        // 5. LIMIT to prevent unbounded growth (keep last 2000 articles per market)
        const MAX_ARTICLES = 2000;
        if (archive.length > MAX_ARTICLES) {
            archive = archive.slice(0, MAX_ARTICLES);
        }

        // 6. SAVE BACK TO KV
        if (NEWS_DATA) {
            try {
                await NEWS_DATA.put(storageKey, JSON.stringify(archive));
            } catch (e) {
                console.error('Failed to save archive:', e);
            }
        }

        // 7. RETURN the full accumulated archive
        return new Response(JSON.stringify(archive), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60', // Shorter cache for accumulation
                'X-News-Count': archive.length.toString(),
                'X-New-Articles': newCount.toString()
            }
        });

    } catch (error) {
        console.error('News API Error:', error);

        // Fallback: Try to return existing archive from KV
        if (NEWS_DATA) {
            try {
                const raw = await NEWS_DATA.get(storageKey);
                const archive = raw ? JSON.parse(raw) : [];
                return new Response(JSON.stringify(archive), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-News-Count': archive.length.toString(),
                        'X-Fallback': 'true'
                    }
                });
            } catch (e) { }
        }

        // Ultimate fallback: empty array
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
