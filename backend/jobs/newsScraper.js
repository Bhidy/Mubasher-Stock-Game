/**
 * News Scraper Module
 * Production-grade scraper for Egypt (EGX) and Saudi Arabia (TDWL) stock market news
 * 
 * Sources covered:
 * - Argaam (SA)
 * - Saudi Exchange (SA)
 * - Zawya (Regional)
 * - EGX (EG)
 * - Arab Finance (EG)
 * - Mubasher (EG/SA)
 * - Enterprise (EG)
 * - Maaal (SA)
 * - Aleqt (SA)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Data file for storing scraped news
const NEWS_CACHE_FILE = path.join(__dirname, '../data/scraped_news.json');

// In-memory cache
let newsCache = [];
let processedUrls = new Set();

// Company/Ticker mappings for enrichment
const TICKER_MAP = {
    // Saudi
    'aramco': '2222.SR',
    'saudi aramco': '2222.SR',
    'al rajhi': '1120.SR',
    'al rajhi bank': '1120.SR',
    'sabic': '2010.SR',
    'stc': '7010.SR',
    'saudi telecom': '7010.SR',
    'ncb': '1180.SR',
    'snb': '1180.SR',
    'acwa power': '2082.SR',
    'ma\'aden': '1211.SR',
    'tadawul': 'TDWL',
    // Egypt
    'cib': 'COMI.CA',
    'commercial international bank': 'COMI.CA',
    'efg hermes': 'HRHO.CA',
    'orascom': 'ORAS.CA',
    'telecom egypt': 'ETEL.CA',
    'eastern company': 'EAST.CA',
    'tmg holding': 'TMGH.CA',
    'talaat moustafa': 'TMGH.CA',
    'elsewedy': 'SWDY.CA',
    'egx': 'EGX'
};

// Keywords for relevance filtering
const MARKET_KEYWORDS = [
    'stock', 'shares', 'trading', 'market', 'index', 'egx', 'tadawul', 'tasi',
    'dividend', 'earnings', 'capital', 'ipo', 'rights issue', 'profit', 'revenue',
    'quarterly', 'annual', 'results', 'disclosed', 'announced', 'board', 'agm',
    'shareholders', 'acquisition', 'merger', 'listing', 'delisting', 'sukuk', 'bond'
];

// HTTP client with retry and backoff
async function fetchWithRetry(url, options = {}, retries = 3) {
    const defaultOptions = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000,
        maxRedirects: 5
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, { ...defaultOptions, ...options });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
        }
    }
}

// Simple language detection (checks if mostly English)
function isEnglish(text) {
    if (!text) return false;
    // Count Arabic characters
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    // If less than 20% Arabic, consider it English
    return arabicChars / totalChars < 0.2;
}

// Check if article is market-related
function isMarketRelated(article) {
    const text = `${article.title} ${article.content}`.toLowerCase();
    return MARKET_KEYWORDS.some(keyword => text.includes(keyword));
}

// Extract tickers from text
function extractTickers(text) {
    const tickers = [];
    const lowerText = text.toLowerCase();

    for (const [name, ticker] of Object.entries(TICKER_MAP)) {
        if (lowerText.includes(name)) {
            if (!tickers.includes(ticker)) tickers.push(ticker);
        }
    }

    return tickers;
}

// Clean HTML content
function cleanContent(html) {
    if (!html) return '';
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement, .social, .share, .comments, .related').remove();

    // Get text
    let text = $('body').text() || $.text();

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
}

// Extract image URL
function extractImage($, baseUrl = '') {
    // Try og:image first
    let image = $('meta[property="og:image"]').attr('content');
    if (image) return image.startsWith('http') ? image : baseUrl + image;

    // Try first article image
    image = $('article img').first().attr('src');
    if (image) return image.startsWith('http') ? image : baseUrl + image;

    // Try any main content image
    image = $('.article img, .content img, .post img').first().attr('src');
    if (image) return image.startsWith('http') ? image : baseUrl + image;

    return null;
}

// ============= SCRAPER MODULES =============

// Bing News RSS Helper (Better than Google - Clean Links)
async function fetchBingNewsRss(query, sourceName, country, market, mkt = 'en-us') {
    const articles = [];
    try {
        const Parser = require('rss-parser');
        const parser = new Parser();
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=${mkt}`;
        // Force en-us for English news, or use local if preferred. User wants English.

        const feed = await parser.parseURL(url);

        // Process items in parallel
        await Promise.all(feed.items.map(async (item) => {
            try {
                // Extract Real URL
                let finalUrl = item.link;
                try {
                    const urlObj = new URL(item.link);
                    const u = urlObj.searchParams.get('url');
                    if (u) finalUrl = u;
                } catch (e) { }

                if (!processedUrls.has(finalUrl)) {
                    let imageUrl = null;
                    let fullContent = item.contentSnippet || '';

                    // Enrich Content
                    try {
                        const pageResp = await fetchWithRetry(finalUrl);
                        if (pageResp) {
                            const $ = cheerio.load(pageResp);

                            // Image
                            imageUrl = $('meta[property="og:image"]').attr('content') ||
                                $('article img').first().attr('src') ||
                                $('.article-body img').first().attr('src');

                            if (imageUrl && !imageUrl.startsWith('http')) {
                                try { imageUrl = new URL(imageUrl, new URL(finalUrl).origin).href; } catch (e) { }
                            }

                            // Content
                            $('script, style, nav, footer, header, .ad, .social, .related').remove();
                            // Try common selectors
                            fullContent = $('article').text() ||
                                $('.article-body').text() ||
                                $('[class*="content"]').text() ||
                                $('main').text();

                            fullContent = (fullContent || '').replace(/\s+/g, ' ').trim().substring(0, 1500);
                        }
                    } catch (e) { /* ignore enrichment error */ }

                    // Allow item if we have at least a title
                    if (item.title) {
                        articles.push({
                            title: item.title,
                            url: finalUrl,
                            image_url: imageUrl,
                            published_at: item.pubDate || new Date().toISOString(),
                            source: sourceName || item.source || 'Market News',
                            country: country,
                            market: market,
                            content: fullContent,
                            tickers: extractTickers(item.title + ' ' + fullContent)
                        });
                    }
                }
            } catch (e) { }
        }));

    } catch (e) {
        console.warn(`Bing RSS ${query} failed:`, e.message);
    }
    return articles;
}

// Google News RSS Helper
async function fetchGoogleNewsRss(query, sourceName, country, market) {
    const articles = [];
    try {
        const Parser = require('rss-parser');
        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const encodedQuery = encodeURIComponent(query);
        const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=ar&gl=${country}&ceid=${country}:ar`;

        const feed = await parser.parseURL(url);

        // Process items in parallel batches
        const limit = 5;
        for (let i = 0; i < feed.items.length; i += limit) {
            const batch = feed.items.slice(i, i + limit);
            await Promise.all(batch.map(async (item) => {
                try {
                    if (!processedUrls.has(item.link)) {
                        let finalUrl = item.link;
                        let imageUrl = null;
                        let fullContent = item.contentSnippet || '';

                        // Enrich immediately
                        try {
                            // Resolve Redirect
                            const axios = require('axios');
                            // 1. Get final URL
                            if (item.link.includes('news.google.com')) {
                                const resp = await axios.get(item.link, {
                                    maxRedirects: 5,
                                    validateStatus: () => true,
                                    timeout: 5000,
                                    headers: { 'User-Agent': 'Mozilla/5.0' }
                                });
                                if (resp.request?.res?.responseUrl) {
                                    finalUrl = resp.request.res.responseUrl;
                                }
                            }

                            // 2. Fetch Content
                            const pageResp = await fetchWithRetry(finalUrl);
                            if (pageResp) {
                                const $ = cheerio.load(pageResp);

                                // Image
                                imageUrl = $('meta[property="og:image"]').attr('content') ||
                                    $('meta[name="twitter:image"]').attr('content') ||
                                    $('article img').first().attr('src');

                                if (imageUrl && !imageUrl.startsWith('http')) {
                                    try { imageUrl = new URL(imageUrl, new URL(finalUrl).origin).href; } catch (e) { }
                                }

                                // Content
                                $('script, style, nav, footer, header, .ad, .social').remove();
                                fullContent = $('article').text().trim() || $('main').text().trim() || $('p').text().substring(0, 500);
                                fullContent = fullContent.replace(/\s+/g, ' ').substring(0, 500);
                            }
                        } catch (e) { /* ignore enrichment error */ }

                        articles.push({
                            title: item.title,
                            url: finalUrl,
                            image_url: imageUrl,
                            published_at: item.pubDate,
                            source: sourceName,
                            country: country,
                            market: market,
                            content: fullContent,
                            tickers: extractTickers(item.title)
                        });
                    }
                } catch (e) {
                    // Skip item
                }
            }));
        }

    } catch (e) {
        console.warn(`${sourceName} Google RSS failed:`, e.message);
    }
    return articles;
}

// Argaam Scraper (Via Bing for reliability)
async function scrapeArgaam() {
    return await fetchBingNewsRss('site:argaam.com Saudi', 'Argaam', 'SA', 'TDWL');
}

// Zawya Scraper (Regional)
async function scrapeZawya() {
    const saudi = await fetchBingNewsRss('site:zawya.com Saudi', 'Zawya', 'SA', 'TDWL');
    const egypt = await fetchBingNewsRss('site:zawya.com Egypt', 'Zawya', 'EG', 'EGX');
    return [...saudi, ...egypt];
}

// EGX Official Scraper (Egypt)
async function scrapeEGX() {
    const articles = [];
    const baseUrl = 'https://www.egx.com.eg';

    try {
        const html = await fetchWithRetry(`${baseUrl}/en/News.aspx`);
        const $ = cheerio.load(html);

        // Parse news table/list (adjust selectors)
        $('tr, .news-item, [class*="news"]').each((i, el) => {
            const $el = $(el);
            const link = $el.find('a').first().attr('href');
            const title = $el.find('a').text().trim() || $el.find('td').first().text().trim();
            const date = $el.find('.date, td:last-child').text().trim();

            if (link && title && title.length > 10 && isEnglish(title) && !processedUrls.has(link)) {
                articles.push({
                    title,
                    url: link.startsWith('http') ? link : baseUrl + '/' + link,
                    image_url: null, // EGX typically doesn't have images
                    content: '',
                    published_at: date || new Date().toISOString(),
                    source: 'egx.com.eg',
                    country: 'EG',
                    market: 'EGX',
                    tickers: extractTickers(title)
                });
            }
        });
    } catch (error) {
        console.warn('EGX scrape failed:', error.message);
    }

    return articles;
}

// Mubasher Direct Scraper
async function scrapeMubasherWeb(country = 'eg') {
    const articles = [];
    // Use the landing pages that we verified work
    const url = country === 'eg'
        ? 'https://english.mubasher.info/countries/eg'
        : 'https://english.mubasher.info/markets/TDWL';

    try {
        console.log(`Scraping Mubasher (${country}) via direct landing page...`);
        const html = await fetchWithRetry(url);
        const $ = cheerio.load(html);
        const links = new Set();

        // Find article links (format: /news/ID/slug, avoiding categories)
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            // Strict check for digits in URL which implies article ID
            if (href && href.match(/\/news\/\d+\//)) {
                const fullUrl = href.startsWith('http') ? href : 'https://english.mubasher.info' + href;
                links.add(fullUrl);
            }
        });

        const uniqueLinks = Array.from(links).slice(0, 10); // Process top 10

        // Parallel fetch for details
        await Promise.all(uniqueLinks.map(async (link) => {
            try {
                if (processedUrls.has(link)) return;

                const pageHtml = await fetchWithRetry(link);
                const $page = cheerio.load(pageHtml);

                const title = $page('h1').first().text().trim();
                // Try og:image, then specific class images, then general article images
                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('.article-image img').attr('src') ||
                    $page('.hero-image img').attr('src') ||
                    $page('div[class*="content"] img').first().attr('src') ||
                    $page('article img').first().attr('src');

                // Ensure absolute URL
                if (image && !image.startsWith('http')) {
                    try {
                        image = new URL(image, 'https://english.mubasher.info').href;
                    } catch (e) { }
                }

                // Clean content - removing iframes explicitly
                $page('script, style, nav, footer, header, .ad, .social, .share, .comments, iframe').remove();

                // Content selectors (specific to Mubasher)
                let content = $page('div[class*="content"]').text() ||
                    $page('article').text() ||
                    $page('.main-content').text();

                content = (content || '').trim().replace(/\s+/g, ' ').substring(0, 1500);

                const dateStr = $page('time').attr('datetime') || new Date().toISOString();

                if (title && isEnglish(title) && content.length > 50) {
                    articles.push({
                        title,
                        url: link,
                        image_url: image, // Real image
                        content: content,
                        published_at: dateStr,
                        source: 'Mubasher',
                        country: country.toUpperCase(),
                        market: country === 'eg' ? 'EGX' : 'TDWL',
                        tickers: extractTickers(title + ' ' + content)
                    });
                }
            } catch (e) {
                // console.warn(`Mubasher detail failed for ${link}:`, e.message);
            }
        }));

    } catch (error) {
        console.warn(`Mubasher ${country} scrape failed:`, error.message);
    }

    return articles;
}

// Arab Finance Scraper (Via Bing for reliability)
async function scrapeArabFinance() {
    // Direct scraping was shaky, Bing is cleaner if indexed
    const bing = await fetchBingNewsRss('site:arabfinance.com', 'Arab Finance', 'EG', 'EGX');
    return bing;
}

// Saudi Exchange Scraper
async function scrapeSaudiExchange() {
    const articles = [];
    const baseUrl = 'https://www.saudiexchange.sa';

    try {
        // Note: Saudi Exchange may require special handling for dynamic content
        const html = await fetchWithRetry(`${baseUrl}/wps/portal/saudiexchange/news-and-announcements`);
        const $ = cheerio.load(html);

        $('tr, .announcement, .news-item, [class*="news"]').each((i, el) => {
            const $el = $(el);
            const link = $el.find('a').first().attr('href');
            const title = $el.find('a, .title, td:first-child').text().trim();
            const date = $el.find('.date, td:nth-child(2)').text().trim();

            if (link && title && title.length > 10 && isEnglish(title) && !processedUrls.has(link)) {
                articles.push({
                    title,
                    url: link.startsWith('http') ? link : baseUrl + link,
                    image_url: null,
                    content: '',
                    published_at: date || new Date().toISOString(),
                    source: 'saudiexchange.sa',
                    country: 'SA',
                    market: 'TDWL',
                    tickers: extractTickers(title)
                });
            }
        });
    } catch (error) {
        console.warn('Saudi Exchange scrape failed:', error.message);
    }

    return articles;
}

// Enterprise Press Scraper (Egypt)
async function scrapeEnterprise() {
    return await fetchBingNewsRss('site:enterprise.press', 'Enterprise', 'EG', 'EGX');
}

// Maaal Scraper (Saudi) - Via Bing + Auto Translate
async function scrapeMaaal() {
    const arabicArticles = await fetchBingNewsRss('site:maaal.com (سوق OR اقتصاد OR اسهم OR استثمار OR شركات)', 'Maaal', 'SA', 'TDWL', 'ar-sa');

    // Translate (Sequential)
    const translated = [];
    for (const article of arabicArticles) {
        try {
            const enTitle = await translateText(article.title);
            const enContent = await translateText(article.content);
            if (!hasArabic(enTitle)) {
                translated.push({ ...article, title: enTitle, content: enContent, isTranslated: true });
            }
        } catch (e) { }
        await new Promise(r => setTimeout(r, 500));
    }
    return translated;
}

// ... skipped Aleqt ...



// Helper: Translate Text (AR -> EN)
async function translateText(text, from = 'ar', to = 'en') {
    if (!text) return '';
    try {
        const axios = require('axios');
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: from,
                tl: to,
                dt: 't',
                q: text.substring(0, 2000) // Limit length
            },
            timeout: 5000
        });
        // Combine all segments
        return response.data[0].map(s => s[0]).join('');
    } catch (e) {
        // console.warn('Translation failed:', e.message);
        return text;
    }
}

// Helper: Check for Arabic text
const hasArabic = (text) => /[\u0600-\u06FF]/.test(text || '');

// Aleqt Scraper (Saudi) - Direct Scrape + Auto Translate
async function scrapeAleqt() {
    const articles = [];
    const url = 'https://www.aleqt.com/%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%A7%D9%82'; // Markets section

    try {
        console.log('Scraping Aleqt (Direct)...');
        const html = await fetchWithRetry(url);
        const $ = cheerio.load(html);

        // Selectors based on inspection
        // Container: div.group.flex.flex-col...
        // Title: h2 a
        // Date: div.text-gray-700...

        const items = [];

        // 1. Collect Items (Arabic)
        $('div.group.flex.flex-col').each((i, el) => {
            const $el = $(el);
            const titleElement = $el.find('h2 a');
            const link = titleElement.attr('href');
            const titleAr = titleElement.text().trim();
            const dateStr = $el.find('.text-gray-700').text().trim(); // "06 ديسمبر 2025"

            // Image (often hidden or lazy loaded, try to find it)
            // The structure showed img inside a div > a > img earlier structure
            let image = $el.find('img').attr('src');

            if (link && titleAr && titleAr.length > 5 && !processedUrls.has(link)) {
                items.push({
                    link: link.startsWith('http') ? link : 'https://www.aleqt.com' + link,
                    titleAr,
                    date: dateStr,
                    image
                });
            }
        });

        // 2. Process & Translate (Sequential to avoid rate limits)
        for (const item of items.slice(0, 8)) { // Top 8
            try {
                // Translate Title
                const enTitle = await translateText(item.titleAr);

                // Fetch Content for Translation
                let enContent = '';
                try {
                    const pageHtml = await fetchWithRetry(item.link);
                    const $page = cheerio.load(pageHtml);
                    // Content selector from earlier analysis or generic
                    const contentAr = $page('.article-body').text() || $page('.main-content').text() || $page('.content').text() || '';
                    if (contentAr.length > 50) {
                        enContent = await translateText(contentAr.substring(0, 1000));
                    }
                } catch (e) { }

                if (enTitle && isEnglish(enTitle)) {
                    articles.push({
                        title: enTitle,
                        url: item.link,
                        image_url: item.image,
                        published_at: new Date().toISOString(), // Use current for simplicity or parse arabic date later
                        source: 'Aleqt',
                        country: 'SA',
                        market: 'TDWL',
                        content: enContent,
                        tickers: extractTickers(enTitle + ' ' + enContent),
                        isTranslated: true
                    });
                }

                // Friendly pause
                await new Promise(r => setTimeout(r, 800));

            } catch (e) {
                // console.warn('Aleqt item process failed', e.message);
            }
        }

    } catch (error) {
        console.warn('Aleqt scrape failed:', error.message);
    }
    return articles;
}

// Okaz (General Saudi News)
async function scrapeOkaz() {
    // Keep Okaz via Bing as fallback/supplement
    const arabicArticles = await fetchBingNewsRss('site:okaz.com.sa (سوق OR اقتصاد OR اسهم OR تداول OR شركات)', 'Okaz', 'SA', 'TDWL', 'ar-sa');

    // Translate (Sequential)
    const translated = [];
    for (const article of arabicArticles) {
        try {
            const enTitle = await translateText(article.title);
            const enContent = await translateText(article.content);
            if (!hasArabic(enTitle)) {
                translated.push({ ...article, title: enTitle, content: enContent, isTranslated: true });
            }
        } catch (e) { }
        await new Promise(r => setTimeout(r, 500));
    }
    return translated;
}

// ============= MAIN PIPELINE =============

// Run all scrapers and collect news
async function runScrapers() {
    console.log('🔄 Running news scrapers...');

    // Run scrapers in parallel with error isolation
    const scraperPromises = [
        scrapeArgaam().catch(e => { console.warn('Argaam error:', e.message); return []; }),
        scrapeZawya().catch(e => { console.warn('Zawya error:', e.message); return []; }),
        scrapeEGX().catch(e => { console.warn('EGX error:', e.message); return []; }),
        scrapeArabFinance().catch(e => { console.warn('ArabFinance error:', e.message); return []; }),
        scrapeMubasherWeb('eg').catch(e => { console.warn('Mubasher EG error:', e.message); return []; }),
        scrapeMubasherWeb('sa').catch(e => { console.warn('Mubasher SA error:', e.message); return []; }),
        scrapeSaudiExchange().catch(e => { console.warn('Saudi Exchange error:', e.message); return []; }), // Now Bing
        scrapeEnterprise().catch(e => { console.warn('Enterprise error:', e.message); return []; }),
        scrapeMaaal().catch(e => { console.warn('Maaal error:', e.message); return []; }), // Now Bing
        scrapeAleqt().catch(e => { console.warn('Aleqt error:', e.message); return []; }), // Now Bing
        scrapeOkaz().catch(e => { console.warn('Okaz error:', e.message); return []; })
    ];

    const results = await Promise.all(scraperPromises);

    // Flatten and filter results
    const allArticles = [];
    const seenUrls = new Set();

    for (const articles of results) {
        for (const article of articles) {

            // Add to results and mark as processed
            allArticles.push(article);
            processedUrls.add(article.url);
        }
    }

    console.log(`✅ Scraped ${allArticles.length} new articles`);

    // Merge with existing cache
    newsCache = [...allArticles, ...newsCache].slice(0, 500); // Keep last 500

    // Save to file
    try {
        const dataDir = path.dirname(NEWS_CACHE_FILE);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(NEWS_CACHE_FILE, JSON.stringify(newsCache, null, 2));
    } catch (e) {
        console.warn('Failed to save news cache:', e.message);
    }

    return allArticles;
}

// Get cached news by market
function getCachedNews(market = null) {
    if (!market) return newsCache;
    return newsCache.filter(a => a.market === market || a.country === market);
}

// Initialize: Load existing cache
function init() {
    try {
        if (fs.existsSync(NEWS_CACHE_FILE)) {
            newsCache = JSON.parse(fs.readFileSync(NEWS_CACHE_FILE, 'utf8'));
            newsCache.forEach(a => processedUrls.add(a.url));
            console.log(`📰 Loaded ${newsCache.length} cached news articles`);
        }
    } catch (e) {
        console.warn('Failed to load news cache:', e.message);
    }
}

// Start periodic scraping
function startScheduler(intervalMinutes = 15) {
    console.log(`📰 Starting news scraper scheduler (every ${intervalMinutes} minutes)`);

    // Initial run
    runScrapers();

    // Schedule periodic runs
    setInterval(runScrapers, intervalMinutes * 60 * 1000);
}

// Initialize on load
init();

module.exports = {
    runScrapers,
    getCachedNews,
    startScheduler,
    // Individual scrapers for testing
    scrapeArgaam,
    scrapeZawya,
    scrapeEGX,
    scrapeArabFinance,
    scrapeMubasherWeb,
    scrapeSaudiExchange,
    scrapeEnterprise
};

if (require.main === module) {
    runScrapers().then(news => {
        console.log(`Done. Scraped ${news.length} items.`);
        process.exit(0); // Ensure clean exit
    }).catch(err => {
        console.error('Fatal:', err);
        process.exit(1);
    });
}
