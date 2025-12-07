const yahooFinance = require('yahoo-finance2').default;

async function testCapabilities() {
    try {
        console.log("--- TESTING SAUDI STOCK (2222.SR - Aramco) ---");
        const saudiQuote = await yahooFinance.quote('2222.SR');
        console.log("Saudi Quote Keys:", Object.keys(saudiQuote).filter(k => saudiQuote[k] !== undefined && saudiQuote[k] !== null).join(', '));
        console.log("Sample Data (Price):", saudiQuote.regularMarketPrice);
        console.log("Sample Data (PE):", saudiQuote.trailingPE);

        console.log("\n--- TESTING EGYPT STOCK (COMI.CA - CIB) ---");
        try {
            const egyptQuote = await yahooFinance.quote('COMI.CA');
            console.log("Egypt Quote Keys:", Object.keys(egyptQuote).filter(k => egyptQuote[k] !== undefined && egyptQuote[k] !== null).join(', '));
            console.log("Sample Data (Price):", egyptQuote.regularMarketPrice);
        } catch (e) {
            console.log("Egypt Stock Fetch Failed:", e.message);
        }

        console.log("\n--- TESTING NEWS (General Search: 'Saudi Aramco') ---");
        const newsResult = await yahooFinance.search('Saudi Aramco', { newsCount: 3 });
        if (newsResult.news && newsResult.news.length > 0) {
            console.log("News Found:", newsResult.news.length);
            console.log("First Headline:", newsResult.news[0].title);
            console.log("Publisher:", newsResult.news[0].publisher);
            console.log("Link:", newsResult.news[0].link);
        } else {
            console.log("No News Found via Search.");
        }

        console.log("\n--- TESTING SPECIFIC NEWS FUNCTION (if available) ---");
        // yahoo-finance2 often relies on 'search' for news, but let's check validation options
        // We will infer news support from the search result above.

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testCapabilities();
