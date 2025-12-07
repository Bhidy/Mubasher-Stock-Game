const yahooFinance = require('yahoo-finance2').default;

async function testOthers() {
    const symbols = ['^EGX70.CA', '^EGX100.CA', '^EGX30CAP.CA'];
    for (const s of symbols) {
        try {
            const res = await yahooFinance.chart(s, { range: '1y' });
            console.log(`${s}: Found ${res.quotes.length} quotes`);
        } catch (e) {
            console.log(`${s}: Failed`);
        }
    }
}
testOthers();
