import YahooFinance from 'yahoo-finance2';
import Parser from 'rss-parser';
import axios from 'axios';

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

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
        return text;
    }
}

// Helper: Fetch Yahoo Finance News (PRIMARY SOURCE - Same as localhost backend)
async function fetchYahooNews(queries, count = 5) {
    const allNews = [];

    for (const query of queries) {
        try {
            // Add timeout to prevent hanging
            const result = await Promise.race([
                yahooFinance.search(query, { newsCount: count }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);

            if (result && result.news && result.news.length > 0) {
                for (const n of result.news) {
                    allNews.push({
                        title: n.title,
                        link: n.link,
                        pubDate: n.providerPublishTime,
                        source: n.publisher || 'Yahoo Finance',
                        thumbnail: n.thumbnail?.resolutions?.[0]?.url || null
                    });
                }
            }
        } catch (e) {
            console.error(`Yahoo Fetch Error (${query}):`, e.message);
            // Continue to next query even if this one fails
        }
    }

    return allNews;
}

// Helper: Fetch Bing News RSS (Supplementary Source)
async function fetchBingNews(query, count = 5) {
    try {
        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        });

        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us&qft=sortbydate="1"`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            let finalUrl = item.link;
            try {
                const u = new URL(item.link);
                const r = u.searchParams.get('url');
                if (r) finalUrl = r;
            } catch (e) { }

            let image = null;
            if (item.content) {
                const imgMatch = item.content.match(/src="([^"]+)"/);
                if (imgMatch) image = imgMatch[1];
            }

            // Extract publisher from URL or source field
            let publisher = item.source || 'News';
            try {
                const sourceUrl = new URL(finalUrl);
                const hostname = sourceUrl.hostname.replace('www.', '');
                // Map common domains to proper names
                if (hostname.includes('zawya')) publisher = 'Zawya';
                else if (hostname.includes('argaam')) publisher = 'Argaam';
                else if (hostname.includes('mubasher')) publisher = 'Mubasher';
                else if (hostname.includes('reuters')) publisher = 'Reuters';
                else if (hostname.includes('bloomberg')) publisher = 'Bloomberg';
                else if (hostname.includes('cnbc')) publisher = 'CNBC';
                else if (hostname.includes('investing.com')) publisher = 'Investing.com';
                else if (hostname.includes('yahoo')) publisher = 'Yahoo Finance';
                else if (hostname.includes('nasdaq')) publisher = 'NASDAQ';
                else if (hostname.includes('marketwatch')) publisher = 'MarketWatch';
                else if (hostname.includes('arabnews')) publisher = 'Arab News';
                else if (hostname.includes('egypttoday')) publisher = 'Egypt Today';
                else if (hostname.includes('dailynewsegypt')) publisher = 'Daily News Egypt';
                else publisher = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
            } catch (e) { }

            return {
                originalTitle: item.title,
                link: finalUrl,
                pubDate: item.pubDate,
                source: publisher,
                thumbnail: image
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

    try {
        // **UNIFIED NEWS STRATEGY** - Match localhost backend exactly
        // Primary: Yahoo Finance (same as localhost)
        // Secondary: Bing RSS (supplementary)

        let yahooQueries = [];
        let bingQueries = [];

        if (market === 'SA') {
            yahooQueries = ['Tadawul', 'Saudi Arabia stocks', 'Saudi Aramco'];
            bingQueries = ['Saudi Stock Market Tadawul', 'site:argaam.com', 'Saudi Aramco stock'];
        } else if (market === 'EG') {
            yahooQueries = ['EGX Egypt', 'Egypt stock market', 'Egyptian Exchange'];
            bingQueries = ['Egyptian Stock Exchange EGX', 'Egypt economy stocks', 'site:zawya.com Egypt', 'Cairo Stock Exchange'];
        } else if (market === 'US') {
            yahooQueries = ['S&P 500', 'Stock Market', 'NASDAQ'];
            bingQueries = ['NASDAQ Tech Stocks', 'WSJ Markets', 'CNBC Markets'];
        } else {
            yahooQueries = ['Global Stock Markets'];
            bingQueries = ['World Markets'];
        }

        // Fetch from Yahoo (Primary - Same as localhost)
        const yahooNews = await fetchYahooNews(yahooQueries, 5);

        // Fetch from Bing (Increased to 5 per query for better coverage)
        const bingPromises = bingQueries.map(q => fetchBingNews(q, 5));
        const bingResults = await Promise.all(bingPromises);
        const bingNews = bingResults.flat();

        // Translate Bing titles if needed
        const processedBing = await Promise.all(bingNews.map(async (item) => {
            let title = item.originalTitle;
            if (title) {
                title = await translateText(title);
            }
            return {
                title,
                link: item.link,
                pubDate: item.pubDate,
                source: item.source,
                thumbnail: item.thumbnail
            };
        }));

        // Combine (Yahoo first to ensure consistency with localhost)
        const combined = [...yahooNews, ...processedBing];

        // Format to match expected structure
        const processed = combined.map(item => ({
            id: item.link || `news-${Math.random()}`,
            title: item.title,
            publisher: item.source,
            link: item.link,
            time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            thumbnail: item.thumbnail || 'https://placehold.co/600x400/f1f5f9/475569?text=News',
            relatedTickers: []
        }));

        // Deduplicate by title
        const seen = new Set();
        const uniqueNews = processed.filter(item => {
            if (!item.title) return false;
            const signature = item.title.toLowerCase().trim();
            if (seen.has(signature)) return false;
            seen.add(signature);
            return true;
        }).sort((a, b) => new Date(b.time) - new Date(a.time));

        if (uniqueNews.length === 0) {
            return res.status(200).json([
                {
                    id: 'fallback',
                    title: 'Market News Currently Unavailable',
                    publisher: 'System',
                    link: '#',
                    time: new Date().toISOString(),
                    thumbnail: 'https://placehold.co/600x400/f1f5f9/475569?text=No+News'
                }
            ]);
        }

        // Cache for 1 minute
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json(uniqueNews);

    } catch (error) {
        console.error('News Handler Error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
