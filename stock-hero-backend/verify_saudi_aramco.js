const YahooFinancePkg = require('yahoo-finance2').default;
const yahooFinance = new YahooFinancePkg({ suppressNotices: ['yahooSurvey'] });

// 🛡️ THE FIXATION: Exponential Backoff Logic
async function fetchWithRobustness(symbol, retries = 5) {
    console.log(`\n🔍 Initiating Robust Fetch for: ${symbol}`);
    console.log('---------------------------------------------------');

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}/${retries}: Requesting data from Yahoo Finance...`);
            const startTime = Date.now();

            const quote = await yahooFinance.quote(symbol);

            const duration = Date.now() - startTime;
            console.log(`✅ Success! Data received in ${duration}ms.`);
            return quote;

        } catch (err) {
            if (err.message.includes('429') || err.message.includes('network')) {
                const waitTime = Math.pow(2, i + 1);
                console.warn(`⚠️  Rate Limit Detected (429). Applying Fixation...`);
                console.warn(`⏳  Waiting ${waitTime} seconds before retry...`);
                await new Promise(r => setTimeout(r, waitTime * 1000));
            } else {
                // Fatal error
                console.error(`❌ Fatal Error: ${err.message}`);
                throw err;
            }
        }
    }
    throw new Error(`Failed to fetch ${symbol} after ${retries} attempts.`);
}

async function verify() {
    try {
        const symbol = '2222.SR'; // Saudi Aramco
        const data = await fetchWithRobustness(symbol);

        console.log('\n📊 VERIFIED DATA for Saudi Aramco (2222.SR)');
        console.log('---------------------------------------------------');
        console.log(`💵 Current Price:   ${data.currency} ${data.regularMarketPrice}`);
        console.log(`📈 Change:          ${data.regularMarketChangePercent.toFixed(2)}%`);
        console.log(`🏢 Company:         ${data.longName || data.shortName}`);
        console.log(`📊 PE Ratio:        ${data.trailingPE || 'N/A'}`);
        console.log(`💰 Dividend Yield:  ${(data.dividendYield * 100).toFixed(2)}%`);
        console.log(`🌍 Exchange:        ${data.fullExchangeName}`);
        console.log(`⏱️  Market State:    ${data.marketState}`);
        console.log('---------------------------------------------------');
        console.log('✅ TEST RESULT: PASSED. Logic is robust.');

    } catch (err) {
        console.error('\n❌ TEST RESULT: FAILED');
        console.error(err.message);
    }
}

verify();
