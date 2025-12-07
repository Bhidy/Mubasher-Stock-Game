const yahooFinance = require('yahoo-finance2').default;

async function checkNews() {
    try {
        console.log("--- Fetching News for Saudi ---");
        // Often searching for the index ticker gives good market news
        const saudiNews = await yahooFinance.search('Tadawul', { newsCount: 3 });
        console.log(JSON.stringify(saudiNews.news[0], null, 2));

        console.log("\n--- Fetching News for Egypt ---");
        const egyptNews = await yahooFinance.search('EGX 30', { newsCount: 3 });
        console.log(JSON.stringify(egyptNews.news[0], null, 2));

        console.log("\n--- Fetching News for US ---");
        const usNews = await yahooFinance.search('S&P 500', { newsCount: 3 });
        console.log(JSON.stringify(usNews.news[0], null, 2));

    } catch (e) {
        console.error(e);
    }
}

checkNews();
