const axios = require('axios');
const cheerio = require('cheerio');

async function testFallback() {
    const title = "Is It Too Late To Consider Buying Constellation Energy Corporation (NASDAQ:CEG)?";
    const originalContent = "<p>This is a developing story available on Simply Wall St..</p>";

    console.log('--- Testing Teaser Detection ---');
    const textOnlyVal = (originalContent || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const teaserPatterns = [
        /This is a developing story available on/i,
        /Read the full article on/i,
        /Continue reading at/i,
        /requires a subscription/i,
        /To read this article/i,
        /Please enable Javascript/i,
        /Access this article/i
    ];

    const isTeaser = teaserPatterns.some(p => p.test(textOnlyVal));
    console.log(`Is Teaser Detected? ${isTeaser}`);
    console.log(`Text value checked: "${textOnlyVal}"`);

    if (isTeaser) {
        console.log('\n--- Attempting Fallback Search (MSN) ---');
        try {
            const query = `${title} site:msn.com`;
            const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us`;
            console.log(`Fetching RSS: ${rssUrl}`);

            const rssResp = await axios.get(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $rss = cheerio.load(rssResp.data, { xmlMode: true });

            const items = $rss('item');
            console.log(`Found ${items.length} items on MSN.`);

            if (items.length > 0) {
                const link = items.first().find('link').text();
                console.log(`Top Link: ${link}`);
            } else {
                console.log('No MSN results found.');
            }

        } catch (e) {
            console.error(e.message);
        }

        console.log('\n--- Attempting Fallback Search (Yahoo Finance) ---');
        try {
            const query = `${title} site:finance.yahoo.com`;
            const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us`;
            console.log(`Fetching RSS: ${rssUrl}`);

            const rssResp = await axios.get(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $rss = cheerio.load(rssResp.data, { xmlMode: true });

            const items = $rss('item');
            console.log(`Found ${items.length} items on Yahoo.`);

            if (items.length > 0) {
                const link = items.first().find('link').text();
                console.log(`Top Link: ${link}`);
            }

        } catch (e) {
            console.error(e.message);
        }

        console.log('\n--- Attempting Fallback Search (Generic) ---');
        try {
            const query = `${title} -site:simplywall.st`;
            const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us`;
            console.log(`Fetching RSS: ${rssUrl}`);

            const rssResp = await axios.get(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $rss = cheerio.load(rssResp.data, { xmlMode: true });

            const items = $rss('item');
            console.log(`Found ${items.length} items Generic.`);

            // Print top 3 sources
            items.each((i, el) => {
                if (i < 3) console.log(`${i + 1}. ${$rss(el).find('title').text()} - ${$rss(el).find('link').text()}`);
            });

        } catch (e) {
            console.error(e.message);
        }
    }
}

testFallback();
