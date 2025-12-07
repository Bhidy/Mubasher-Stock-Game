const Parser = require('rss-parser');
const parser = new Parser();

async function checkBing() {
    const queries = [
        'Egypt Stock Market',
        'Mubasher Egypt',
        'Saudi Stock Market'
    ];

    for (const q of queries) {
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`;
        console.log(`Checking Bing RSS for: ${q}...`);
        try {
            const feed = await parser.parseURL(url);
            console.log(`✅ Found ${feed.items.length} items.`);
            if (feed.items.length > 0) {
                const item = feed.items[0];
                console.log('Title:', item.title);
                console.log('Link:', item.link); // IS THIS CLEAN?
                console.log('Source:', item.source || 'N/A');
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
}

checkBing();
