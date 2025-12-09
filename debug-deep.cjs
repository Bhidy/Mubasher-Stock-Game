const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Suppress console.info
console.info = () => { };

async function debugFull(symbol) {
    console.log(`\n\n=== FULL DEBUG: ${symbol} ===`);
    try {
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: [
                'summaryDetail',
                'defaultKeyStatistics',
                'financialData',
                'incomeStatementHistory',
                'balanceSheetHistory',
                'cashflowStatementHistory',
                'earnings'
            ]
        });

        // 1. Where is Revenue?
        console.log('\n--- 1. REVENUE SEARCH ---');
        console.log('financialData.totalRevenue:', result.financialData?.totalRevenue);
        const income = result.incomeStatementHistory?.incomeStatementHistory;
        if (income && income.length > 0) {
            console.log('incomeStatementHistory[0].totalRevenue:', income[0].totalRevenue);
        }

        // 2. Where is EPS?
        console.log('\n--- 2. EPS SEARCH ---');
        console.log('defaultKeyStatistics.trailingEps:', result.defaultKeyStatistics?.trailingEps);
        console.log('defaultKeyStatistics.forwardEps:', result.defaultKeyStatistics?.forwardEps);
        const epsTrend = result.earnings?.earningsChart?.quarterly;
        if (epsTrend && epsTrend.length > 0) {
            console.log('earnings.earningsChart.quarterly (latest):', epsTrend[epsTrend.length - 1]);
        }

        // 3. Where is Dividend?
        console.log('\n--- 3. DIVIDEND SEARCH ---');
        console.log('summaryDetail.dividendYield:', result.summaryDetail?.dividendYield);
        console.log('summaryDetail.trailingAnnualDividendRate:', result.summaryDetail?.trailingAnnualDividendRate);

        // 4. Where is Shares Outstanding?
        console.log('\n--- 4. SHARES SEARCH ---');
        console.log('defaultKeyStatistics.sharesOutstanding:', result.defaultKeyStatistics?.sharesOutstanding);
        console.log('defaultKeyStatistics.impliedSharesOutstanding:', result.defaultKeyStatistics?.impliedSharesOutstanding);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function run() {
    await debugFull('COMI.CA'); // Egypt
    await debugFull('2222.SR'); // Saudi
}

run();
