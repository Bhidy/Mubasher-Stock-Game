const Parser = require('rss-parser');
const createParser = () => new Parser({
    timeout: 10000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
});

async function testSG() {
    const parser = createParser();
    try {
        console.log('Testing Saudi Gazette...');
        const feed = await parser.parseURL('https://saudigazette.com.sa/rssFeed/1');
        console.log(`SG Articles: ${feed.items.length}`);
    } catch (e) { console.log('SG Failed:', e.message); }
}

async function testInv() {
    const parser = createParser();
    try {
        console.log('Testing Investing SA...');
        const feed = await parser.parseURL('https://sa.investing.com/rss/news_14.rss');
        console.log(`Inv Articles: ${feed.items.length}`);
    } catch (e) { console.log('Inv Failed:', e.message); }
}

testSG();
testInv();
