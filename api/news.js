import YahooFinance from 'yahoo-finance2';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

// ============ IN-MEMORY CACHE ============
// Cache persists across warm function invocations
const newsCache = {
    SA: { data: null, timestamp: 0 },
    EG: { data: null, timestamp: 0 },
    US: { data: null, timestamp: 0 },
    // New markets
    IN: { data: null, timestamp: 0 },
    UK: { data: null, timestamp: 0 },
    CA: { data: null, timestamp: 0 },
    AU: { data: null, timestamp: 0 },
    HK: { data: null, timestamp: 0 },
    DE: { data: null, timestamp: 0 },
    JP: { data: null, timestamp: 0 },
    AE: { data: null, timestamp: 0 },
    ZA: { data: null, timestamp: 0 },
    QA: { data: null, timestamp: 0 }
};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

// SCRAPER: Mubasher Direct (English + Arabic with Auto-Translate)
async function scrapeMubasher(market = 'SA') {
    const articles = [];

    // English URLs (Fixed SA URL)
    const urlEn = market === 'SA'
        ? 'https://english.mubasher.info/countries/sa'
        : 'https://english.mubasher.info/countries/eg';

    // Arabic URLs (New Source)
    const urlAr = market === 'SA'
        ? 'https://www.mubasher.info/countries/sa'
        : 'https://www.mubasher.info/countries/eg';

    try {
        console.log(`📰 Scraping Mubasher (${market}) - EN & AR...`);

        // Fetch both EN and AR pages in parallel
        const [htmlEn, htmlAr] = await Promise.all([
            fetchWithHeaders(urlEn).catch(() => null),
            fetchWithHeaders(urlAr).catch(() => null)
        ]);

        // Process English
        if (htmlEn) {
            const $ = cheerio.load(htmlEn);
            const links = new Set();
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.match(/\/news\/\d+\//)) {
                    links.add(href.startsWith('http') ? href : 'https://english.mubasher.info' + href);
                }
            });

            // Add English articles
            for (const link of Array.from(links).slice(0, 25)) {
                articles.push({ link, lang: 'en' });
            }
        }

        // Process Arabic
        if (htmlAr) {
            const $ = cheerio.load(htmlAr);
            const links = new Set();
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.match(/\/news\/\d+\//)) {
                    links.add(href.startsWith('http') ? href : 'https://www.mubasher.info' + href);
                }
            });

            // Add Arabic articles (limit 10 to avoid timeouts)
            for (const link of Array.from(links).slice(0, 10)) {
                articles.push({ link, lang: 'ar' });
            }
        }

        // Fetch details in parallel
        const processed = await Promise.all(articles.map(async ({ link, lang }) => {
            try {
                const pageHtml = await fetchWithHeaders(link);
                if (!pageHtml) return null;
                const $page = cheerio.load(pageHtml);

                let title = $page('h1').first().text().trim();
                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('.article-image img').attr('src');

                if (image && !image.startsWith('http')) {
                    const baseUrl = lang === 'en' ? 'https://english.mubasher.info' : 'https://www.mubasher.info';
                    image = baseUrl + image;
                }

                // Translate Arabic title
                if (lang === 'ar') {
                    title = await translateToEnglish(title);
                }

                if (title && title.length > 10) {
                    return {
                        id: link,
                        title: title,
                        publisher: 'Mubasher',
                        link: link, // Link to original (even if Arabic)
                        time: new Date().toISOString(), // Default to now as fallback
                        thumbnail: image || 'https://placehold.co/600x400/f1f5f9/475569?text=Mubasher'
                    };
                }
            } catch (e) { }
            return null;
        }));

        return processed.filter(a => a !== null);

    } catch (e) {
        console.error(`Mubasher scrape failed for ${market}:`, e.message);
        return [];
    }
}

// Helper: Create robust RSS parser with anti-bot headers
const createParser = () => new Parser({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Referer': 'https://www.google.com/',
        'Accept-Language': 'en-US,en;q=0.9',
        'Upgrade-Insecure-Requests': '1'
    },
    customFields: {
        item: [['media:content', 'media'], ['enclosure', 'enclosure']]
    }
});

// Helper: Fetch URL with robust headers (for direct scraping)
async function fetchWithHeaders(url) {
    try {
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        return response.data;
    } catch (e) {
        if (e.response && e.response.status === 404) return null;
        throw e;
    }
}

// SCRAPER: Argaam RSS (Direct) - PRIMARY SOURCE FOR SAUDI
async function scrapeArgaam() {
    const articles = [];
    const parser = createParser();
    const feeds = [
        'https://www.argaam.com/en/rss/ho-main-news?sectionid=1524', // Main News
        'https://www.argaam.com/en/rss/ho-main-news?sectionid=24'    // Companies
    ];

    try {
        console.log('📰 Scraping Argaam RSS (Deep Scraping)...');

        for (const url of feeds) {
            try {
                const feed = await parser.parseURL(url);

                for (const item of feed.items.slice(0, 15)) {
                    let image = null;
                    if (item.content) {
                        const imgMatch = item.content.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
                        if (imgMatch) image = imgMatch[1];
                    }
                    if (!image && item.media?.url) image = item.media.url;
                    if (!image && item.enclosure?.url) image = item.enclosure.url;

                    if (!image) {
                        if (item.title?.toLowerCase().includes('oil')) image = 'https://argaamplus.s3.amazonaws.com/files/images/oil-prices.png';
                        else if (item.title?.toLowerCase().includes('result')) image = 'https://argaamplus.s3.amazonaws.com/files/images/results.png';
                    }

                    articles.push({
                        id: item.link,
                        title: item.title || '',
                        publisher: 'Argaam',
                        link: item.link,
                        time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        thumbnail: image || 'https://www.argaam.com/assets/images/argaam-logo.png'
                    });
                }
            } catch (err) { }
        }

        // Deduplicate
        const unique = [];
        const seen = new Set();
        for (const a of articles) {
            if (!seen.has(a.id)) {
                seen.add(a.id);
                unique.push(a);
            }
        }

        console.log(`Argaam: ${unique.length} articles`);
        return unique.slice(0, 35); // Max 35 articles

    } catch (e) {
        console.error('Argaam RSS failed:', e.message);
        return articles;
    }
}

// SCRAPER: Amwal Al Ghad RSS (English)
async function scrapeAmwalAlGhad() {
    let articles = [];
    const parser = createParser();

    try {
        console.log('📰 Scraping Amwal Al Ghad RSS...');
        const feed = await parser.parseURL('https://en.amwalalghad.com/feed/');

        for (const item of feed.items.slice(0, 10)) {
            let image = item.enclosure?.url || item.media?.url || null;
            if (!image && item['media:content']) image = item['media:content'].$?.url;

            articles.push({
                id: item.link,
                title: item.title || '',
                publisher: 'Amwal Al Ghad',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://en.amwalalghad.com/wp-content/themes/amwal/images/logo.png'
            });
        }
    } catch (e) {
        console.error('Amwal Al Ghad RSS failed:', e.message);
    }

    // Fallback if blocked/empty
    if (articles.length === 0) {
        console.log('⚠️ Amwal blocked, using Bing fallback...');
        const bing = await fetchBingNews('Amwal Al Ghad Egypt business news', 10);
        bing.forEach(n => n.publisher = 'Amwal Al Ghad');
        articles = bing;
    }

    return articles;
}

// SCRAPER: Enterprise RSS (English)
async function scrapeEnterprise() {
    let articles = [];
    const parser = createParser();

    try {
        console.log('📰 Scraping Enterprise RSS...');
        const feed = await parser.parseURL('https://enterprise.news/feed/');

        for (const item of feed.items.slice(0, 10)) {
            let image = item.enclosure?.url || item.media?.url || null;

            articles.push({
                id: item.link,
                title: item.title || '',
                publisher: 'Enterprise',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://enterprise.news/wp-content/uploads/2021/01/logo.png'
            });
        }
    } catch (e) {
        console.error('Enterprise RSS failed:', e.message);
    }

    // Fallback
    if (articles.length === 0) {
        console.log('⚠️ Enterprise blocked, using Bing fallback...');
        const bing = await fetchBingNews('Enterprise Press Egypt business newsletter', 10);
        bing.forEach(n => n.publisher = 'Enterprise');
        articles = bing;
    }

    return articles;
}

// SCRAPER: CNBC Arabia RSS (Arabic -> Translate)
async function scrapeCNBC() {
    let articles = [];
    const parser = createParser();

    try {
        console.log('📰 Scraping CNBC Arabia RSS...');
        const feed = await parser.parseURL('https://www.cnbcarabia.com/rss');

        for (const item of feed.items.slice(0, 10)) {
            let title = item.title || '';
            const link = item.link;

            // Translate title
            title = await translateToEnglish(title);

            let image = item.enclosure?.url || item.media?.url || null;

            articles.push({
                id: link,
                title: title,
                publisher: 'CNBC',
                link: link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://www.cnbcarabia.com/images/logo.png'
            });
        }
    } catch (e) {
        console.error('CNBC RSS failed:', e.message);
    }

    // Fallback
    if (articles.length === 0) {
        console.log('⚠️ CNBC blocked, using Bing fallback...');
        const bing = await fetchBingNews('CNBC Arabia business news', 10);
        bing.forEach(n => n.publisher = 'CNBC');
        articles = bing;
    }

    return articles;
}

// SCRAPER: Saudi Gazette RSS (English) - Direct
async function scrapeSaudiGazette() {
    const articles = [];
    const parser = createParser();
    try {
        console.log('📰 Scraping Saudi Gazette RSS...');
        const feed = await parser.parseURL('https://saudigazette.com.sa/rssFeed/1');
        for (const item of feed.items.slice(0, 10)) {
            let image = item.enclosure?.url || item.media?.url || null;
            if (!image && item.content) {
                const imgMatch = item.content.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
                if (imgMatch) image = imgMatch[1];
            }
            articles.push({
                id: item.link,
                title: item.title || '',
                publisher: 'Saudi Gazette',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://saudigazette.com.sa/assets/images/logo.png'
            });
        }
    } catch (e) {
        console.error('Saudi Gazette RSS failed:', e.message);
    }
    return articles;
}

// SCRAPER: Investing.com (Arabic -> Translate)
async function scrapeInvesting(market = 'SA') {
    const articles = [];
    const parser = createParser();
    const url = market === 'SA'
        ? 'https://sa.investing.com/rss/news_14.rss'
        : 'https://eg.investing.com/rss/news_14.rss';

    try {
        console.log(`📰 Scraping Investing.com (${market}) RSS...`);
        const feed = await parser.parseURL(url);

        for (const item of feed.items.slice(0, 10)) {
            let title = await translateToEnglish(item.title);
            let image = item.enclosure?.url || item.media?.url || null;
            if (!image) image = 'https://i-invdn-com.investing.com/logos/investing-com-logo.png';

            articles.push({
                id: item.link,
                title: title,
                publisher: 'Investing.com',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image
            });
        }
    } catch (e) {
        console.error(`Investing.com ${market} RSS failed:`, e.message);
    }
    return articles;
}

// SCRAPER: Daily News Egypt RSS (Direct)
async function scrapeDailyNewsEgypt() {
    let articles = [];
    const parser = createParser();

    try {
        console.log('📰 Scraping Daily News Egypt RSS...');
        const feed = await parser.parseURL('https://www.dailynewsegypt.com/feed/');

        for (const item of feed.items.slice(0, 15)) {
            let image = item.enclosure?.url || item.media?.url || null;
            if (!image && item['media:content']) {
                image = item['media:content'].$?.url;
            }

            articles.push({
                id: item.link,
                title: item.title || '',
                publisher: 'Daily News Egypt',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://dailynewsegypt.com/wp-content/uploads/2019/01/logo.png'
            });
        }
        console.log(`Daily News Egypt: ${articles.length} articles`);
    } catch (e) {
        console.error('Daily News Egypt RSS failed:', e.message);
    }

    // Fallback
    if (articles.length === 0) {
        console.log('⚠️ DNE blocked, using Bing fallback...');
        const bing = await fetchBingNews('Daily News Egypt business', 10);
        bing.forEach(n => n.publisher = 'Daily News Egypt');
        articles = bing;
    }

    return articles;
}

// SCRAPER: Egypt Today RSS - Direct Source for Egypt
async function scrapeEgyptToday() {
    let articles = [];
    const parser = createParser();

    try {
        console.log('📰 Scraping Egypt Today RSS...');
        const feed = await parser.parseURL('https://www.egypttoday.com/RSS/1');

        for (const item of feed.items.slice(0, 15)) {
            let image = item.enclosure?.url || item.media?.url || null;
            if (!image && item['media:content']) {
                image = item['media:content'].$?.url;
            }
            // Try to extract from content if available
            if (!image && item.content) {
                const imgMatch = item.content.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
                if (imgMatch) image = imgMatch[1];
            }

            articles.push({
                id: item.link,
                title: item.title || '',
                publisher: 'Egypt Today',
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image || 'https://www.egypttoday.com/siteimages/Llogo.png'
            });
        }
        console.log(`Egypt Today: ${articles.length} articles`);
    } catch (e) {
        console.error('Egypt Today RSS failed:', e.message);
    }

    // Fallback
    if (articles.length === 0) {
        console.log('⚠️ Egypt Today blocked, using Bing fallback...');
        const bing = await fetchBingNews('Egypt Today business economy', 10);
        bing.forEach(n => n.publisher = 'Egypt Today');
        articles = bing;
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
                // Scrape content for top items
                const topItems = result.news.slice(0, 5);
                const scrapedItems = await Promise.all(topItems.map(async n => {
                    const content = await scrapeContent(n.link);
                    return {
                        id: n.uuid || n.link,
                        title: n.title,
                        publisher: n.publisher || 'Yahoo Finance',
                        link: n.link,
                        time: new Date(n.providerPublishTime).toISOString(),
                        thumbnail: n.thumbnail?.resolutions?.[0]?.url || null,
                        content: content // Add scraped content
                    };
                }));
                allNews.push(...scrapedItems);
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
// Helper: Virtual Scraper (Bing Proxy)
// Helper: Check if URL has substantial content (Headless "Test Drive")
async function scrapeContent(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 4000,
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.data) return null;

        const $ = cheerio.load(response.data);
        $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();

        const selectors = [
            '#articleBody', '.article-body', '.td-post-content', '.details-body',
            '.article-text', '.WYSIWYG.articlePage', '#article', '[data-test-id="post-content"]',
            '.caas-body', '.news-details', '.ArticleBody', '.story-text',
            '.story-content', 'article', '.main-content', 'main'
        ];

        for (const sel of selectors) {
            if ($(sel).length > 0) {
                const text = $(sel).text().replace(/\s+/g, ' ').trim();
                if (text.length > 250) return text; // Found substantial content
            }
        }

        // Fallback
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        return text.length > 500 ? text : null;

    } catch (e) {
        return null;
    }
}

// Helper: Virtual Scraper (Bing Proxy)
async function scrapeVirtual(publisher, query, count = 10, expectedDomain = null, verifyContent = false, blacklistDomains = null) {
    try {
        let news = await fetchBingNews(query, count);

        // Blacklist Filter (Remove known bad aggregators)
        if (blacklistDomains && blacklistDomains.length > 0) {
            news = news.filter(n => {
                try {
                    const hostname = new URL(n.link).hostname;
                    // If hostname contains any blacklisted domain, Remove it
                    return !blacklistDomains.some(bad => hostname.includes(bad));
                } catch (e) {
                    return true;
                }
            });
        }

        // 1. Strict Domain Filter (Fast)
        if (expectedDomain) {
            news = news.filter(n => {
                try {
                    const url = new URL(n.link);
                    return url.hostname.includes(expectedDomain);
                } catch (e) {
                    return false;
                }
            });
        }

        // 2. Content Verification & Extraction
        if (verifyContent && news.length > 0) {
            const candidates = news.slice(0, 5);
            // Check all in parallel
            const results = await Promise.allSettled(candidates.map(async n => {
                const content = await scrapeContent(n.link);
                return { ...n, content };
            }));

            // Keep only those that passed verification
            news = results
                .filter(r => r.status === 'fulfilled' && r.value.content)
                .map(r => r.value);
        }

        news.forEach(n => n.publisher = publisher);
        return news;
    } catch (e) {
        return [];
    }
}

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
                // Note: We don't scrape here to avoid slowing down fallback. 
                // Only scrapeVirtual or explicit scrapeContent usage should populate content.
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
    const cacheKey = market || 'default';

    // ============ CHECK CACHE FIRST ============
    const cached = newsCache[cacheKey];
    const now = Date.now();

    if (cached && cached.data && (now - cached.timestamp) < CACHE_TTL) {
        console.log(`📦 Serving ${cacheKey} from cache (${Math.round((now - cached.timestamp) / 1000)}s old)`);
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached.data);
    }

    console.log(`🔄 Fetching fresh news for ${cacheKey}`);
    let allNews = [];

    // Blacklist for US/Crypto noise in SA/EG
    const BLACKLIST = ['Benzinga', 'The Telegraph', 'GlobeNewswire', 'PR Newswire', 'Business Wire', 'Zacks', 'Motley Fool'];

    try {
        // **MULTI-SOURCE NEWS STRATEGY - Using Bing News RSS + Direct Scraping**
        // Saudi: Mubasher, Argaam, Arab News, Aleqt, Reuters, Bloomberg, Investing.com
        // Egypt: Mubasher, Zawya, Egypt Today, Daily News Egypt, Arab Finance, Investing.com

        if (market === 'SA') {
            // Run ALL scrapers in PARALLEL for speed
            const [
                mubasherNews, argaamNews, cnbcNews, saudiGazetteNews, investingNews,
                // maaalNews, eqtisadiahNews, asharqNews, alArabiyaNews, okazNews, 
                riyadhNews, // Re-enabled
                ...bingResults
            ] = await Promise.all([
                scrapeMubasher('SA'),
                scrapeArgaam(),
                scrapeCNBC(),
                scrapeSaudiGazette(),
                scrapeInvesting('SA'),
                // Virtual Scrapers (Bing Proxy)
                // scrapeVirtual('Maaal', 'Maaal newspaper Saudi finance', 10),
                // scrapeVirtual('Al Eqtisadiah', 'Al Eqtisadiah Saudi economy', 10),
                // scrapeVirtual('Asharq Business', 'Asharq Business Saudi economy', 10),
                // scrapeVirtual('Al Arabiya', 'Al Arabiya Saudi economy business', 10),
                // scrapeVirtual('Okaz', 'Okaz Saudi economy', 10),
                scrapeVirtual('Al Riyadh', 'Al Riyadh Saudi business', 10, null, false, ['reuters.com', 'bloomberg.com', 'brecorder.com', 'msn.com', 'yahoo.com']),
                // Fallbacks (Blacklist all unscrapable domains)
                scrapeVirtual('Arab News', 'Arab News Saudi business', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Aleqt', 'Aleqt Saudi economy', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Reuters', 'Reuters Saudi Arabia business news', 10, null, false, ['reuters.com', 'bloomberg.com', 'brecorder.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Bloomberg', 'Bloomberg Saudi Arabia economy', 10, null, false, ['bloomberg.com', 'reuters.com', 'msn.com', 'yahoo.com'])
            ]);

            allNews.push(...mubasherNews);
            allNews.push(...argaamNews);
            allNews.push(...cnbcNews);
            allNews.push(...saudiGazetteNews);
            allNews.push(...investingNews);
            // allNews.push(...maaalNews);
            // allNews.push(...eqtisadiahNews);
            // allNews.push(...asharqNews);
            // allNews.push(...alArabiyaNews);
            // allNews.push(...okazNews);
            allNews.push(...riyadhNews);

            const publishers = ['Arab News', 'Aleqt', 'Reuters', 'Bloomberg'];
            bingResults.forEach((news, i) => {
                // Publisher is already set by scrapeVirtual, but we keep this for safety or remove it
                // scrapeVirtual already sets the publisher.
                // However, the current destructuring puts them into 'bingResults' array.
                // 'bingResults' is an array of arrays.
                // The current logic iterates bingResults and overrides publisher.
                // Since scrapeVirtual sets it, this override is redundant but harmless IF the order matches.
                // Order: Arab News, Aleqt, Reuters, Bloomberg.
                // Variable 'publishers' matches this order.
                // So it's safe to leave as is, or better yet, verify 'scrapeVirtual' sets it correctly.
                // scrapeVirtual sets n.publisher = publisher.
                // So we can remove the manual override loop if we want, but keeping it is safer for legacy structure.
                news.forEach(n => n.publisher = publishers[i]);
                allNews.push(...news);
            });

        } else if (market === 'EG') {
            // Run ALL scrapers in PARALLEL for speed
            const [
                mubasherNews, egyptTodayNews, amwalNews, enterpriseNews, investingNews,
                ...bingResults
            ] = await Promise.all([
                scrapeMubasher('EG'),
                // scrapeDailyNewsEgypt(),
                scrapeEgyptToday(),
                scrapeAmwalAlGhad(),
                scrapeEnterprise(),
                scrapeInvesting('EG'),
                // Virtual Scrapers for EG (with blacklist)
                scrapeVirtual('Al Borsa', 'Al Borsa Egypt stock market economy', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Ahram Online', 'Al Ahram Egypt business economy news', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Zawya', 'Zawya Egypt business news stock', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com']),
                scrapeVirtual('Arab Finance', 'Arab Finance Egypt stock market economy', 10, null, false, ['reuters.com', 'bloomberg.com', 'msn.com', 'yahoo.com'])
            ]);

            allNews.push(...mubasherNews);
            allNews.push(...egyptTodayNews);
            allNews.push(...amwalNews);
            allNews.push(...enterpriseNews);
            allNews.push(...investingNews);

            const publishers = ['Al Borsa', 'Ahram Online', 'Zawya', 'Arab Finance'];
            bingResults.forEach((news, i) => {
                news.forEach(n => n.publisher = publishers[i]);
                allNews.push(...news);
            });

        } else if (market === 'US') {
            // Yahoo Finance (PRIMARY for US)
            const yahooNews = await fetchYahooNews(['S&P 500', 'Stock Market', 'NASDAQ', 'Wall Street'], 10);
            allNews.push(...yahooNews);

            // Bing RSS (SECONDARY)
            const bingNews = await fetchBingNews('Wall Street stocks NASDAQ', 5);
            allNews.push(...bingNews);

            // ===== NEW MARKETS - Added 2025-12-08 =====
            // Using Bing News RSS + Yahoo Finance for reliable global coverage

        } else if (market === 'IN') {
            // India - NSE/BSE
            console.log('📰 Fetching India market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['Nifty 50', 'Sensex', 'NSE India'], 8),
                fetchBingNews('India stock market NSE BSE', 8),
                fetchBingNews('Reliance TCS Infosys stock news', 6),
                fetchBingNews('Economic Times India business', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'UK') {
            // UK - LSE
            console.log('📰 Fetching UK market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['FTSE 100', 'London Stock Exchange'], 8),
                fetchBingNews('UK stock market FTSE 100', 8),
                fetchBingNews('Financial Times UK markets', 6),
                fetchBingNews('BBC business UK economy', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'CA') {
            // Canada - TSX
            console.log('📰 Fetching Canada market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['TSX', 'Toronto Stock Exchange'], 8),
                fetchBingNews('Canada stock market TSX', 8),
                fetchBingNews('Shopify RBC TD Bank stock', 6),
                fetchBingNews('Globe and Mail business Canada', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'AU') {
            // Australia - ASX
            console.log('📰 Fetching Australia market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['ASX 200', 'Australia Stock Exchange'], 8),
                fetchBingNews('Australia stock market ASX', 8),
                fetchBingNews('BHP CBA CSL stock news', 6),
                fetchBingNews('Australian Financial Review', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'HK') {
            // Hong Kong - HKEX
            console.log('📰 Fetching Hong Kong market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['Hang Seng Index', 'Hong Kong Stock'], 8),
                fetchBingNews('Hong Kong stock market Hang Seng', 8),
                fetchBingNews('Tencent Alibaba HSBC Hong Kong', 6),
                fetchBingNews('SCMP business Hong Kong', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'DE') {
            // Germany - XETRA/Frankfurt
            console.log('📰 Fetching Germany market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['DAX', 'German Stock Market'], 8),
                fetchBingNews('Germany stock market DAX', 8),
                fetchBingNews('SAP Siemens BMW stock news', 6),
                fetchBingNews('Handelsblatt German economy', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'JP') {
            // Japan - TSE
            console.log('📰 Fetching Japan market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['Nikkei 225', 'Tokyo Stock Exchange'], 8),
                fetchBingNews('Japan stock market Nikkei', 8),
                fetchBingNews('Toyota Sony Nintendo stock', 6),
                fetchBingNews('Nikkei Asia Japan economy', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'AE') {
            // UAE - ADX/DFM
            console.log('📰 Fetching UAE market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['Abu Dhabi Stock', 'Dubai Stock Market'], 8),
                fetchBingNews('UAE stock market ADX DFM', 8),
                fetchBingNews('Emaar FAB Etisalat stock Dubai', 6),
                fetchBingNews('Gulf News business UAE', 5),
                fetchBingNews('Khaleej Times economy Dubai', 4)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'ZA') {
            // South Africa - JSE
            console.log('📰 Fetching South Africa market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['JSE', 'Johannesburg Stock Exchange'], 8),
                fetchBingNews('South Africa stock market JSE', 8),
                fetchBingNews('Naspers Sasol MTN stock', 6),
                fetchBingNews('Business Day South Africa', 5)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else if (market === 'QA') {
            // Qatar - QSE
            console.log('📰 Fetching Qatar market news...');
            const [yahooNews, ...bingResults] = await Promise.all([
                fetchYahooNews(['Qatar Stock Exchange'], 6),
                fetchBingNews('Qatar stock market QSE', 8),
                fetchBingNews('QNB Ooredoo Qatar economy', 6),
                fetchBingNews('Gulf Times Qatar business', 5),
                fetchBingNews('The Peninsula Qatar economy', 4)
            ]);
            allNews.push(...yahooNews);
            bingResults.forEach(news => allNews.push(...news));

        } else {
            // Default: Global markets
            const yahooNews = await fetchYahooNews(['Global Stock Markets'], 5);
            allNews.push(...yahooNews);
        }

        // Deduplicate and Filter Whitelist
        const seen = new Set();
        const seenImages = new Set();

        // STRICT WHITELIST
        const ALLOWED_SOURCES_SA = ['Mubasher', 'معلومات مباشر', 'Argaam', 'ارقام', 'Reuters', 'Bloomberg', 'Arab News', 'Investing.com', 'aleqt', 's2.aleqt.com', 'الاقتصادية', 'aleq.com', 'Maaal', 'Al Eqtisadiah', 'Asharq', 'Al Arabiya', 'Okaz', 'Al Riyadh'];
        const ALLOWED_SOURCES_EG = ['Mubasher', 'معلومات مباشر', 'Zawya', 'Egypt Today', 'Daily News Egypt', 'Dailynewsegypt', 'Arab Finance', 'ArabFinance', 'Investing.com', 'Al Borsa', 'Hapi Journal', 'Ahram', 'Al Mal', 'Sky News', 'Shorouk'];

        // Helper: Check if text contains Arabic
        const containsArabic = (text) => /[\u0600-\u06FF]/.test(text);

        const uniqueNews = allNews.filter(item => {
            if (!item || !item.title) return false;

            // Strict Whitelist for EG/SA
            if (market === 'SA') {
                const pub = (item.publisher || '').toLowerCase();
                const allowed = ALLOWED_SOURCES_SA.some(src => pub.includes(src) || pub.toLowerCase().includes(src.toLowerCase()));
                if (!allowed) return false;
            } else if (market === 'EG') {
                const pub = (item.publisher || '').toLowerCase();
                const allowed = ALLOWED_SOURCES_EG.some(src => pub.includes(src) || pub.toLowerCase().includes(src.toLowerCase()));
                if (!allowed) return false;
            }

            // Deduplicate by title (first 50 chars, case-insensitive)
            const cleanTitle = item.title.trim().toLowerCase().substring(0, 50);
            if (seen.has(cleanTitle)) return false;
            seen.add(cleanTitle);

            // Deduplicate images
            if (item.thumbnail && !item.thumbnail.includes('placehold')) {
                const imgKey = item.thumbnail.split('?')[0];
                if (seenImages.has(imgKey)) {
                    item.thumbnail = null; // Remove duplicate image but keep article
                } else {
                    seenImages.add(imgKey);
                }
            }

            return true;
        });

        // Normalize publisher names (Arabic -> English, variations -> standard)
        const normalizePublisher = (pub) => {
            if (!pub) return 'News';
            const p = pub.toLowerCase();
            if (p.includes('ارقام') || p.includes('argaam')) return 'Argaam';
            if (p.includes('معلومات مباشر') || p.includes('mubasher')) return 'Mubasher';
            if (p.includes('الاقتصادية') || p.includes('aleqt') || p.includes('s2.aleqt')) return 'Aleqt';
            if (p.includes('dailynewsegypt')) return 'Daily News Egypt';
            if (p.includes('arabfinance')) return 'Arab Finance';
            if (p.includes('bloomberg')) return 'Bloomberg';
            return pub;
        };

        // Translate Arabic titles to English
        const translateTitle = async (text) => {
            if (!text || !containsArabic(text)) return text;
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
                const response = await axios.get(url, { timeout: 3000 });
                if (response.data && response.data[0]) {
                    return response.data[0].map(s => s[0]).join('');
                }
            } catch (e) { }
            return text;
        };

        // Process and normalize all items
        const processedNews = [];
        for (const item of uniqueNews) {
            const normalized = {
                ...item,
                publisher: normalizePublisher(item.publisher),
                title: containsArabic(item.title) ? await translateTitle(item.title) : item.title,
                thumbnail: item.thumbnail // Keep original for validation
            };
            processedNews.push(normalized);
        }

        // Helper: Get smart placeholder based on publisher
        const getPlaceholderImage = (publisher) => {
            const p = (publisher || '').toLowerCase();
            if (p.includes('mubasher')) return 'https://placehold.co/600x400/0056b3/ffffff?text=Mubasher+News';
            if (p.includes('argaam')) return 'https://placehold.co/600x400/ff6600/ffffff?text=Argaam';
            if (p.includes('maaal')) return 'https://placehold.co/600x400/2c3e50/ffffff?text=Maaal';
            if (p.includes('eqtisadiah')) return 'https://placehold.co/600x400/4a6fb5/ffffff?text=Al+Eqtisadiah';
            if (p.includes('borsa')) return 'https://placehold.co/600x400/27ae60/ffffff?text=Al+Borsa';
            if (p.includes('asharq')) return 'https://placehold.co/600x400/523d87/ffffff?text=Asharq+Business';
            if (p.includes('reuters')) return 'https://placehold.co/600x400/ff8000/ffffff?text=Reuters';
            if (p.includes('bloomberg')) return 'https://placehold.co/600x400/000000/ffffff?text=Bloomberg';
            return 'https://placehold.co/600x400/f1f5f9/475569?text=Market+News';
        };

        const validatedNews = processedNews.filter(item => {
            // Must have valid title (non-empty, min length)
            if (!item.title || item.title.length < 10) return false;

            // Must have valid link
            if (!item.link || item.link === '#') return false;

            // HYBRID STRATEGY: If no image, assign smart placeholder
            if (!item.thumbnail || item.thumbnail.includes('placehold.co') || item.thumbnail.includes('error')) {
                item.thumbnail = getPlaceholderImage(item.publisher);
            }

            return true;
        });

        console.log(`📰 Validated ${validatedNews.length}/${processedNews.length} articles`);

        // Sort by time (newest first)
        validatedNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Return fallback if empty
        if (validatedNews.length === 0) {
            return res.status(200).json([{
                id: 'fallback',
                title: 'Market News Currently Unavailable',
                publisher: 'System',
                link: '#',
                time: new Date().toISOString(),
                thumbnail: 'https://placehold.co/600x400/f1f5f9/475569?text=No+News'
            }]);
        }

        // ============ UPDATE CACHE (CUMULATIVE) ============
        const existingData = newsCache[cacheKey]?.data || [];
        const existingIds = new Set(existingData.map(n => n.id || n.link));

        // Add only new items
        const newItems = validatedNews.filter(n => !existingIds.has(n.id || n.link));

        // Merge New + Old
        const mergedNews = [...newItems, ...existingData];

        // Sort & Limit (Keep 300 items for Vercel History)
        mergedNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        const finalNews = mergedNews.slice(0, 300);

        if (newsCache[cacheKey]) {
            newsCache[cacheKey] = { data: finalNews, timestamp: Date.now() };
            console.log(`💾 Cached ${finalNews.length} articles (Legacy+Fresh) for ${cacheKey}`);
        }

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.setHeader('X-Cache', 'MISS');
        res.status(200).json(finalNews);

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
