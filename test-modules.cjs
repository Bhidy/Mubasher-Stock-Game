// Deep test - try each module separately
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function testModules(symbol) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TESTING MODULES FOR: ${symbol}`);
    console.log('='.repeat(60));

    const modules = [
        'summaryDetail',
        'defaultKeyStatistics',
        'financialData',
        'assetProfile',
        'earnings'
    ];

    for (const mod of modules) {
        try {
            const result = await yahooFinance.quoteSummary(symbol, { modules: [mod] });
            const data = result[mod];
            const keys = data ? Object.keys(data).length : 0;
            console.log(`✅ ${mod.padEnd(30)} - ${keys} fields`);

            // Show sample if financialData
            if (mod === 'financialData' && data) {
                console.log(`   → totalRevenue: ${data.totalRevenue?.raw ?? data.totalRevenue ?? 'N/A'}`);
                console.log(`   → ebitda: ${data.ebitda?.raw ?? data.ebitda ?? 'N/A'}`);
                console.log(`   → profitMargins: ${data.profitMargins?.raw ?? data.profitMargins ?? 'N/A'}`);
                console.log(`   → targetMeanPrice: ${data.targetMeanPrice?.raw ?? data.targetMeanPrice ?? 'N/A'}`);
            }
            if (mod === 'defaultKeyStatistics' && data) {
                console.log(`   → sharesOutstanding: ${data.sharesOutstanding?.raw ?? data.sharesOutstanding ?? 'N/A'}`);
                console.log(`   → enterpriseValue: ${data.enterpriseValue?.raw ?? data.enterpriseValue ?? 'N/A'}`);
                console.log(`   → beta: ${data.beta?.raw ?? data.beta ?? 'N/A'}`);
            }
        } catch (e) {
            console.log(`❌ ${mod.padEnd(30)} - FAILED: ${e.message}`);
        }
    }
}

async function run() {
    await testModules('2222.SR');
    await testModules('AAPL');
}

run();
