const Parser = require('rss-parser');
const parser = new Parser();

async function checkArabicRSS() {
    const queries = [
        'أخبار البورصة المصرية', // Egypt Stock News
        'سوق الأسهم السعوديه', // Saudi Stock Market
        'تداول', // Tadawul
        'اقتصاد مصر' // Egypt Economy
    ];

    for (const q of queries) {
        console.log(`\nTesting Arabic Query: "${q}"`);
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&sort=date`; // sort=date for Bing standard

        try {
            const feed = await parser.parseURL(url);
            if (feed.items.length > 0) {
                console.log(`  Top Result: ${feed.items[0].title} (${feed.items[0].pubDate})`);
            } else {
                console.log('  No results.');
            }
        } catch (e) {
            console.error('  Error:', e.message);
        }
    }
}

checkArabicRSS();
