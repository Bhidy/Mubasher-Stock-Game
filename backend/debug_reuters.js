const axios = require('axios');
const cheerio = require('cheerio');

// Mocking the checkUrlContent function from api/news.js
async function checkUrlContent(url) {
    console.log(`\n🔍 Checking: ${url}`);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Increased to 5s for debug

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml'
            },
            timeout: 5000,
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.data) {
            console.log('❌ No Data');
            return false;
        }

        const size = response.data.length;
        console.log(`📦 Response Size: ${size} bytes`);

        // Quick verify: Load HTML, strip noise, check text length
        const $ = cheerio.load(response.data);
        $('script, style, nav, footer, header').remove();
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        console.log(`📝 Extracted Text Length: ${text.length}`);
        console.log(`📄 Preview: ${text.substring(0, 200)}...`);

        if (text.length > 500) {
            console.log('✅ PASS (> 500 chars)');
            return true;
        } else {
            console.log('❌ FAIL (< 500 chars)');
            return false;
        }
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
        return false;
    }
}

// URLs to test (Official Reuters vs Aggregators)
const urls = [
    // Official Reuters (Should PASS)
    'https://www.reuters.com/business/finance/guggenheim-investments-opens-dubai-office-it-expands-middle-east-2023-12-04/',
    // Just a random Reuters business link guess - need a real one
    'https://www.reuters.com/article/idUSKCN1S30AG', // Old style
    // Aggregator / Bad (Should FAIL)
    'https://www.msn.com/en-us/money/companies/reuters-sample', // Fake check
    'https://finance.yahoo.com/news/reuters-sample'
];

// Try to find real URLs from Bing
const Parser = require('rss-parser');
const parser = new Parser();

async function run() {
    console.log('--- Fetching Real Candidates via Bing RSS ---');
    try {
        const feed = await parser.parseURL('https://www.bing.com/news/search?q=Reuters+Saudi+Arabia+business+news&format=rss&mkt=en-us');
        for (const item of feed.items.slice(0, 5)) {
            let finalUrl = item.link;
            try {
                const u = new URL(item.link);
                const r = u.searchParams.get('url');
                if (r) finalUrl = decodeURIComponent(r); // Decode!
            } catch (e) { }

            await checkUrlContent(finalUrl);
        }
    } catch (e) {
        console.error('RSS Error:', e);
    }
}

run();
