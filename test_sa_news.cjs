// Standalone test for SA RSS feeds
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
    console.log("Checking Saudi Sources...");
    await checkSource('site:aleqt.com'); // Checking likely domain
    await checkSource('site:aleq.com'); // Checking user provided domain
    await checkSource('site:argaam.com');
    await checkSource('site:arabnews.com stock');
}

run();
