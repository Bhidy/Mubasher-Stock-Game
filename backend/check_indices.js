const yahooFinance = require('yahoo-finance2').default;

async function checkQuotes() {
    const symbols = ['^TASI.SR', '^CASE30', '^DJI'];
    for (const s of symbols) {
        try {
            console.log(`Fetching ${s}...`);
            const res = await yahooFinance.quote(s);
            console.log(`✅ ${s}: ${res.regularMarketPrice}`);
        } catch (e) {
            console.log(`❌ ${s} Failed: ${e.message}`);
        }
    }
}

checkQuotes();
