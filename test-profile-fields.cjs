// Test the stock profile API locally
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Suppress notices
if (typeof yahooFinance.suppressNotices === 'function') {
    yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
}

async function testSymbol(symbol) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TESTING: ${symbol}`);
    console.log('='.repeat(60));

    try {
        const [quoteResult, summaryResult] = await Promise.allSettled([
            yahooFinance.quote(symbol),
            yahooFinance.quoteSummary(symbol, {
                modules: ['assetProfile', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'earnings']
            })
        ]);

        const q = quoteResult.status === 'fulfilled' ? quoteResult.value : {};
        const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : {};

        if (quoteResult.status === 'rejected') {
            console.log('❌ Quote FAILED:', quoteResult.reason?.message);
        }
        if (summaryResult.status === 'rejected') {
            console.log('❌ Summary FAILED:', summaryResult.reason?.message);
        }

        const s = summary.summaryDetail || {};
        const d = summary.defaultKeyStatistics || {};
        const f = summary.financialData || {};
        const p = summary.assetProfile || {};

        // Report for Overview Tab
        console.log('\n📊 OVERVIEW TAB - Trading Info:');
        console.log(`  Price:          ${q.regularMarketPrice || 'N/A'}`);
        console.log(`  Open:           ${q.regularMarketOpen || s.open?.raw || 'N/A'}`);
        console.log(`  High:           ${q.regularMarketDayHigh || s.dayHigh?.raw || 'N/A'}`);
        console.log(`  Low:            ${q.regularMarketDayLow || s.dayLow?.raw || 'N/A'}`);
        console.log(`  Prev Close:     ${q.regularMarketPreviousClose || s.previousClose?.raw || 'N/A'}`);
        console.log(`  Volume:         ${q.regularMarketVolume || s.volume?.raw || 'N/A'}`);
        console.log(`  Avg Volume:     ${q.averageDailyVolume10Day || s.averageVolume?.raw || 'N/A'}`);

        console.log('\n📊 OVERVIEW TAB - 52-Week Range:');
        console.log(`  52W High:       ${q.fiftyTwoWeekHigh || s.fiftyTwoWeekHigh?.raw || 'N/A'}`);
        console.log(`  52W Low:        ${q.fiftyTwoWeekLow || s.fiftyTwoWeekLow?.raw || 'N/A'}`);
        console.log(`  50-Day MA:      ${q.fiftyDayAverage || s.fiftyDayAverage?.raw || 'N/A'}`);
        console.log(`  200-Day MA:     ${q.twoHundredDayAverage || s.twoHundredDayAverage?.raw || 'N/A'}`);
        console.log(`  Beta:           ${d.beta?.raw || 'N/A'}`);

        console.log('\n📊 OVERVIEW TAB - Key Statistics:');
        console.log(`  Market Cap:     ${q.marketCap || s.marketCap?.raw || 'N/A'}`);
        console.log(`  P/E Ratio:      ${q.trailingPE || s.trailingPE?.raw || 'N/A'}`);
        console.log(`  EPS:            ${q.epsTrailingTwelveMonths || d.trailingEps?.raw || 'N/A'}`);
        console.log(`  Dividend Yield: ${q.trailingAnnualDividendYield || s.dividendYield?.raw || 'N/A'}`);

        console.log('\n📊 OVERVIEW TAB - Ownership:');
        console.log(`  Shares Out:     ${d.sharesOutstanding?.raw || 'N/A'}`);
        console.log(`  Float:          ${d.floatShares?.raw || 'N/A'}`);
        console.log(`  Short Interest: ${d.sharesShort?.raw || 'N/A'}`);

        console.log('\n💰 FINANCIALS TAB:');
        console.log(`  Revenue:        ${f.totalRevenue?.raw || 'N/A'}`);
        console.log(`  EBITDA:         ${f.ebitda?.raw || 'N/A'}`);
        console.log(`  Net Income:     ${f.netIncomeToCommon?.raw || 'N/A'}`);
        console.log(`  Profit Margin:  ${f.profitMargins?.raw || 'N/A'}`);
        console.log(`  Total Cash:     ${f.totalCash?.raw || 'N/A'}`);
        console.log(`  Total Debt:     ${f.totalDebt?.raw || 'N/A'}`);

        console.log('\n📈 VALUATION TAB:');
        console.log(`  Enterprise Val: ${d.enterpriseValue?.raw || 'N/A'}`);
        console.log(`  EV/EBITDA:      ${d.enterpriseToEbitda?.raw || 'N/A'}`);
        console.log(`  Price/Book:     ${q.priceToBook || d.priceToBook?.raw || 'N/A'}`);
        console.log(`  ROE:            ${f.returnOnEquity?.raw || 'N/A'}`);
        console.log(`  ROA:            ${f.returnOnAssets?.raw || 'N/A'}`);

        console.log('\n🎯 ANALYSTS TAB:');
        console.log(`  Target Mean:    ${f.targetMeanPrice?.raw || 'N/A'}`);
        console.log(`  Target High:    ${f.targetHighPrice?.raw || 'N/A'}`);
        console.log(`  Target Low:     ${f.targetLowPrice?.raw || 'N/A'}`);
        console.log(`  Recommendation: ${f.recommendationKey || 'N/A'}`);

        console.log('\n🏢 ABOUT TAB:');
        console.log(`  Sector:         ${p.sector || 'N/A'}`);
        console.log(`  Industry:       ${p.industry || 'N/A'}`);
        console.log(`  Employees:      ${p.fullTimeEmployees || 'N/A'}`);
        console.log(`  Website:        ${p.website || 'N/A'}`);
        console.log(`  Country:        ${p.country || 'N/A'}`);

    } catch (e) {
        console.error(`Error testing ${symbol}:`, e.message);
    }
}

async function runTests() {
    await testSymbol('2222.SR');  // Saudi Aramco
    await testSymbol('COMI.CA');  // CIB Egypt
    await testSymbol('AAPL');     // Apple (for comparison)
}

runTests();
