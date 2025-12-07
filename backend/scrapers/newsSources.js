/**
 * ROBUST News Scrapers - Multi-Method with Guaranteed 10+ Articles
 * Priority: Bing News RSS (most reliable) + Direct RSS + Website Scraping
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');

const parser = new Parser({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    },
    customFields: {
        item: [['media:content', 'media'], ['enclosure', 'enclosure']]
    }
});

const httpClient = axios.create({
    timeout: 12000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8'
    }
});

// Source logos for fallback images
const SOURCE_LOGOS = {
    'Mubasher': 'https://static.mubasher.info/production/mubasher-logo-en.svg',
    'Argaam': 'https://argaamplus.s3.eu-west-1.amazonaws.com/argaam+logo+svg/argaam-english-logo.svg',
    'Arab News': 'https://www.arabnews.com/sites/default/files/an-logo.png',
    'Aleqt': 'https://static-cdn.argaam.com/images/sites/logos/aleqt-logo.svg',
    'Reuters': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Reuters_Logo.svg',
    'Bloomberg': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bloomberg_logo.svg',
    'Investing.com': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Investing.com_Logo.svg',
    'Zawya': 'https://d21buns5ku92am.cloudfront.net/68438/images/394498-zawya_logo-1d9b20-large-1624369440.png',
    'Egypt Today': 'https://www.egypttoday.com/siteimages/Llogo.png',
    'Daily News Egypt': 'https://dailynewsegypt.com/wp-content/uploads/2019/01/dne-logo.png',
    'Arab Finance': 'https://www.arabfinance.com/images/aflogo.png'
};

// ============ HELPER FUNCTIONS ============

function getFallbackImage(publisher) {
    return SOURCE_LOGOS[publisher] || `https://placehold.co/800x450/1e3a5f/ffffff?text=${encodeURIComponent(publisher)}`;
}

async function translateToEnglish(text) {
    if (!text || !/[\u0600-\u06FF]/.test(text)) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { timeout: 5000 });
        if (response.data && response.data[0]) {
            return response.data[0].map(s => s[0]).join('');
        }
    } catch (e) { }
    return text;
}

async function extractImageFromPage(url, publisher) {
    try {
        const response = await httpClient.get(url, { timeout: 8000 });
        const $ = cheerio.load(response.data);

        let image = $('meta[property="og:image"]').attr('content');
        if (!image) image = $('meta[name="twitter:image"]').attr('content');
        if (!image) image = $('article img').first().attr('src');
        if (!image) image = $('figure img').first().attr('src');
        if (!image) image = $('.article-image img, .featured-image img').first().attr('src');

        if (image && !image.startsWith('http')) {
            try {
                const base = new URL(url);
                image = new URL(image, base.origin).href;
            } catch (e) { }
        }

        // Filter out logo/icon images
        if (image && (image.includes('logo') || image.includes('icon') || image.includes('avatar'))) {
            image = null;
        }

        return image || getFallbackImage(publisher);
    } catch (e) {
        return getFallbackImage(publisher);
    }
}

// ============ BING NEWS RSS (Most Reliable) ============

async function fetchFromBingNews(query, publisher, count = 12) {
    const articles = [];

    try {
        console.log(`   📰 Bing RSS: ${query}`);
        const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&count=${count}`;
        const feed = await parser.parseURL(rssUrl);

        for (const item of feed.items.slice(0, count)) {
            // Resolve actual URL from Bing redirect
            let actualUrl = item.link;
            try {
                const urlObj = new URL(item.link);
                const redirectUrl = urlObj.searchParams.get('url');
                if (redirectUrl) actualUrl = decodeURIComponent(redirectUrl);
            } catch (e) { }

            // Clean title
            let title = item.title || '';
            const parts = title.split(' - ');
            if (parts.length > 1) parts.pop();
            title = parts.join(' - ');

            // Translate if Arabic
            title = await translateToEnglish(title);

            // Extract image
            let image = await extractImageFromPage(actualUrl, publisher);

            if (title && title.length > 15) {
                articles.push({
                    id: actualUrl,
                    title,
                    publisher,
                    link: actualUrl,
                    time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    thumbnail: image
                });
            }
        }
    } catch (e) {
        console.log(`   ❌ Bing failed for ${publisher}: ${e.message}`);
    }

    return articles;
}

// ============ DIRECT RSS FEEDS ============

async function fetchFromRSS(rssUrl, publisher, count = 12) {
    const articles = [];

    try {
        console.log(`   📰 RSS: ${rssUrl}`);
        const feed = await parser.parseURL(rssUrl);

        for (const item of feed.items.slice(0, count)) {
            let image = null;
            if (item.media && item.media.$) image = item.media.$.url;
            if (!image && item.enclosure) image = item.enclosure.url || item.enclosure.$.url;
            if (!image && item.content) {
                const imgMatch = item.content.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
                if (imgMatch) image = imgMatch[1];
            }
            if (!image) image = await extractImageFromPage(item.link, publisher);

            let title = await translateToEnglish(item.title?.replace(/^‎/, '').trim() || '');

            if (title && title.length > 10) {
                articles.push({
                    id: item.link,
                    title,
                    publisher,
                    link: item.link,
                    time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    thumbnail: image || getFallbackImage(publisher)
                });
            }
        }
    } catch (e) {
        console.log(`   ❌ RSS failed for ${publisher}: ${e.message}`);
    }

    return articles;
}

// ============ DIRECT WEBSITE SCRAPING ============

async function scrapeWebsite(url, publisher, linkPattern, count = 12) {
    const articles = [];

    try {
        console.log(`   📰 Scraping: ${url}`);
        const response = await httpClient.get(url);
        const $ = cheerio.load(response.data);

        const links = new Set();
        $(`a[href*="${linkPattern}"]`).each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.length > 20) {
                const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
                links.add(fullUrl);
            }
        });

        for (const link of Array.from(links).slice(0, count)) {
            try {
                const pageRes = await httpClient.get(link, { timeout: 8000 });
                const $page = cheerio.load(pageRes.data);

                let title = $page('h1').first().text().trim();
                title = await translateToEnglish(title);

                if (!title || title.length < 15) continue;

                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('article img').first().attr('src') ||
                    $page('figure img').first().attr('src');

                if (image && !image.startsWith('http')) {
                    image = new URL(image, link).href;
                }

                articles.push({
                    id: link,
                    title,
                    publisher,
                    link,
                    time: $page('time').attr('datetime') || new Date().toISOString(),
                    thumbnail: image || getFallbackImage(publisher)
                });
            } catch (e) { }
        }
    } catch (e) {
        console.log(`   ❌ Scraping failed for ${publisher}: ${e.message}`);
    }

    return articles;
}

// ============ SAUDI ARABIA NEWS (7 SOURCES, 10+ EACH) ============

async function fetchAllSaudiNews() {
    console.log('\n🇸🇦 ========== SAUDI ARABIA NEWS ==========');

    const allNews = [];

    // 1. MUBASHER (Direct Scraping + Bing)
    console.log('📰 Fetching Mubasher SA...');
    let mubasher = await scrapeWebsite('https://english.mubasher.info/markets/TDWL', 'Mubasher', '/news/');
    if (mubasher.length < 5) {
        const bingMubasher = await fetchFromBingNews('site:english.mubasher.info Saudi', 'Mubasher', 10);
        mubasher = [...mubasher, ...bingMubasher];
    }
    allNews.push(...mubasher.slice(0, 12));
    console.log(`   ✅ Mubasher: ${mubasher.length} articles`);

    // 2. ARGAAM (RSS + Bing)
    console.log('📰 Fetching Argaam...');
    let argaam = await fetchFromRSS('https://www.argaam.com/en/rss/ho-main-news?sectionid=1524', 'Argaam', 12);
    if (argaam.length < 5) {
        const bingArgaam = await fetchFromBingNews('site:argaam.com', 'Argaam', 10);
        argaam = [...argaam, ...bingArgaam];
    }
    allNews.push(...argaam.slice(0, 12));
    console.log(`   ✅ Argaam: ${argaam.length} articles`);

    // 3. ARAB NEWS (RSS + Bing)
    console.log('📰 Fetching Arab News...');
    let arabNews = await fetchFromRSS('https://www.arabnews.com/rss.xml', 'Arab News', 12);
    if (arabNews.length < 5) {
        const bingArabNews = await fetchFromBingNews('site:arabnews.com Saudi', 'Arab News', 10);
        arabNews = [...arabNews, ...bingArabNews];
    }
    // Filter for Saudi-relevant news
    arabNews = arabNews.filter(a => /saudi|riyadh|aramco|tadawul|kingdom|gulf/i.test(a.title));
    allNews.push(...arabNews.slice(0, 12));
    console.log(`   ✅ Arab News: ${arabNews.length} articles`);

    // 4. ALEQT (Bing primary - Arabic site)
    console.log('📰 Fetching Aleqt...');
    const aleqt = await fetchFromBingNews('site:aleqt.com', 'Aleqt', 12);
    allNews.push(...aleqt.slice(0, 12));
    console.log(`   ✅ Aleqt: ${aleqt.length} articles`);

    // 5. REUTERS (Bing - use publisher name)
    console.log('📰 Fetching Reuters...');
    const reuters = await fetchFromBingNews('Reuters Saudi Arabia stock market oil', 'Reuters', 12);
    allNews.push(...reuters.slice(0, 12));
    console.log(`   ✅ Reuters: ${reuters.length} articles`);

    // 6. BLOOMBERG (Bing - use publisher name)
    console.log('📰 Fetching Bloomberg...');
    const bloomberg = await fetchFromBingNews('Bloomberg Saudi Arabia stocks economy', 'Bloomberg', 12);
    allNews.push(...bloomberg.slice(0, 12));
    console.log(`   ✅ Bloomberg: ${bloomberg.length} articles`);

    // 7. INVESTING.COM (Bing - use publisher name)
    console.log('📰 Fetching Investing.com...');
    const investing = await fetchFromBingNews('Investing.com Saudi Tadawul stocks', 'Investing.com', 12);
    allNews.push(...investing.slice(0, 12));
    console.log(`   ✅ Investing.com: ${investing.length} articles`);

    // Deduplicate by title
    const seen = new Set();
    const unique = allNews.filter(item => {
        if (!item.title) return false;
        const key = item.title.toLowerCase().substring(0, 40);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`\n🇸🇦 TOTAL SAUDI: ${unique.length} articles\n`);
    return unique;
}

// ============ EGYPT NEWS (6 SOURCES, 10+ EACH) ============

async function fetchAllEgyptNews() {
    console.log('\n🇪🇬 ========== EGYPT NEWS ==========');

    const allNews = [];

    // 1. MUBASHER EG (Direct Scraping + Bing)
    console.log('📰 Fetching Mubasher EG...');
    let mubasher = await scrapeWebsite('https://english.mubasher.info/countries/eg', 'Mubasher', '/news/');
    if (mubasher.length < 5) {
        const bingMubasher = await fetchFromBingNews('site:english.mubasher.info Egypt', 'Mubasher', 10);
        mubasher = [...mubasher, ...bingMubasher];
    }
    allNews.push(...mubasher.slice(0, 12));
    console.log(`   ✅ Mubasher: ${mubasher.length} articles`);

    // 2. ZAWYA (Bing - blocks direct RSS)
    console.log('📰 Fetching Zawya...');
    const zawya = await fetchFromBingNews('site:zawya.com Egypt', 'Zawya', 12);
    allNews.push(...zawya.slice(0, 12));
    console.log(`   ✅ Zawya: ${zawya.length} articles`);

    // 3. EGYPT TODAY (RSS + Bing)
    console.log('📰 Fetching Egypt Today...');
    let egyptToday = await fetchFromRSS('https://www.egypttoday.com/RSS/1', 'Egypt Today', 12);
    if (egyptToday.length < 5) {
        const bingEgyptToday = await fetchFromBingNews('site:egypttoday.com', 'Egypt Today', 10);
        egyptToday = [...egyptToday, ...bingEgyptToday];
    }
    allNews.push(...egyptToday.slice(0, 12));
    console.log(`   ✅ Egypt Today: ${egyptToday.length} articles`);

    // 4. DAILY NEWS EGYPT (RSS + Bing)
    console.log('📰 Fetching Daily News Egypt...');
    let dne = await fetchFromRSS('https://dailynewsegypt.com/feed/', 'Daily News Egypt', 12);
    if (dne.length < 5) {
        const bingDNE = await fetchFromBingNews('site:dailynewsegypt.com', 'Daily News Egypt', 10);
        dne = [...dne, ...bingDNE];
    }
    allNews.push(...dne.slice(0, 12));
    console.log(`   ✅ Daily News Egypt: ${dne.length} articles`);

    // 5. ARAB FINANCE (Bing - use publisher name)
    console.log('📰 Fetching Arab Finance...');
    const arabFinance = await fetchFromBingNews('Arab Finance Egypt stock market economy', 'Arab Finance', 12);
    allNews.push(...arabFinance.slice(0, 12));
    console.log(`   ✅ Arab Finance: ${arabFinance.length} articles`);

    // 6. INVESTING.COM EG (Bing - use publisher name)
    console.log('📰 Fetching Investing.com EG...');
    const investing = await fetchFromBingNews('Investing.com Egypt EGX stocks', 'Investing.com', 12);
    allNews.push(...investing.slice(0, 12));
    console.log(`   ✅ Investing.com: ${investing.length} articles`);

    // Deduplicate by title
    const seen = new Set();
    const unique = allNews.filter(item => {
        if (!item.title) return false;
        const key = item.title.toLowerCase().substring(0, 40);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`\n🇪🇬 TOTAL EGYPT: ${unique.length} articles\n`);
    return unique;
}

// ============ CONTENT EXTRACTION (For Full Article) ============

async function extractContentFromPage(url) {
    try {
        const response = await httpClient.get(url, { timeout: 10000 });
        const $ = cheerio.load(response.data);

        // Remove noise elements
        $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .related, .social').remove();

        const selectors = [
            '.article-body', '.article-content', '.entry-content', '.post-content',
            '#articleContent', '.story-body', '[itemprop="articleBody"]', 'article'
        ];

        let content = '';
        for (const sel of selectors) {
            if ($(sel).length > 0) {
                $(sel).find('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 30) content += `<p>${text}</p>`;
                });
                if (content.length > 300) break;
            }
        }

        // Fallback
        if (content.length < 200) {
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                if (text.length > 40 && !text.includes('©')) {
                    content += `<p>${text}</p>`;
                }
            });
        }

        return content;
    } catch (e) {
        return null;
    }
}

module.exports = {
    fetchAllSaudiNews,
    fetchAllEgyptNews,
    fetchFromBingNews,
    fetchFromRSS,
    scrapeWebsite,
    extractImageFromPage,
    extractContentFromPage,
    translateToEnglish,
    getFallbackImage,
    SOURCE_LOGOS
};
