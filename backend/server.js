
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { updateStockPrices, getStocks, SAUDI_STOCKS, EGYPT_STOCKS, GLOBAL_TICKERS } = require('./jobs/updateStockPrices');
const { updateStockProfiles } = require('./jobs/updateStockProfiles');
const { startScheduler: startNewsScheduler, getCachedNews } = require('./jobs/newsScraper');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy for Images (to bypass CORS/Hotlinking protection)
app.get('/api/proxy-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send('URL required');

        const axios = require('axios');
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': new URL(url).origin
            }
        });

        res.set('Content-Type', response.headers['content-type']);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.send(response.data);
    } catch (e) {
        res.redirect('https://placehold.co/600x400/f1f5f9/475569?text=Image+Error');
    }
});

// Update Jobs
const updateAllData = async () => {
    console.log('⚡ Starting high-frequency price updates (every 5s)...');

    // Initial Price Update
    await updateStockPrices();

    // Profile Update (All Markets) - Run once on startup
    const allSymbols = [...SAUDI_STOCKS, ...EGYPT_STOCKS, ...GLOBAL_TICKERS.filter(s => !s.startsWith('^'))];
    updateStockProfiles(allSymbols);
};

updateAllData();

// Routes
app.get('/', (req, res) => {
    res.send('Mubasher Stock Game API is Live! 🚀');
});

// Get stocks with market filter
app.get('/api/stocks', (req, res) => {
    const { market } = req.query;
    let stocks = getStocks();

    // Filter by market if specified
    if (market === 'SA') {
        stocks = stocks.filter(s => s.symbol.endsWith('.SR') || s.symbol.includes('TASI'));
    } else if (market === 'EG') {
        stocks = stocks.filter(s => s.symbol.endsWith('.CA') || s.symbol.includes('CASE') || s.symbol.includes('EGX'));
    } else if (market === 'Global') {
        stocks = stocks.filter(s => !s.symbol.endsWith('.SR') && !s.symbol.endsWith('.CA'));
    }

    res.json(stocks);
});

// Get Chart Data
app.get('/api/chart', async (req, res) => {
    const { symbol, range = '1d' } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        const yahooFinance = require('yahoo-finance2').default;

        let interval = '1d';
        let queryRange = range;

        // Map frontend ranges to Yahoo API standard
        switch (range) {
            case '1D': queryRange = '1d'; interval = '5m'; break;
            case '5D': queryRange = '5d'; interval = '15m'; break;
            case '1M': queryRange = '1mo'; interval = '60m'; break;
            case '6M': queryRange = '6mo'; interval = '1d'; break;
            case 'YTD': queryRange = 'ytd'; interval = '1d'; break;
            case '1Y': queryRange = '1y'; interval = '1d'; break;
            case '5Y': queryRange = '5y'; interval = '1wk'; break;
            case 'Max': queryRange = 'max'; interval = '1mo'; break;
            default: queryRange = '1d'; interval = '5m';
        }

        const result = await yahooFinance.chart(symbol, {
            period1: '2020-01-01', // Required by validation, overridden by range
            range: queryRange,
            interval: interval,
            includePrePost: false
        });

        // Filter and map only necessary data to save bandwidth
        const data = (result.quotes || []).map(q => ({
            date: q.date,
            price: q.close || q.open // Fallback if close is missing
        })).filter(q => q.price != null);

        res.json({
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            granularity: result.meta.dataGranularity,
            range: result.meta.range,
            quotes: data
        });

    } catch (error) {
        console.error(`Chart fetch error for ${symbol}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

// Translate text using Google Translate (free API)
app.post('/api/translate', async (req, res) => {
    const { text, targetLang = 'ar' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    try {
        const axios = require('axios');

        // Use Google Translate free API
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            },
            timeout: 10000
        });

        // Parse the response - it's a nested array
        const translations = response.data[0];
        let translatedText = '';

        if (translations) {
            translations.forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }

        res.json({ translatedText: translatedText || text });
    } catch (error) {
        console.error('Translation failed:', error.message);
        res.status(500).json({ error: 'Translation failed', original: text });
    }
});

// Extract full article content
app.get('/api/news/content', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        const axios = require('axios');
        const cheerio = require('cheerio');

        const userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (compatible; Googlebot/2.1)';

        const response = await axios.get(url, {
            headers: { 'User-Agent': userAgent, 'Accept': 'text/html' },
            timeout: 8000
        });

        const $ = cheerio.load(response.data);
        $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();

        let content = '';
        const selectors = ['[data-test-id="post-content"]', '.caas-body', 'article', '.article-body', 'main'];

        for (const selector of selectors) {
            if ($(selector).length > 0) {
                $(selector).find('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 40) content += `<p>${text}</p>`;
                });
                if (content.length > 500) break;
            }
        }

        // Fallback
        if (content.length < 200) {
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                if (text.length > 60 && !text.includes('Copyright')) {
                    content += `<p>${text}</p>`;
                }
            });
        }

        if (!content || content.length < 100) {
            let publisher = 'the source';
            try { publisher = new URL(url).hostname.replace('www.', ''); } catch (e) { }
            content = `<p>Content is protected. <a href="${url}" target="_blank">Read on ${publisher} →</a></p>`;
        }

        res.json({ content });
    } catch (error) {
        console.error('Content extract failed:', error.message);
        res.json({ content: '<p>Unable to load content. Please view the original source.</p>' });
    }
});

// Get market news
const newsCache = {};

// Helper: Fetch Google News RSS matching Vercel logic
async function fetchGoogleNews(query, count = 5) {
    try {
        const Parser = require('rss-parser');
        const parser = new Parser({
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });

        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            let publisher = 'News';
            let title = item.title;
            const parts = title.split(' - ');
            if (parts.length > 1) {
                publisher = parts.pop();
                title = parts.join(' - ');
            }

            if (publisher.toLowerCase().includes('mubasher')) publisher = 'Mubasher';
            else if (publisher.toLowerCase().includes('argaam')) publisher = 'Argaam';
            else if (publisher.toLowerCase().includes('zawya')) publisher = 'Zawya';

            let image = null;
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

// Batch extract images for news items without thumbnails
async function enrichNewsWithImages(newsItems) {
    const limit = 5; // Limit concurrent requests
    const itemsNeedingEnrichment = newsItems.filter(item =>
        (!item.thumbnail || item.thumbnail.includes('placehold.co') || !item.summary || item.summary.length < 100)
    ).slice(0, 8);

    // Limit concurrent requests
    const limits = 5;
    for (let i = 0; i < itemsNeedingEnrichment.length; i += limits) {
        const batch = itemsNeedingEnrichment.slice(i, i + limits);
        await Promise.all(batch.map(async (item) => {
            try {
                // 1. Resolve URL if it's a Google Redirect
                let targetUrl = item.link;
                if (item.link.includes('news.google.com')) {
                    try {
                        const axios = require('axios'); // Ensure axios is available in scope
                        const response = await axios.get(item.link, {
                            maxRedirects: 5,
                            timeout: 5000,
                            headers: { 'User-Agent': 'Mozilla/5.0' },
                            validateStatus: () => true
                        });
                        targetUrl = response.request?.res?.responseUrl || item.link;
                        item.link = targetUrl;
                    } catch (e) { /* ignore */ }
                }

                // 2. Fetch the actual page
                const axios = require('axios'); // Ensure axios is available in scope
                const cheerio = require('cheerio'); // Ensure cheerio is available in scope
                const response = await axios.get(targetUrl, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });

                const $ = cheerio.load(response.data);

                // 3. Extract Image
                let image = $('meta[property="og:image"]').attr('content');
                if (!image) image = $('meta[name="twitter:image"]').attr('content');
                if (!image) image = $('article img').first().attr('src');

                // Fix relative URLs
                if (image && !image.startsWith('http')) {
                    try {
                        const base = new URL(targetUrl);
                        image = new URL(image, base.origin).href;
                    } catch (e) { }
                }

                // 4. Extract Content (Summary)
                $('script, style, nav, footer, header, .ad, .social, .menu').remove();
                let text = $('article').text() || $('main').text() || $('body').text();
                text = text.replace(/\s+/g, ' ').trim();

                if (image && (!item.thumbnail || item.thumbnail.includes('placehold.co'))) {
                    item.thumbnail = image;
                }

                if (text && text.length > 100) {
                    item.summary = text.substring(0, 300) + '...';
                }

            } catch (error) {
                // console.error(`Enrichment failed for ${item.link}: ${error.message}`);
            }
        }));
    }

    return newsItems;
}



// News Fetching Logic (Background)
// Helper: Scrape Mubasher Direct (Mirrors Vercel)
async function scrapeMubasher(market = 'SA') {
    const articles = [];
    const url = market === 'SA'
        ? 'https://english.mubasher.info/markets/TDWL'
        : 'https://english.mubasher.info/countries/eg';

    try {
        console.log(`Scraping Mubasher for ${market}...`);
        const axios = require('axios');
        const cheerio = require('cheerio');

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html'
            },
            timeout: 10000
        });
        const $ = cheerio.load(response.data);
        const links = new Set();

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/\/news\/\d+\//)) {
                const fullUrl = href.startsWith('http') ? href : 'https://english.mubasher.info' + href;
                links.add(fullUrl);
            }
        });

        const uniqueLinks = Array.from(links).slice(0, 8);
        const articlePromises = uniqueLinks.map(async (link) => {
            try {
                const pageRes = await axios.get(link, { timeout: 5000 });
                const $page = cheerio.load(pageRes.data);
                const title = $page('h1').first().text().trim();
                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('.article-image img').attr('src');
                if (image && !image.startsWith('http')) image = 'https://english.mubasher.info' + image;
                const dateStr = $page('time').attr('datetime') || new Date().toISOString();

                if (title) {
                    return {
                        id: link,
                        title: title,
                        publisher: 'Mubasher',
                        link: link,
                        time: new Date(dateStr).toISOString(),
                        thumbnail: image || 'https://placehold.co/600x400/f1f5f9/475569?text=Mubasher',
                        summary: ''
                    };
                }
            } catch (e) { }
        });

        const results = await Promise.all(articlePromises);
        return results.filter(i => i);
    } catch (e) {
        console.error('Mubasher scrape failed:', e.message);
        return [];
    }
}

// News Fetching Logic (Background)
async function fetchNewsForMarket(market) {
    console.log('Background fetching news for: ' + market);
    let allNews = [];
    const BLACKLIST = ['Benzinga', 'The Telegraph', 'GlobeNewswire', 'PR Newswire', 'Business Wire', 'Zacks', 'Motley Fool'];

    try {
        if (market === 'SA') {
            // 1. Mubasher
            const mubasher = await scrapeMubasher('SA');
            allNews.push(...mubasher);

            // 2. Google News
            const googleQueries = [
                'site:argaam.com',
                'site:english.mubasher.info Saudi',
                'site:reuters.com Saudi',
                'site:bloomberg.com Saudi',
                'site:arabnews.com stock',
                'site:investing.com Saudi'
            ];
            for (const q of googleQueries) allNews.push(...await fetchGoogleNews(q));

            // 3. Bing (via RSS Parser)
            // ...

        } else if (market === 'EG') {
            // 1. Mubasher
            const mubasher = await scrapeMubasher('EG');
            allNews.push(...mubasher);

            // 2. Google News
            const googleQueries = [
                'site:english.mubasher.info Egypt',
                'site:zawya.com Egypt',
                'site:egypttoday.com',
                'site:dailynewsegypt.com',
                'site:arabfinance.com',
                'site:investing.com Egypt'
            ];
            for (const q of googleQueries) allNews.push(...await fetchGoogleNews(q));

        } else {
            // Default: Global/US
            const yahooFinance = require('yahoo-finance2').default;
            const results = await yahooFinance.search('Stock Market', { newsCount: 10 });
            if (results.news) {
                const yItems = results.news.map(n => ({
                    id: n.uuid,
                    title: n.title,
                    publisher: n.providerPublishTime ? 'Yahoo' : 'Yahoo',
                    link: n.link,
                    time: new Date(n.providerPublishTime * 1000).toISOString(),
                    thumbnail: n.thumbnail?.resolutions?.[0]?.url
                }));
                allNews.push(...yItems);
            }
        }

    } catch (e) {
        console.error('Fetch Market News Error:', e);
    }

    // Deduplicate and Filter Blacklist
    const seen = new Set();
    const filteredNews = allNews.filter(item => {
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

    // Sort by time
    filteredNews.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Update Cache
    newsCache[market] = { data: filteredNews, time: Date.now() };
    console.log(`✅ Cached ${filteredNews.length} articles for ${market}`);

    return filteredNews;
}



// Background Poller (Updates every 5 minutes)
setTimeout(async () => {
    console.log('⚡ Initializing News Cache...');

    // Start robust scraper
    startNewsScheduler(15); // Run every 15 mins for full scrape

    // Initial fetch staggered to avoid load
    // Initial fetch (likely cached data or empty)
    const fetchAll = async () => {
        fetchNewsForMarket('SA');
        await new Promise(r => setTimeout(r, 2000));
        fetchNewsForMarket('EG');
        await new Promise(r => setTimeout(r, 2000));
        fetchNewsForMarket('US');
    };
    await fetchAll();

    // Retry after 45s to capture fresh scraped data from background job
    setTimeout(() => {
        console.log('🔄 Syncing fresh news data...');
        fetchAll();
    }, 45000);
}, 1000);

setInterval(() => {
    console.log('🔄 Background Refreshing News...');
    fetchNewsForMarket('SA');
    fetchNewsForMarket('EG');
    fetchNewsForMarket('US');
}, 5 * 60 * 1000);

// Get market news (Instant Response)
app.get('/api/news', async (req, res) => {
    const { market } = req.query;

    // Return cached data immediately if available
    if (newsCache[market] && newsCache[market].data) {
        return res.json(newsCache[market].data);
    }

    // If no cache, wait max 3 seconds for background fetch, else return empty
    const startTime = Date.now();
    const maxWait = 3000; // 3 seconds max

    const waitForCache = () => new Promise(resolve => {
        const check = () => {
            if (newsCache[market] && newsCache[market].data) {
                resolve(newsCache[market].data);
            } else if (Date.now() - startTime > maxWait) {
                resolve([]); // Timeout - return empty
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });

    const data = await waitForCache();
    res.json(data);
});

const articleCache = {};

// Helper: Translate Text for Server use
async function translateTextInternal(text, targetLang = 'en') {
    if (!text) return '';
    try {
        const axios = require('axios');
        // Split into chunks if too large (naive split by paragraphs)
        if (text.length > 3000) {
            const parts = text.match(/[\s\S]{1,3000}/g) || [text];
            const translatedParts = await Promise.all(parts.map(p => translateTextInternal(p, targetLang)));
            return translatedParts.join(' ');
        }

        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'auto',
                tl: targetLang,
                dt: 't',
                q: text
            },
            timeout: 8000
        });

        const translations = response.data[0];
        let translatedText = '';
        if (translations) {
            translations.forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }
        return translatedText;
    } catch (error) {
        console.warn('Internal translation failed:', error.message);
        return text;
    }
}

// Get full article content (Scraping)
app.get('/api/news/content', async (req, res) => {
    const { url, title } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Cache check (1 hour)
    if (articleCache[url] && (Date.now() - articleCache[url].time < 3600000)) {
        return res.json({ content: articleCache[url].content });
    }

    try {
        const axios = require('axios');
        const cheerio = require('cheerio');

        let targetUrl = url;

        // Google News links redirect - follow them properly
        if (url.includes('news.google.com')) {
            try {
                // Method 1: Follow redirects with axios
                const response = await axios.get(url, {
                    maxRedirects: 10,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml'
                    },
                    timeout: 12000,
                    validateStatus: () => true
                });

                // Check final URL after redirects
                if (response.request && response.request.res && response.request.res.responseUrl) {
                    targetUrl = response.request.res.responseUrl;
                } else if (response.headers && response.headers.location) {
                    targetUrl = response.headers.location;
                }

                // If still a Google URL, try to extract from HTML
                if (targetUrl.includes('news.google.com') || targetUrl.includes('google.com/rss')) {
                    const $ = cheerio.load(response.data);
                    // Look for canonical or og:url
                    const canonical = $('link[rel="canonical"]').attr('href');
                    const ogUrl = $('meta[property="og:url"]').attr('content');
                    const jsRedirect = response.data.match(/window\.location\s*=\s*["']([^"']+)["']/);

                    targetUrl = canonical || ogUrl || (jsRedirect && jsRedirect[1]) || url;
                }

                console.log('Resolved Google News to: ' + targetUrl);
            } catch (e) {
                console.warn('Google redirect failed:', e.message);
            }
        }

        const https = require('https');
        const agent = new https.Agent({
            rejectUnauthorized: false,
            maxHeaderSize: 64 * 1024 // 64KB for large headers
        });

        let data = '';
        try {
            // Fetch the actual article
            const response = await axios.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://news.google.com/'
                },
                timeout: 15000,
                maxRedirects: 10,
                httpsAgent: agent
            });
            data = response.data;
        } catch (fetchErr) {
            console.warn(`Main fetch failed for ${targetUrl}: ${fetchErr.message}. Proceeding to fallback.`);
        }

        const $ = cheerio.load(data || '');

        // Remove unwanted elements BEFORE extraction
        $('script, style, nav, header, footer, aside, .advertisement, .ad, .sidebar, .related-articles, .social-share, .comments, .newsletter, .subscription, [role="navigation"], [role="banner"]').remove();

        // Selectors for major news sites (ordered by specificity)
        let content = data ? (
            // Discovery Alert / Specific sites
            $('.article-text').html() ||
            $('.article-content-body').html() ||
            // ... (rest of selectors) ...
            $('.article-content').html() ||
            $('.article__body').html() ||
            $('.story-content').html() ||
            // Reuters
            $('.article-body__content').html() ||
            $('[class*="ArticleBody"]').html() ||
            $('[data-testid="article-body"]').html() ||
            // Mubasher
            $('.story-body').html() ||
            $('.news-details').html() ||
            $('#article-body').html() ||
            // Argaam
            $('#articleContent').html() ||
            // Yahoo
            $('.caas-body').html() ||
            // Investing.com
            $('.articlePage').html() ||
            // MarketWatch
            $('.article__body').html() ||
            // Generic selectors
            $('article .content').html() ||
            $('article').html() ||
            $('.post-content').html() ||
            $('.entry-content').html() ||
            $('[itemprop="articleBody"]').html() ||
            $('main article').html() ||
            $('.main-content').html()
        ) : null;

        // 1. Teaser / junk detection
        const textOnlyVal = (content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const teaserPatterns = [
            /This is a developing story available on/i,
            /Read the full article on/i,
            /Continue reading at/i,
            /requires a subscription/i,
            /To read this article/i,
            /Please enable Javascript/i,
            /Access this article/i,
            /Investor's Business Daily/i,
            /Zacks/i
        ];

        // If content matches a teaser pattern, treat it as empty to force fallback
        if (content && teaserPatterns.some(p => p.test(textOnlyVal))) {
            console.log('Detected teaser content. invalidating...');
            content = null;
        }

        if (!content) {
            const paragraphs = [];
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                // Avoid utility links
                if (text.length > 50 && !text.includes('Copyright') && !text.includes('All rights reserved')) {
                    paragraphs.push('<p>' + text + '</p>');
                }
            });
            if (paragraphs.length > 0) content = paragraphs.join('');
        }

        // --- FALLBACK MECHANISM ---
        // If content is still empty or too short, try to find an alternative source via Bing
        if ((!content || content.length < 500) && title) {
            console.log('Content too short/empty/teaser. Attempting Robust Fallback for:', title);

            const originalDomain = new URL(targetUrl).hostname.replace('www.', '');

            try {
                // 1. Perform a broad search first (Title + -site:original)
                // This finds syndications on Yahoo, MSN, etc.
                const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(title + ' -site:' + originalDomain)}&format=rss&mkt=en-us`;
                const rssResp = await axios.get(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
                const $rss = cheerio.load(rssResp.data, { xmlMode: true });

                const items = $rss('item');
                let bestUrl = null;

                // Priority Domains for Full Content
                const priorityDomains = ['finance.yahoo.com', 'msn.com', 'cnbc.com', 'reuters.com', 'bloomberg.com'];

                // Strategy: Find first priority domain, otherwise take first valid result
                items.each((i, el) => {
                    if (bestUrl) return; // Found one already

                    const link = $rss(el).find('link').text();
                    let realLink = link;
                    try {
                        const u = new URL(link);
                        const r = u.searchParams.get('url');
                        if (r) realLink = r;
                    } catch (e) { }

                    const domain = new URL(realLink).hostname;

                    // Check priority
                    if (priorityDomains.some(d => domain.includes(d))) {
                        bestUrl = realLink;
                    }
                });

                // If no priority found, take the first one that isn't the original
                if (!bestUrl && items.length > 0) {
                    const link = items.first().find('link').text();
                    let realLink = link;
                    try {
                        const u = new URL(link);
                        const r = u.searchParams.get('url');
                        if (r) realLink = r;
                    } catch (e) { }
                    if (!realLink.includes(originalDomain)) {
                        bestUrl = realLink;
                    }
                }

                if (bestUrl) {
                    console.log('Fallback found better source:', bestUrl);
                    const fbResp = await axios.get(bestUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                        timeout: 10000
                    });
                    const $fb = cheerio.load(fbResp.data);

                    // Cleanup
                    $fb('script, style, nav, header, footer, aside, .ad, .social, button, .button').remove();

                    // Specific Extractors
                    let fbContent = '';

                    // YAHOO FINANCE
                    if (bestUrl.includes('yahoo.com')) {
                        fbContent = $fb('.caas-body').html() || $fb('.body').html();
                    }
                    // MSN
                    else if (bestUrl.includes('msn.com')) {
                        fbContent = $fb('article').html() || $fb('.article-body').html();
                    }
                    // GENERIC
                    else {
                        fbContent = $fb('article').html() ||
                            $fb('.main-content').html() ||
                            $fb('[itemprop="articleBody"]').html();
                    }

                    // Fallback Text Extraction if HTML fails
                    if (!fbContent) {
                        const ps = [];
                        $fb('p').each((i, el) => {
                            if ($fb(el).text().trim().length > 60) ps.push(`<p>${$fb(el).text().trim()}</p>`);
                        });
                        if (ps.length > 0) fbContent = ps.join('');
                    }

                    if (fbContent && fbContent.length > 200) {
                        content = fbContent;
                        console.log('Replaced content with High Quality Fallback.');
                    }
                }

            } catch (e) {
                console.warn('Fallback loop failed:', e.message);
            }
        }
        // --------------------------

        if (content) {
            // Clean up content - Aggressive Cleaning
            content = content
                // Remove scripts, styles, and empty comments
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<!--[\s\S]*?-->/g, "")

                // Remove specific Mubasher metadata lines (Date/Time patterns)
                .replace(/\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM)/gi, "")
                .replace(/Start typing to search/gi, "")

                // Remove unwanted containers
                .replace(/<div\b[^>]*class="[^"]*mi-article__main-image[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")
                .replace(/<div\b[^>]*id="div-share[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")
                .replace(/<div\b[^>]*class="[^"]*share[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")

                // Remove "Related News" and Sources sections
                .replace(/<p\b[^>]*>.*?Source\s*:\s*.*?<\/p>/gim, "")
                .replace(/<p\b[^>]*>.*?Related News.*?<\/p>/gim, "")
                .replace(/<strong>Related News.*?<\/strong>/gim, "")

                // AGGRESSIVE WHITESPACE CLEANING
                // 2. Remove empty paragraphs
                .replace(/<p[^>]*>[\s\u00A0]*<\/p>/gim, "")
                // 3. Remove multiple newlines
                .replace(/\n\s*\n/g, "\n");

            // Valid Title Deduplication
            if (title) {
                // remove strictly match (only if it's the exact start)
                const cleanTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Only remove if it appears at the very beginning or inside a likely header tag at the start
                const titleRegex = new RegExp('^\\s*(<[^>]+>\\s*)*' + cleanTitle + '\\s*(<\\/[^>]+>)*', 'i');
                content = content.replace(titleRegex, "");
            }

            // Trim output
            content = content.trim();

            // Additional Check: Remove leading "subtitle" if it's just the title again
            // often Mubasher puts title in a <div class="news-title"> inside the body
            content = content.replace(/^<div[^>]*class="[^"]*title[^"]*"[^>]*>.*?<\/div>/i, "");

            // --- AUTO-TRANSLATE IF ARABIC DETECTED ---
            // Check for Arabic characters ratio
            const textOnly = content.replace(/<[^>]*>/g, '');
            const arabicCount = (textOnly.match(/[\u0600-\u06FF]/g) || []).length;
            const totalCount = textOnly.length;

            if (totalCount > 0 && (arabicCount / totalCount) > 0.2) {
                console.log('Detected Arabic content. Auto-translating...');

                // We need to translate text node by node to preserve basic formatting? 
                // OR just strip tags, translate, and wrap in Paragraphs (Simpler and often cleaner for translated news)
                // Let's try to preserve Paragraphs.

                const $c = cheerio.load(content);
                const paragraphs = [];
                $c('p, div, h1, h2, h3').each((i, el) => {
                    const txt = $(el).text().trim();
                    if (txt.length > 20) paragraphs.push(txt);
                });

                // If structure is flat text
                if (paragraphs.length === 0 && textOnly.length > 20) {
                    paragraphs.push(textOnly);
                }

                // Translate chunks
                const translatedParagraphs = await Promise.all(paragraphs.map(p => translateTextInternal(p, 'en')));
                content = translatedParagraphs.map(p => `<p>${p}</p>`).join('');

                console.log('Translation complete.');
            }
            // -----------------------------------------

            // Save to Cache
            articleCache[url] = { content, time: Date.now() };

            res.json({ content });
        } else {
            res.status(404).json({ error: 'Content extraction failed' });
        }
    } catch (error) {
        console.error('Scraping failed:', error);
        res.status(500).json({ error: 'Failed to fetch article', details: error.message, stack: error.stack });
    }
});

// AI Insight Endpoint
// AI Insight Endpoint
app.get('/api/ai-insight', async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        const yahoo = require('yahoo-finance2').default;

        // Determine Market & Name
        let market = 'US';
        let stockName = symbol;
        if (symbol.endsWith('.SR')) {
            market = 'SA';
            stockName = SAUDI_STOCKS[symbol.replace('.SR', '')]?.name || symbol;
        } else if (symbol.endsWith('.CA')) {
            market = 'EG';
            stockName = EGYPT_STOCKS[symbol.replace('.CA', '')]?.name || symbol;
        }

        // Simplify name for searching (e.g. "Saudi Aramco" -> "Aramco")
        const searchName = stockName.split(' ')[0].length > 3 ? stockName.split(' ')[0] : stockName;

        // Parallel fetch: Yahoo Quote + Yahoo News + Our Cached News
        const [quote, searchRes] = await Promise.all([
            yahoo.quote(symbol),
            yahoo.search(symbol, { newsCount: 5 })
        ]);

        const change = quote.regularMarketChangePercent || 0;

        // --- 1. Gather Yahoo News ---
        const yahooNews = (searchRes.news || []).map(n => ({
            title: n.title,
            publisher: n.publisher,
            link: n.link,
            time: new Date(n.providerPublishTime).toISOString(),
            source: 'Yahoo'
        }));

        // --- 2. Gather Cached Helper News ---
        const cachedArticles = getCachedNews(market);
        const relevantCached = cachedArticles.filter(n => {
            // Match by Ticker or Name in Title/Content
            const text = (n.title + ' ' + n.content).toLowerCase();
            const symbolBase = symbol.replace(/\.(SR|CA)/, '').toLowerCase();
            return text.includes(searchName.toLowerCase()) || text.includes(symbolBase);
        }).map(n => ({
            title: n.title,
            publisher: n.source || n.publisher,
            link: n.url,
            time: n.published_at,
            source: 'Scraper'
        }));

        // Combine & Sort
        let allNews = [...relevantCached, ...yahooNews];
        allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Use strict 7-day filter ONLY for US market. For Emerging (SA/EG), use all available (or 30 days) as volume is lower.
        // User requested: "full period not only 1 week for saudi and egypt"
        let validNews = allNews;
        if (market === 'US') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            validNews = allNews.filter(n => new Date(n.time) > sevenDaysAgo);
        }

        // GENERATE "AI" RESPONSE
        let answer = "";

        if (validNews.length === 0) {
            // No-News Rule
            const options = [
                "No recent news found. Today’s move may reflect normal market activity.",
                "Market sentiment seems neutral with no specific catalyst detected.",
                "No clear news driver found. Check technical indicators."
            ];
            answer = options[Math.floor(Math.random() * options.length)];
        } else {
            // Smart Template Generation
            const topNews = validNews[0];
            const direction = change > 0.5 ? "advancing" : change < -0.5 ? "declining" : "steady";
            const changeText = Math.abs(change).toFixed(2) + "%";

            // Clean title
            let cleanTitle = topNews.title.split(' - ')[0];

            answer = `${stockName} is ${direction} (${changeText}) today. Investors are reacting to reports that "${cleanTitle}" as highlighted by ${topNews.publisher}.`;

            // Strict word limit
            const words = answer.split(' ');
            if (words.length > 45) {
                answer = words.slice(0, 45).join(' ') + "...";
            }
        }

        const response = {
            symbol,
            answer,
            sources: validNews.slice(0, 5), // Return top 5 sources
            timestamp: new Date().toISOString()
        };

        res.set('Cache-Control', 'public, max-age=60'); // Reduce cache to 60s for freshness
        res.json(response);

    } catch (error) {
        console.error('AI Insight error:', error);
        res.status(500).json({ error: 'Failed to generate insight' });
    }
});

// Manual trigger for price update
app.post('/api/update-prices', async (req, res) => {
    try {
        const result = await updateStockPrices();
        res.json({ success: true, count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Schedule High-Frequency Updates (Every 60 seconds)
console.log('⚡ Starting periodic price updates (every 60s)...');
setInterval(async () => {
    await updateStockPrices();
}, 60000);

// Proxy Image Endpoint (Fix specifically for Mubasher 403 blocking)
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL required');
    try {
        const axios = require('axios');
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': new URL(url).origin
            }
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        console.error("Proxy fail:", e.message);
        res.status(500).send('Image fetch failed');
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log('\\n🚀 Server running on http://localhost:' + PORT);

    // Initial fetch of static profiles (Fundamentals, etc.)
    await updateStockProfiles();

    // Initial fetch of live prices
    await updateStockPrices();
});
