const yahooFinance = require('yahoo-finance2').default;

async function checkHistory(symbol) {
    console.log(`\n--- Checking ${symbol} ---`);
    try {
        // Test 1Y with Daily interval (Standard for long term)
        const res1y = await yahooFinance.chart(symbol, {
            period1: '2022-01-01',
            range: '1y',
            interval: '1d'
        });
        console.log(`1Y Daily: found ${res1y.quotes.length} quotes.`);
        if (res1y.quotes.length > 5) {
            console.log(`Sample: ${JSON.stringify(res1y.quotes[0])}`);
            console.log(`Last: ${JSON.stringify(res1y.quotes[res1y.quotes.length - 1])}`);
        } else {
            console.log("Data seems sparse/empty.");
        }

        // Test 5Y with Weekly
        const res5y = await yahooFinance.chart(symbol, {
            period1: '2015-01-01',
            range: '5y',
            interval: '1wk'
        });
        console.log(`5Y Weekly: found ${res5y.quotes.length} quotes.`);

    } catch (e) {
        console.log(`Error: ${e.message}`);
        if (e.errors) console.log(JSON.stringify(e.errors, null, 2));
    }
}

async function run() {
    await checkHistory('^CASE30');
    await checkHistory('^EGX30.CA');
    await checkHistory('EGX30.CA');
}
run();
