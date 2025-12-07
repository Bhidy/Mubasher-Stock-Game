import YahooFinance from 'yahoo-finance2';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

// Helper: Fetch with timeout
async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: timeout,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response.data;
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

// Helper: Translate Text (AR -> EN)
async function translateText(text) {
    if (!text) return '';
    if (!/[\u0600-\u06FF]/.test(text)) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { timeout: 3000 });
        if (response.data && response.data[0]) {
            return response.data[0].map(s => s[0]).join('');
        }
    } catch (e) { }
    return text;
}

// SCRAPER: Mubasher Direct (same as localhost backend)
async function scrapeMubasher(market = 'SA') {
    const articles = [];
    const url = market === 'SA'
        ? 'https://english.mubasher.info/markets/TDWL'
        : 'https://english.mubasher.info/countries/eg';

    try {
        console.log(`Scraping Mubasher for ${market}...`);
        const html = await fetchWithTimeout(url, 10000);
        const $ = cheerio.load(html);
        const links = new Set();

        // Find article links
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/\/news\/\d+\//)) {
                const fullUrl = href.startsWith('http') ? href : 'https://english.mubasher.info' + href;
                links.add(fullUrl);
            }
        });

        const uniqueLinks = Array.from(links).slice(0, 8); // Top 8 articles

        // Fetch article details in parallel
        const articlePromises = uniqueLinks.map(async (link) => {
            try {
                const pageHtml = await fetchWithTimeout(link, 5000);
                const $page = cheerio.load(pageHtml);

                const title = $page('h1').first().text().trim();
                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('.article-image img').attr('src') ||
                    $page('article img').first().attr('src');

                if (image && !image.startsWith('http')) {
                    image = 'https://english.mubasher.info' + image;
                }

                const dateStr = $page('time').attr('datetime') || new Date().toISOString();

                if (title && title.length > 10) {
                    return {
                        id: link,
                        title: title,
                        publisher: 'Mubasher',
                        link: link,
                        time: new Date(dateStr).toISOString(),
                        thumbnail: image || 'https://placehold.co/600x400/f1f5f9/475569?text=Mubasher'
                    };
                }
            } catch (e) {
                console.log(`Failed to fetch article ${link}: ${e.message}`);
            }
            return null;
        });

        const results = await Promise.all(articlePromises);
        articles.push(...results.filter(a => a !== null));

    } catch (e) {
        console.error(`Mubasher scrape failed for ${market}:`, e.message);
    }

    return articles;
}

// Helper: Fetch Yahoo Finance News
async function fetchYahooNews(queries, count = 5) {
    const allNews = [];

    for (const query of queries) {
        try {
            const result = await Promise.race([
                yahooFinance.search(query, { newsCount: count }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);

            if (result && result.news && result.news.length > 0) {
                for (const n of result.news) {
                    allNews.push({
                        id: n.uuid || n.link,
                        title: n.title,
                        publisher: n.publisher || 'Yahoo Finance',
                        link: n.link,
                        time: new Date(n.providerPublishTime).toISOString(),
                        thumbnail: n.thumbnail?.resolutions?.[0]?.url || null
                    });
                }
            }
        } catch (e) {
            console.error(`Yahoo Fetch Error (${query}):`, e.message);
        }
    }

    return allNews;
}

// Helper: Fetch Google News RSS (More reliable than Bing for specific sites)
async function fetchGoogleNews(query, count = 5) {
    try {
        const parser = new Parser({
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });

        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            // Extract publisher from title "Title - Publisher"
            let publisher = 'News';
            let title = item.title;
            const parts = title.split(' - ');
            if (parts.length > 1) {
                publisher = parts.pop(); // Last part is publisher
                title = parts.join(' - ');
            }

            // Refine publisher
            if (publisher.toLowerCase().includes('mubasher')) publisher = 'Mubasher';
            else if (publisher.toLowerCase().includes('argaam')) publisher = 'Argaam';
            else if (publisher.toLowerCase().includes('zawya')) publisher = 'Zawya';

            // Google News links are redirects, handled by frontend or scraper

            // Thumbnails: Google RSS doesn't give images easily. Use fallback.
            // We use the publisher domain logic inside fetchBingNews, repeated here efficiently
            // Actually, we'll let the frontend handle the fallback or use a generic one
            let image = null;
            // Try to guess domain for logo
            let domain = '';
            if (publisher === 'Mubasher') domain = 'english.mubasher.info';
            else if (publisher === 'Argaam') domain = 'argaam.com';
            else if (publisher === 'Zawya') domain = 'zawya.com';

            if (domain) {
                image = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
            }

            return {
                id: item.link,
                title: title,
                publisher: publisher,
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image
            };
        });
    } catch (e) {
        console.error(`Google News Fetch Error (${query}):`, e.message);
        return [];
    }
}

// Helper: Fetch Bing News RSS
async function fetchBingNews(query, count = 5) {
    try {
        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        });

        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us`;
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
            if (!image && item.enclosure && item.enclosure.url) {
                image = item.enclosure.url;
            }

            // Extract publisher from URL
            let publisher = 'News';
            let hostname = '';
            try {
                const sourceUrl = new URL(finalUrl);
                hostname = sourceUrl.hostname.replace('www.', '');
                if (hostname.includes('zawya')) publisher = 'Zawya';
                else if (hostname.includes('argaam')) publisher = 'Argaam';
                else if (hostname.includes('mubasher')) publisher = 'Mubasher';
                else if (hostname.includes('reuters')) publisher = 'Reuters';
                else if (hostname.includes('bloomberg')) publisher = 'Bloomberg';
                else if (hostname.includes('cnbc')) publisher = 'CNBC';
                else if (hostname.includes('investing.com')) publisher = 'Investing.com';
                else if (hostname.includes('yahoo')) publisher = 'Yahoo Finance';
                else if (hostname.includes('arabnews')) publisher = 'Arab News';
                else if (hostname.includes('egypttoday')) publisher = 'Egypt Today';
                else if (hostname.includes('dailynewsegypt')) publisher = 'Daily News Egypt';
                else if (hostname.includes('arabfinance')) publisher = 'Arab Finance';
                else publisher = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
            } catch (e) { }

            // Fallback to publisher logo if no image
            if (!image && hostname) {
                image = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=128`;
            }

            return {
                id: finalUrl,
                title: item.title,
                publisher: publisher,
                link: finalUrl,
                time: new Date(item.pubDate).toISOString(),
                thumbnail: image
            };
        });
    } catch (e) {
        console.error(`Bing Fetch Error (${query}):`, e.message);
        return [];
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { market } = req.query;
    let allNews = [];

    // Blacklist for US/Crypto noise in SA/EG
    const BLACKLIST = ['Benzinga', 'The Telegraph', 'GlobeNewswire', 'PR Newswire', 'Business Wire', 'Zacks', 'Motley Fool'];

    try {
        // **UNIFIED NEWS STRATEGY - ALL REQUIRED SOURCES**
        // Egypt: Mubasher, Zawya, Egypt Today, Daily News Egypt, Arab Finance, Investing.com
        // Saudi: Mubasher, Argaam, Bloomberg, Reuters, Investing.com, Arab News

        if (market === 'SA') {
            // 1. Mubasher scraper (PRIMARY)
            const mubasherNews = await scrapeMubasher('SA');
            allNews.push(...mubasherNews);

            // 2. Google News (High Volume)
            const googleQueries = [
                'site:argaam.com',
                'site:english.mubasher.info Saudi',
                'site:reuters.com Saudi',
                'site:bloomberg.com Saudi',
                'site:arabnews.com stock',
                'site:investing.com Saudi'
            ];
            for (const query of googleQueries) {
                const news = await fetchGoogleNews(query, 5);
                allNews.push(...news);
            }

            // 3. Bing News (Strict - Approved Sources Only)
            // Fallback: Query explicitly allowed domains to avoid pollution
            const strictBingQuery = '(site:english.mubasher.info OR site:argaam.com OR site:bloomberg.com OR site:reuters.com OR site:investing.com OR site:arabnews.com) Saudi stock';
            try {
                const news = await fetchBingNews(strictBingQuery, 5);
                allNews.push(...news);
            } catch (e) { }

        } else if (market === 'EG') {
            // 1. Mubasher scraper (Direct)
            const mubasherNews = await scrapeMubasher('EG');
            allNews.push(...mubasherNews);

            // 2. Google News (High Volume)
            const googleQueries = [
                'site:english.mubasher.info Egypt',
                'site:zawya.com Egypt',
                'site:egypttoday.com',
                'site:dailynewsegypt.com',
                'site:arabfinance.com',
                'site:investing.com Egypt'
            ];
            for (const query of googleQueries) {
                const news = await fetchGoogleNews(query, 5);
                allNews.push(...news);
            }

            // 3. Bing News (Strict - Approved Sources Only)
            const strictBingQuery = '(site:english.mubasher.info OR site:zawya.com OR site:egypttoday.com OR site:dailynewsegypt.com OR site:arabfinance.com OR site:investing.com) Egypt';
            try {
                const news = await fetchBingNews(strictBingQuery, 5);
                allNews.push(...news);
            } catch (e) { }

        } else if (market === 'US') {
            // Yahoo Finance (PRIMARY for US)
            const yahooNews = await fetchYahooNews(['S&P 500', 'Stock Market', 'NASDAQ', 'Wall Street'], 10);
            allNews.push(...yahooNews);

            // Bing RSS (SECONDARY)
            const bingNews = await fetchBingNews('Wall Street stocks NASDAQ', 5);
            allNews.push(...bingNews);

        } else {
            // Default: Global markets
            const yahooNews = await fetchYahooNews(['Global Stock Markets'], 5);
            allNews.push(...yahooNews);
        }

        // Deduplicate and Filter
        const seen = new Set();
        const uniqueNews = allNews.filter(item => {
            if (!item || !item.title) return false;

            // Strict Filter for EG/SA (Case Insensitive)
            if ((market === 'SA' || market === 'EG')) {
                const pub = (item.publisher || '').toLowerCase();
                const blacklistLower = BLACKLIST.map(b => b.toLowerCase());
                if (blacklistLower.some(b => pub.includes(b))) return false;
            }

            const cleanTitle = item.title.trim().toLowerCase().substring(0, 50);
            if (seen.has(cleanTitle)) return false;
            seen.add(cleanTitle);
            return true;
        });

        // Add placeholder images where missing
        const finalNews = uniqueNews.map(item => ({
            ...item,
            thumbnail: item.thumbnail || 'https://placehold.co/600x400/f1f5f9/475569?text=News'
        }));

        // Sort by time (newest first)
        finalNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Return fallback if empty
        if (finalNews.length === 0) {
            return res.status(200).json([{
                id: 'fallback',
                title: 'Market News Currently Unavailable',
                publisher: 'System',
                link: '#',
                time: new Date().toISOString(),
                thumbnail: 'https://placehold.co/600x400/f1f5f9/475569?text=No+News'
            }]);
        }

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json(finalNews.slice(0, 40));

    } catch (e) {
        console.error("News API Error:", e);
        res.status(200).json([{
            id: 'error',
            title: 'Failed to load news',
            publisher: 'System',
            link: '#',
            time: new Date().toISOString(),
            thumbnail: 'https://placehold.co/600x400/f1f5f9/475569?text=Error'
        }]);
    }
}
