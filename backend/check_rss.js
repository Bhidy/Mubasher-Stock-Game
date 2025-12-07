const Parser = require('rss-parser');
const parser = new Parser();

async function checkFeeds() {
    const feeds = [
        'http://feeds.mubasher.info/en/EGX/news',
        'https://english.mubasher.info/rss/countries/eg',
        'https://english.mubasher.info/rss/news.xml',
        'http://feeds.mubasher.info/en/news'
    ];

    for (const url of feeds) {
        try {
            console.log(`Checking ${url}...`);
            const feed = await parser.parseURL(url);
            console.log(`✅ Success! Found ${feed.items.length} items.`);
            console.log('Sample title:', feed.items[0].title);
            console.log('Sample date:', feed.items[0].pubDate);
            console.log('Sample link:', feed.items[0].link);
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
}

checkFeeds();
