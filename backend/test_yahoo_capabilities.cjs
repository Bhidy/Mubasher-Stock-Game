const yahooFinance = require('yahoo-finance2').default;

async function checkYahoo() {
    const queries = ['EGX30.CA', 'Tadawul', 'Saudi Arabia', 'Egypt Economy'];

    for (const q of queries) {
        console.log(`\nTesting Yahoo Query: "${q}"`);
        try {
            const result = await yahooFinance.search(q, { newsCount: 5 });
            if (result.news && result.news.length > 0) {
                console.log(`  Top Result: ${result.news[0].title} (${new Date(result.news[0].providerPublishTime).toISOString()})`);
                console.log(`  Source: ${result.news[0].publisher}`);
            } else {
                console.log('  No news found.');
            }
        } catch (e) {
            console.error('  Error:', e.message);
        }
    }
}

checkYahoo();
