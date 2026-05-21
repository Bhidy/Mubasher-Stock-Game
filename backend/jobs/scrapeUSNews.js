/**
 * US Market News Scraper v3 — Quality-Enforced
 *
 * QUALITY GATES (both must pass to keep an article):
 *   ✅ Cover image   (og:image enrichment fallback)
 *   ✅ Content snippet (og:description fallback stored in data lake)
 *
 * Sources:
 *   Yahoo Finance API · Yahoo Finance RSS · CNBC Markets · Seeking Alpha
 *   MarketWatch · Investing.com · (all deduplicated)
 *
 * Enrichment pipeline:
 *   For every article missing an image, fetch the article URL and extract
 *   og:image + og:description. Uses domain-aware User-Agents to avoid 403s.
 *   Known-blocked domains are skipped immediately (saves time).
 *   Articles that still have no image after enrichment are dropped.
 */

const axios  = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const fs   = require('fs');
const path = require('path');

const OUTPUT_FILE       = path.join(__dirname, '../../public/data/news_US.json');
const MAX_ARTICLES      = 80;   // Target kept articles (post quality-gate)
const ENRICH_CONCURRENCY = 10;  // Parallel OG fetches
const ENRICH_TIMEOUT_MS  = 9000;

// ─── User-Agent routing ──────────────────────────────────────────────────────
// facebookexternalhit bypasses Yahoo Finance JS checks without needing 403
const UA_FACEBOOK = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
const UA_CHROME   = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Domains that consistently 403 / 404 OG fetches — skip them immediately
const SKIP_OG_DOMAINS = [
    'seekingalpha.com',
    'investing.com',
    'marketwatch.com',
    'wsj.com',
    'ft.com',
    'barrons.com',
];

// Domains that respond better to facebookexternalhit UA
const FB_UA_DOMAINS = ['yahoo.com', 'yimg.com'];

function uaFor(url) {
    try {
        const host = new URL(url).hostname;
        return FB_UA_DOMAINS.some(d => host.includes(d)) ? UA_FACEBOOK : UA_CHROME;
    } catch { return UA_CHROME; }
}

function isDomainBlocked(url) {
    try {
        const host = new URL(url).hostname;
        return SKIP_OG_DOMAINS.some(d => host.includes(d));
    } catch { return false; }
}

// ─── RSS Sources ─────────────────────────────────────────────────────────────
const US_NEWS_SOURCES = [
    { name: 'Yahoo Finance',         url: 'https://finance.yahoo.com/rss/headline?s=%5EGSPC,%5EIXIC,%5EDJI&region=US&lang=en-US' },
    { name: 'Yahoo Finance Markets', url: 'https://finance.yahoo.com/rss/topstories' },
    { name: 'CNBC Markets',          url: 'https://www.cnbc.com/id/15839135/device/rss/rss.html' },
    { name: 'MarketWatch',           url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/', fallback: 'https://feeds.marketwatch.com/marketwatch/realtimeheadlines/' },
    { name: 'Seeking Alpha',         url: 'https://seekingalpha.com/market_currents.xml' },
    { name: 'Investing.com US',      url: 'https://www.investing.com/rss/news_25.rss' },
];

// ─── OG Metadata Fetcher ──────────────────────────────────────────────────────
async function fetchOGMetadata(url) {
    if (!url || isDomainBlocked(url)) return { image_url: null, description: null };

    try {
        const res = await axios.get(url, {
            timeout: ENRICH_TIMEOUT_MS,
            headers: {
                'User-Agent': uaFor(url),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            maxRedirects: 4,
            // NO maxContentLength — Yahoo Finance pages exceed 300 KB; we slice manually below
        });

        // Parse only the first 100 KB — <head> with OG tags is always there
        const html = (res.data || '').substring(0, 100000);
        const $    = cheerio.load(html);

        const image_url =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[property="og:image:secure_url"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('meta[name="twitter:image:src"]').attr('content') ||
            null;

        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            null;

        return {
            image_url:   (image_url && image_url.startsWith('http')) ? image_url : null,
            description: description ? description.trim().substring(0, 600) : null,
        };
    } catch {
        return { image_url: null, description: null };
    }
}

// ─── Batch Enrichment ────────────────────────────────────────────────────────
async function enrichArticles(articles) {
    const toEnrich = articles.filter(a => !a.image_url && a.url);
    if (!toEnrich.length) { console.log('  (all articles already have images)'); return; }

    console.log(`\n🔍 Enriching ${toEnrich.length} articles for OG metadata...`);
    let done = 0;

    for (let i = 0; i < toEnrich.length; i += ENRICH_CONCURRENCY) {
        const batch = toEnrich.slice(i, i + ENRICH_CONCURRENCY);
        await Promise.all(batch.map(async (article) => {
            const meta = await fetchOGMetadata(article.url);
            if (meta.image_url)                    article.image_url = meta.image_url;
            if (!article.content && meta.description) article.content = meta.description;
            // Even for articles that already have images, backfill missing descriptions
            if (!article.content && meta.description) article.content = meta.description;
            done++;
        }));
        process.stdout.write(`   ${done}/${toEnrich.length} enriched...\r`);
    }
    console.log();

    const gained = toEnrich.filter(a => a.image_url).length;
    console.log(`   ✓ Images gained for ${gained}/${toEnrich.length} articles`);
}

// Also enrich description for articles that have images but no content
async function enrichDescriptions(articles) {
    const toEnrich = articles.filter(a => a.image_url && !a.content && a.url && !isDomainBlocked(a.url));
    if (!toEnrich.length) return;

    console.log(`\n📝 Enriching descriptions for ${toEnrich.length} image-only articles...`);
    let done = 0;
    for (let i = 0; i < toEnrich.length; i += ENRICH_CONCURRENCY) {
        const batch = toEnrich.slice(i, i + ENRICH_CONCURRENCY);
        await Promise.all(batch.map(async (article) => {
            const meta = await fetchOGMetadata(article.url);
            if (meta.description) article.content = meta.description;
            done++;
        }));
        process.stdout.write(`   ${done}/${toEnrich.length} enriched...\r`);
    }
    console.log();
}

// ─── RSS Feed Parser ──────────────────────────────────────────────────────────
async function fetchRssFeed(source) {
    const parser = new Parser({
        timeout: 12000,
        headers: { 'User-Agent': UA_CHROME, 'Accept': 'application/rss+xml, application/xml, text/xml, */*' }
    });

    const urlsToTry = [source.url, source.fallback].filter(Boolean);
    for (const rssUrl of urlsToTry) {
        try {
            console.log(`  Fetching: ${rssUrl}`);
            const feed = await parser.parseURL(rssUrl);
            const articles = [];

            for (const item of (feed.items || [])) {
                if (!item.title || item.title.length < 10) continue;

                // Date
                let published_at = null;
                const raw = item.pubDate || item.isoDate || item.published;
                if (raw) { try { const d = new Date(raw); if (!isNaN(d)) published_at = d.toISOString(); } catch {} }
                if (!published_at) published_at = new Date().toISOString();

                // URL
                let articleUrl = item.link || item.url || '';
                if (articleUrl.includes('news.google.com')) {
                    try { const u = new URL(articleUrl); articleUrl = u.searchParams.get('url') || articleUrl; } catch {}
                }

                // Image from RSS media tags
                let image_url = null;
                if (item.enclosure?.url)                      image_url = item.enclosure.url;
                else if (item['media:content']?.url)          image_url = item['media:content'].url;
                else if (item['media:thumbnail']?.url)        image_url = item['media:thumbnail'].url;
                else if (item['media:content']?.['$']?.url)   image_url = item['media:content']['$'].url;

                // Content snippet
                const content = (item.contentSnippet || item.content || item.description || '')
                    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 800);

                articles.push({ title: item.title.trim(), url: articleUrl, image_url: image_url || null,
                    published_at, source: source.name, country: 'US', market: 'US', content });
            }

            if (articles.length > 0) return articles;
        } catch (e) {
            console.warn(`  ⚠ ${source.name} (${rssUrl.substring(0, 60)}): ${e.message}`);
        }
    }
    return [];
}

// ─── Yahoo Finance Search API ─────────────────────────────────────────────────
async function fetchYahooFinanceAPI() {
    const articles = [];
    const queries = [
        'S&P 500 stock market today',
        'NASDAQ Dow Jones earnings',
        'US economy Federal Reserve inflation',
        'Wall Street stocks rally',
        'tech stocks Apple Microsoft Google',
        'energy oil stocks commodities',
    ];

    for (const query of queries) {
        try {
            const res = await axios.get('https://query2.finance.yahoo.com/v1/finance/search', {
                params: { q: query, quotesCount: 0, newsCount: 10 },
                headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
                timeout: 8000
            });

            for (const item of (res.data?.news || [])) {
                if (!item.title) continue;

                let published_at = item.providerPublishTime
                    ? new Date(item.providerPublishTime * 1000).toISOString()
                    : new Date().toISOString();

                // Pick highest-res thumbnail
                let image_url = null;
                if (item.thumbnail?.resolutions?.length) {
                    const sorted = [...item.thumbnail.resolutions].sort((a, b) => (b.width || 0) - (a.width || 0));
                    image_url = sorted[0].url || null;
                }

                articles.push({
                    title: item.title.trim(),
                    url: item.link || `https://finance.yahoo.com/news/${item.uuid}`,
                    image_url,
                    published_at,
                    source: item.publisher || 'Yahoo Finance',
                    country: 'US', market: 'US', content: '',
                });
            }
            await new Promise(r => setTimeout(r, 300));
        } catch (e) {
            console.warn(`  Yahoo Finance API query failed: ${e.message}`);
        }
    }
    return articles;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🇺🇸 US Market News Scraper v3 — quality-enforced\n');

    const allArticles = [];

    // 1. Yahoo Finance API (structured — includes thumbnails)
    console.log('📡 Yahoo Finance API...');
    try {
        const ya = await fetchYahooFinanceAPI();
        console.log(`  ✓ ${ya.length} articles (${ya.filter(a => a.image_url).length} with images)`);
        allArticles.push(...ya);
    } catch (e) { console.warn('  ✗', e.message); }

    // 2. RSS feeds
    console.log('\n📡 RSS feeds...');
    for (const source of US_NEWS_SOURCES) {
        try {
            const arts = await fetchRssFeed(source);
            console.log(`  ✓ ${source.name}: ${arts.length} articles`);
            allArticles.push(...arts);
        } catch (e) { console.warn(`  ✗ ${source.name}: ${e.message}`); }
    }

    // 3. Deduplicate
    const seenUrls = new Set(), seenTitles = new Set(), deduplicated = [];
    for (const article of allArticles) {
        const urlKey   = article.url?.toLowerCase().trim();
        const titleKey = article.title?.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
        if (!urlKey || seenUrls.has(urlKey))     continue;
        if (!titleKey || seenTitles.has(titleKey)) continue;
        if (article.title.length < 10)             continue;
        seenUrls.add(urlKey);
        seenTitles.add(titleKey);
        deduplicated.push(article);
    }
    console.log(`\n📊 ${deduplicated.length} unique articles before enrichment`);
    console.log(`   Already have image: ${deduplicated.filter(a => a.image_url).length}`);
    console.log(`   Need enrichment:    ${deduplicated.filter(a => !a.image_url).length}`);

    // 4. OG enrichment — images first, then descriptions
    await enrichArticles(deduplicated);

    // 5. Quality gate — must have image
    const withImage = deduplicated.filter(a => a.image_url);
    console.log(`\n✅ Quality gate: ${withImage.length}/${deduplicated.length} passed (have image)`);

    // 6. Backfill descriptions for articles that have images but no content
    await enrichDescriptions(withImage);

    // 7. Sort newest-first
    withImage.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    // 8. Save
    const final = withImage.slice(0, MAX_ARTICLES);
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(final, null, 2));

    console.log(`\n✅ Done:`);
    console.log(`   Saved         : ${final.length} articles`);
    console.log(`   With image    : ${final.filter(a => a.image_url).length}/${final.length}`);
    console.log(`   With content  : ${final.filter(a => (a.content||'').length > 30).length}/${final.length}`);
    console.log(`   Latest        : ${final[0]?.published_at || 'n/a'}`);
    console.log(`   Output        : ${OUTPUT_FILE}`);
}

main().catch(err => { console.error('❌ FATAL:', err.message); process.exit(1); });
