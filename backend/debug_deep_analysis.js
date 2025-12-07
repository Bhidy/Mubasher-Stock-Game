const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Parser = require('rss-parser');

const parser = new Parser();

// The exact function from api/news.js (with Googlebot UA and Selectors)
async function checkUrlContent(url, label) {
    console.log(`\n🔍 Checking [${label}]: ${url}`);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s for debug to rule out timeout

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 8000,
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.data) {
            console.log('❌ No Data returned');
            return;
        }

        // Save HTML for inspection
        const filename = `backend/debug_${label}.html`;
        fs.writeFileSync(filename, response.data);
        console.log(`💾 Saved HTML to ${filename}`);

        const $ = cheerio.load(response.data);

        // Selectors from api/news.js
        const selectors = [
            '#articleBody', '.article-body', '.td-post-content', '.details-body',
            '.article-text', '.WYSIWYG.articlePage', '#article', '[data-test-id="post-content"]',
            '.caas-body', '.news-details', '.ArticleBody', '.story-text',
            '.story-content', 'article', '.main-content', 'main'
        ];

        let matchedSelector = null;
        let matchedTextLength = 0;

        for (const sel of selectors) {
            if ($(sel).length > 0) {
                const len = $(sel).text().trim().length;
                console.log(`   - Found selector '${sel}': ${len} chars`);
                if (len > 250) {
                    matchedSelector = sel;
                    matchedTextLength = len;
                    break;
                }
            }
        }

        if (matchedSelector) {
            console.log(`✅ VERIFIED via selector '${matchedSelector}' (${matchedTextLength} chars)`);
        } else {
            console.log('⚠️ No selector matched. Checking body fallback...');
            $('script, style, nav, footer, header').remove();
            const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
            console.log(`   - Body Text Length: ${bodyText.length}`);
            if (bodyText.length > 600) {
                console.log('✅ VERIFIED via Body Text Fallback');
            } else {
                console.log('❌ FAILED Verification (Not enough text)');
            }
        }

    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
    }
}

// Helper: Check using native fetch (Node 18+)
async function checkUrlContentFetch(url, label) {
    console.log(`\n🔍 Checking [${label}] (Native Fetch): ${url}`);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.ok) {
            console.log(`❌ Fetch failed: ${response.status} ${response.statusText}`);
            return;
        }

        const text = await response.text();
        console.log(`✅ Fetch Success! Length: ${text.length}`);

        // Save for inspection
        fs.writeFileSync(`backend/debug_fetch_${label}.html`, text);

        const $ = cheerio.load(text);
        // Selectors from api/news.js
        const selectors = [
            '#articleBody', '.article-body', '.td-post-content', '.details-body',
            '.article-text', '.WYSIWYG.articlePage', '#article', '[data-test-id="post-content"]',
            '.caas-body', '.news-details', '.ArticleBody', '.story-text',
            '.story-content', 'article', '.main-content', 'main'
        ];

        let matchedSelector = null;
        for (const sel of selectors) {
            if ($(sel).length > 0 && $(sel).text().trim().length > 250) {
                matchedSelector = sel;
                break;
            }
        }

        if (matchedSelector) console.log(`   - Selector matched: ${matchedSelector}`);
        else console.log('   - No selector matched');

    } catch (e) {
        console.log(`❌ Fetch Error: ${e.message}`);
    }
}

async function run() {
    console.log('--- Fetching Live Candidates ---');
    try {
        // 1. Get current feed
        const feed = await parser.parseURL('https://www.bing.com/news/search?q=Reuters+Saudi+Arabia+business+news&format=rss&mkt=en-us');

        let goodUrl = null;

        for (const item of feed.items) {
            let finalUrl = item.link;
            try {
                const u = new URL(item.link);
                const r = u.searchParams.get('url');
                if (r) finalUrl = decodeURIComponent(r);
            } catch (e) { }

            if (finalUrl.includes('reuters.com')) {
                goodUrl = finalUrl;
                break;
            }
        }

        if (goodUrl) {
            await checkUrlContent(goodUrl, 'axios_reuters'); // Old
            await checkUrlContentFetch(goodUrl, 'fetch_reuters'); // New
        } else {
            console.log('No Reuters link found to test');
        }

    } catch (e) {
        console.error('Run Error:', e);
    }
}

run();
