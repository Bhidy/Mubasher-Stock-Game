import yahooFinance from 'yahoo-finance2';
import Parser from 'rss-parser';
import axios from 'axios';

// Helper: Translate Text (AR -> EN)
async function translateText(text) {
    if (!text) return '';
    // Quick check if text has Arabic
    if (!/[\u0600-\u06FF]/.test(text)) return text;

    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'ar',
                tl: 'en',
                dt: 't',
                q: text.substring(0, 2000) // Limit length
            },
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        // Combine all segments
        if (response.data && response.data[0]) {
            return response.data[0].map(s => s[0]).join('');
        }
        return text;
    } catch (e) {
        // console.error('Translation failed:', e.message);
        return text;
    }
}

// Helper: Fetch Bing News RSS
async function fetchBingNews(query, count = 5) {
    try {
        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 5000
        });

        // Use en-us market to get English results where possible, or just raw search
        // Add qft=sortbydate="1" to force sorting by date
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us&qft=sortbydate="1"`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            // Extract real URL if wrapped
            let finalUrl = item.link;
            try {
                const u = new URL(item.link);
                const r = u.searchParams.get('url');
                if (r) finalUrl = r;
            } catch (e) { }

            // Extract Image from content/description if available (Bing RSS often hides it)
            // We'll use a placeholder or try to extract from description
            let image = null;
            if (item.content) {
                const imgMatch = item.content.match(/src="([^"]+)"/);
                if (imgMatch) image = imgMatch[1];
            }

            return {
                originalTitle: item.title,
                link: finalUrl,
                pubDate: item.pubDate,
                source: item.source || 'News'
            };
        });
    } catch (e) {
        console.error(`Bing Fetch Error (${query}):`, e.message);
        return [];
    }
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { market } = req.query;
    let allNews = [];

    // Parallel Fetching Strategy
    const tasks = [];

    if (market === 'SA') {
        // Saudi Sources: Mix of English (Broad) and Arabic (Fresh) + Translation
        tasks.push(fetchBingNews('Saudi Stock Market', 3));
        tasks.push(fetchBingNews('سوق الأسهم السعودية', 5)); // Fresh Arabic News
        tasks.push(fetchBingNews('Tadawul All Share Index', 3));
        tasks.push(fetchBingNews('site:argaam.com Saudi', 2));
    } else if (market === 'EG') {
        // Egypt Sources: Arabic is much fresher for EGX
        tasks.push(fetchBingNews('Egyptian Stock Exchange', 3));
        tasks.push(fetchBingNews('أخبار البورصة المصرية', 5)); // Fresh Arabic News
        tasks.push(fetchBingNews('site:mubasher.info Egypt', 2)); // Keep just in case
        tasks.push(fetchBingNews('اقتصاد مصر', 3)); // Egypt Economy (Arabic)
    } else if (market === 'US') {
        tasks.push(fetchBingNews('S&P 500 Market', 3));
        tasks.push(fetchBingNews('NASDAQ Tech Stocks', 3));
        tasks.push(fetchBingNews('CNBC Markets', 2));
        tasks.push(fetchBingNews('Bloomberg Markets', 2));
        tasks.push(fetchBingNews('WSJ Markets', 2));
    } else {
        tasks.push(fetchBingNews('Global Stock Markets', 5));
    }

    // Also Fetch Yahoo Finance as reliable fallback/supplement
    const yahooQueries = market === 'SA' ? ['Tadawul'] : market === 'EG' ? ['EGX Egypt'] : ['Stock Market'];
    tasks.push(yahooFinance.search(yahooQueries[0], { newsCount: 3 }).then(res => {
        return (res.news || []).map(n => ({
            title: n.title,
            link: n.link,
            pubDate: n.providerPublishTime,
            source: n.publisher || 'Yahoo Finance',
            thumbnail: n.thumbnail?.resolutions?.[0]?.url,
            isYahoo: true
        }));
    }).catch(() => []));

    try {
        // Execute all fetches
        const results = await Promise.all(tasks);
        const flatResults = results.flat();

        // Process & Translate
        // We limit parallel translations to avoid timeouts
        const processed = await Promise.all(flatResults.map(async (item) => {
            // Translate Title if needed
            let title = item.title || item.originalTitle;
            if (title && !item.isYahoo) {
                title = await translateText(title);
            }

            return {
                id: item.link,
                title: title,
                publisher: item.source,
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: item.thumbnail || 'https://placehold.co/600x400/f1f5f9/475569?text=News',
                relatedTickers: []
            };
        }));

        allNews = processed;

        // Deduplicate
        const seen = new Set();
        const uniqueNews = allNews.filter(item => {
            if (!item.title) return false;
            const signature = item.title.toLowerCase().trim();
            if (seen.has(signature)) return false;
            seen.add(signature);
            return true;
        }).sort((a, b) => new Date(b.time) - new Date(a.time));

        if (uniqueNews.length === 0) {
            // Ultimate Fallback
            return res.status(200).json([
                {
                    id: 'fallback',
                    title: 'Market Data Currently Unavailable',
                    publisher: 'System',
                    link: '#',
                    time: new Date().toISOString(),
                    thumbnail: 'https://placehold.co/600x400/f1f5f9/475569?text=No+News'
                }
            ]);
        }

        // Cache for 1 minute (Fresh content priority)
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json(uniqueNews);

    } catch (error) {
        console.error('News Handler Error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
