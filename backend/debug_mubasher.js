const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const parser = new Parser();

async function debugMubasher() {
    console.log('Fetching Google News RSS for Mubasher...');
    const feedUrl = 'https://news.google.com/rss/search?q=site:english.mubasher.info&hl=en-US&gl=US&ceid=US:en';

    try {
        const feed = await parser.parseURL(feedUrl);
        if (!feed.items || feed.items.length === 0) {
            console.log('No items found in RSS.');
            return;
        }

        const item = feed.items[0];
        console.log('Full Item:', JSON.stringify(item, null, 2));
        console.log(`\nProcessing Item: ${item.title}`);
        console.log(`Initial Link: ${item.link}`);

        // 1. Resolve Redirect
        console.log('Resolving redirect...');
        let finalUrl = item.link;
        try {
            const resp = await axios.get(item.link, {
                maxRedirects: 5,
                validateStatus: () => true,
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log(`Status: ${resp.status}`);
            if (resp.request?.res?.responseUrl) {
                finalUrl = resp.request.res.responseUrl;
            }
        } catch (e) {
            console.log('Redirect resolution failed:', e.message);
        }
        console.log(`Final URL: ${finalUrl}`);

        // 2. Fetch Content
        console.log('Fetching content page...');
        const pageResp = await axios.get(finalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        const html = pageResp.data;
        const $ = cheerio.load(html);

        // 3. Check Selectors
        console.log('\n--- Debugging Selectors ---');

        const ogImage = $('meta[property="og:image"]').attr('content');
        console.log(`og:image: ${ogImage}`);

        const firstImg = $('article img').first().attr('src');
        console.log(`article img: ${firstImg}`);

        const mainImg = $('main img').first().attr('src');
        console.log(`main img: ${mainImg}`);

        const heroImg = $('.hero-image img').attr('src'); // Guess
        console.log(`hero img (guess): ${heroImg}`);

        // Content
        const articleText = $('article').text().trim().substring(0, 100);
        console.log(`article text (first 100): ${articleText}`);

        const mainText = $('main').text().trim().substring(0, 100);
        console.log(`main text (first 100): ${mainText}`);

        const specificMubasherSelector = $('.article-body').text().trim().substring(0, 100);
        console.log(`specific .article-body: ${specificMubasherSelector}`);

    } catch (e) {
        console.log('Debug failed:', e);
    }
}

debugMubasher();
