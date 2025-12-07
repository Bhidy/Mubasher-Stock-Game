const yahooFinance = require('yahoo-finance2').default;

async function checkEgyptNews() {
    try {
        const queries = ['Egypt Stock Market', 'COMI.CA', 'Egyptian Exchange', 'Middle East Economy'];

        for (const q of queries) {
            console.log(`\n--- Testing Query: "${q}" ---`);
            const res = await yahooFinance.search(q, { newsCount: 2 });
            if (res.news && res.news.length > 0) {
                console.log(`SUCCESS! Found ${res.news.length} articles.`);
                console.log("Title:", res.news[0].title);
            } else {
                console.log("No news found.");
            }
        }

    } catch (e) {
        console.error(e);
    }
}

checkEgyptNews();
