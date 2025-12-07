const { scrapeMubasherWeb, scrapeArabFinance } = require('./backend/jobs/newsScraper');

async function testEgyptScrapers() {
    console.log('Testing Mubasher EG...');
    const mubasher = await scrapeMubasherWeb('eg');
    console.log(`Mubasher Found: ${mubasher.length} articles`);
    if (mubasher.length > 0) console.log(mubasher[0]);

    console.log('\nTesting Arab Finance...');
    const arab = await scrapeArabFinance();
    console.log(`Arab Finance Found: ${arab.length} articles`);
    if (arab.length > 0) console.log(arab[0]);
}

testEgyptScrapers();
