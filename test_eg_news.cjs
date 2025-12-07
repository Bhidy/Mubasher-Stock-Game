// Standalone test for RSS feeds
// Standalone test for RSS feeds

// Actually server.js is an express app, it might be hard to import just the function if it's not exported.
// I'll write a standalone script that duplicates the logic to test the RSS feeds directly.

const Parser = require('rss-parser');
const parser = new Parser();

async function checkSource(query) {
    try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(url);
        console.log(`\n--- Results for query: ${query} ---`);
        if (feed.items.length === 0) console.log("No items found.");
        feed.items.slice(0, 3).forEach(item => {
            console.log(`Title: ${item.title}`);
            // Extract publisher logic
            let publisher = 'News';
            const parts = item.title.split(' - ');
            if (parts.length > 1) publisher = parts.pop();
            console.log(`Extracted Publisher: ${publisher}`);
        });
    } catch (e) {
        console.log(`Error checking ${query}: ${e.message}`);
    }
}

async function run() {
    console.log("Checking Egypt Sources...");
    await checkSource('site:english.mubasher.info Egypt');
    await checkSource('site:zawya.com Egypt');
    await checkSource('site:egypttoday.com');
    await checkSource('site:dailynewsegypt.com');
    await checkSource('site:arabfinance.com');
    await checkSource('site:investing.com Egypt');
}

run();
