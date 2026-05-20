/**
 * US Market News Scraper
 * Scrapes US stock market news from free RSS feeds:
 * - Yahoo Finance (S&P 500, NASDAQ, DOW)
 * - CNBC Markets RSS
 * - MarketWatch
 */

const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../../public/data/news_US.json');
const MAX_ARTICLES = 120;

// RSS sources for US market news
const US_NEWS_SOURCES = [
    {
        name: 'Yahoo Finance',
        url: 'https://finance.yahoo.com/rss/headline?s=%5EGSPC,%5EIXIC,%5EDJI&region=US&lang=en-US',
        fallback: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC,%5EIXIC,%5EDJI&region=US&lang=en-US'
    },
    {
        name: 'Yahoo Finance Markets',
        url: 'https://finance.yahoo.com/rss/topstories',
    },
    {
        name: 'CNBC Markets',
        url: 'https://www.cnbc.com/id/15839135/device/rss/rss.html',
    },
    {
        name: 'MarketWatch',
        url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/',
        fallback: 'https://feeds.marketwatch.com/marketwatch/realtimeheadlines/'
    },
    {
        name: 'Seeking Alpha',
        url: 'https://seekingalpha.com/market_currents.xml',
    },
    {
        name: 'Investing.com US',
        url: 'https://www.investing.com/rss/news_25.rss',
    }
    // Note: Reuters RSS feeds (feeds.reuters.com) are permanently dead as of 2023
];

async function fetchRssFeed(source) {
    const parser = new Parser({
        timeout: 12000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
    });

    const articles = [];
    const urlsToTry = [source.url, source.fallback].filter(Boolean);

    for (const rssUrl of urlsToTry) {
        try {
            console.log(`  Fetching: ${rssUrl}`);
            const feed = await parser.parseURL(rssUrl);

            for (const item of feed.items || []) {
                if (!item.title || item.title.length < 10) continue;

                // Resolve published date
                let published_at = null;
                const rawDate = item.pubDate || item.isoDate || item.published;
                if (rawDate) {
                    try {
                        const d = new Date(rawDate);
                        if (!isNaN(d.getTime())) published_at = d.toISOString();
                    } catch (e) { }
                }

                // Use current time if no date found
                if (!published_at) published_at = new Date().toISOString();

                // Get article URL (resolve Yahoo Finance redirects)
                let articleUrl = item.link || item.url || '';
                if (articleUrl.includes('news.google.com')) {
                    try {
                        const urlObj = new URL(articleUrl);
                        const innerUrl = urlObj.searchParams.get('url');
                        if (innerUrl) articleUrl = innerUrl;
                    } catch (e) { }
                }

                // Get image from media tags
                let image_url = null;
                if (item.enclosure?.url) image_url = item.enclosure.url;
                else if (item['media:content']?.url) image_url = item['media:content'].url;
                else if (item['media:thumbnail']?.url) image_url = item['media:thumbnail'].url;

                // Get content snippet
                const content = (item.contentSnippet || item.content || item.description || '')
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .substring(0, 800);

                articles.push({
                    title: item.title.trim(),
                    url: articleUrl,
                    image_url,
                    published_at,
                    source: source.name,
                    country: 'US',
                    market: 'US',
                    content,
                });
            }

            if (articles.length > 0) break; // Success, don't try fallback
        } catch (e) {
            console.warn(`  ⚠ ${source.name} RSS failed (${rssUrl.substring(0, 60)}): ${e.message}`);
        }
    }

    return articles;
}

async function fetchYahooFinanceAPI() {
    /**
     * Yahoo Finance v1 search API - returns news without needing an API key
     * Works reliably for US market news
     */
    const articles = [];
    const queries = [
        'S&P 500 stock market',
        'NASDAQ Dow Jones',
        'US economy Federal Reserve',
        'Wall Street earnings',
    ];

    for (const query of queries) {
        try {
            const res = await axios.get('https://query2.finance.yahoo.com/v1/finance/search', {
                params: { q: query, quotesCount: 0, newsCount: 8 },
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                },
                timeout: 8000
            });

            const newsItems = res.data?.news || [];
            for (const item of newsItems) {
                if (!item.title) continue;

                let published_at = null;
                if (item.providerPublishTime) {
                    published_at = new Date(item.providerPublishTime * 1000).toISOString();
                }

                let image_url = null;
                if (item.thumbnail?.resolutions?.length > 0) {
                    // Pick the highest resolution thumbnail
                    const sorted = [...item.thumbnail.resolutions].sort((a, b) => (b.width || 0) - (a.width || 0));
                    image_url = sorted[0].url;
                }

                articles.push({
                    title: item.title.trim(),
                    url: item.link || `https://finance.yahoo.com/news/${item.uuid}`,
                    image_url,
                    published_at: published_at || new Date().toISOString(),
                    source: item.publisher || 'Yahoo Finance',
                    country: 'US',
                    market: 'US',
                    content: '',
                });
            }

            // Small delay between queries
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            console.warn(`Yahoo Finance API query failed: ${e.message}`);
        }
    }

    return articles;
}

async function main() {
    console.log('🇺🇸 Starting US Market News Scraper...');

    const allArticles = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    // 1. Yahoo Finance API (most reliable)
    console.log('\n📡 Fetching Yahoo Finance API...');
    try {
        const yahooArticles = await fetchYahooFinanceAPI();
        console.log(`  ✓ Yahoo Finance API: ${yahooArticles.length} articles`);
        allArticles.push(...yahooArticles);
    } catch (e) {
        console.warn(`  ✗ Yahoo Finance API failed: ${e.message}`);
    }

    // 2. RSS sources
    console.log('\n📡 Fetching RSS feeds...');
    for (const source of US_NEWS_SOURCES) {
        try {
            const articles = await fetchRssFeed(source);
            console.log(`  ✓ ${source.name}: ${articles.length} articles`);
            allArticles.push(...articles);
        } catch (e) {
            console.warn(`  ✗ ${source.name}: ${e.message}`);
        }
    }

    // 3. Deduplicate and filter
    const deduplicated = [];
    for (const article of allArticles) {
        const urlKey = article.url?.toLowerCase().trim();
        const titleKey = article.title?.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);

        if (!urlKey || seenUrls.has(urlKey)) continue;
        if (!titleKey || seenTitles.has(titleKey)) continue;
        if (article.title.length < 10) continue;

        seenUrls.add(urlKey);
        seenTitles.add(titleKey);
        deduplicated.push(article);
    }

    // 4. Sort newest first
    deduplicated.sort((a, b) => {
        const ta = new Date(a.published_at).getTime();
        const tb = new Date(b.published_at).getTime();
        return tb - ta;
    });

    // 5. Limit and save
    const finalArticles = deduplicated.slice(0, MAX_ARTICLES);

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalArticles, null, 2));

    const latest = finalArticles[0]?.published_at || 'unknown';
    console.log(`\n✅ US News Scraper Done: ${finalArticles.length} articles saved`);
    console.log(`   Latest: ${latest}`);
    console.log(`   Output: ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error('❌ US News Scraper FATAL:', err.message);
    process.exit(1);
});
