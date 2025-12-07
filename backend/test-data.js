const yahooFinance = require('yahoo-finance2').default;

async function testFetch() {
    console.log("🔍 Testing Data Availability for 2222.SR (Aramco)...");

    try {
        const result = await yahooFinance.quoteSummary('2222.SR', {
            modules: ['summaryProfile', 'summaryDetail', 'financialData', 'defaultKeyStatistics', 'price']
        });

        const profile = result.summaryProfile || {};
        const detail = result.summaryDetail || {};
        const financial = result.financialData || {};
        const stats = result.defaultKeyStatistics || {};
        const price = result.price || {};

        console.log("\n✅ DATA CHECK:");
        console.log("------------------------------------------------");
        console.log(`Name: ${price.longName}`);
        console.log(`Price: ${price.regularMarketPrice} ${price.currency}`);
        console.log(`Description: ${profile.longBusinessSummary ? 'Yes (Found)' : 'MISSING'}`);
        console.log(`Sector: ${profile.sector}`);
        console.log(`Market Cap: ${price.marketCap}`);
        console.log(`P/E Ratio: ${detail.trailingPE}`);
        console.log(`EPS: ${stats.trailingEps}`);
        console.log(`Dividend Yield: ${detail.dividendYield}`);
        console.log(`52W High: ${detail.fiftyTwoWeekHigh}`);
        console.log(`50 Day MA: ${detail.fiftyDayAverage}`);
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testFetch();
