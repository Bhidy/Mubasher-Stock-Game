const yahooFinance = require('yahoo-finance2').default;

async function testYahoo() {
    try {
        console.log('Testing Yahoo Finance News...');
        // Saudi: ^TASI
        const saNews = await yahooFinance.search('Saudi Arabia stock market', { newsCount: 5 });
        console.log('\n--- Saudi News (Search) ---');
        console.log(saNews.news.slice(0, 3));

        // Egypt: ^EGX30
        const egNews = await yahooFinance.search('Egypt stock market', { newsCount: 5 });
        console.log('\n--- Egypt News (Search) ---');
        console.log(egNews.news.slice(0, 3));

    } catch (e) {
        console.error('Yahoo Error:', e);
    }
}

testYahoo();
