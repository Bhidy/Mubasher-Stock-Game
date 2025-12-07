const Parser = require('rss-parser');
const parser = new Parser();

async function checkRSS() {
    const queries = [
        'site:mubasher.info Egypt',
        'site:zawya.com Egypt',
        'Egyptian Exchange',
        'Egypt Stock Market'
    ];

    for (const q of queries) {
        console.log(`\nTesting Query: "${q}"`);
        // Test with and without sortbydate
        const urlStd = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&mkt=en-us`;
        const urlSort = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&mkt=en-us&qft=sortbydate="1"`;

        try {
            console.log('  Fetching Standard...');
            const feedStd = await parser.parseURL(urlStd);
            if (feedStd.items.length > 0) {
                console.log(`    Top Result: ${feedStd.items[0].title} (${feedStd.items[0].pubDate})`);
            } else {
                console.log('    No results.');
            }

            console.log('  Fetching Sorted (Date)...');
            const feedSort = await parser.parseURL(urlSort);
            if (feedSort.items.length > 0) {
                console.log(`    Top Result: ${feedSort.items[0].title} (${feedSort.items[0].pubDate})`);
            } else {
                console.log('    No results.');
            }
        } catch (e) {
            console.error('    Error:', e.message);
        }
    }
}

checkRSS();
