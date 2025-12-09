// Comprehensive test - get all data with proper extraction
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const getVal = (obj, key) => {
    if (!obj || !key) return null;
    const val = obj[key];
    if (val === undefined || val === null) return null;
    if (typeof val === 'object' && val.raw !== undefined) return val.raw;
    return val;
};

async function testFull(symbol) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`FULL DATA TEST: ${symbol}`);
    console.log('='.repeat(60));

    try {
        // Get quote
        const q = await yahooFinance.quote(symbol);

        // Get summary modules
        const summary = await yahooFinance.quoteSummary(symbol, {
            modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile']
        });

        const s = summary.summaryDetail || {};
        const d = summary.defaultKeyStatistics || {};
        const f = summary.financialData || {};
        const p = summary.assetProfile || {};

        console.log('\n📊 OVERVIEW TAB - Trading Info:');
        console.log(`  Price:          ${q.regularMarketPrice}`);
        console.log(`  Open:           ${q.regularMarketOpen || getVal(s, 'open')}`);
        console.log(`  High:           ${q.regularMarketDayHigh || getVal(s, 'dayHigh')}`);
        console.log(`  Low:            ${q.regularMarketDayLow || getVal(s, 'dayLow')}`);
        console.log(`  Prev Close:     ${q.regularMarketPreviousClose || getVal(s, 'previousClose')}`);
        console.log(`  Volume:         ${q.regularMarketVolume || getVal(s, 'volume')}`);
        console.log(`  Avg Volume:     ${q.averageDailyVolume10Day || getVal(s, 'averageVolume')}`);

        console.log('\n📊 OVERVIEW TAB - 52-Week Range:');
        console.log(`  52W High:       ${q.fiftyTwoWeekHigh || getVal(s, 'fiftyTwoWeekHigh')}`);
        console.log(`  52W Low:        ${q.fiftyTwoWeekLow || getVal(s, 'fiftyTwoWeekLow')}`);
        console.log(`  50-Day MA:      ${q.fiftyDayAverage || getVal(s, 'fiftyDayAverage')}`);
        console.log(`  200-Day MA:     ${q.twoHundredDayAverage || getVal(s, 'twoHundredDayAverage')}`);
        console.log(`  Beta:           ${getVal(d, 'beta')}`);

        console.log('\n📊 OVERVIEW TAB - Key Stats:');
        console.log(`  Market Cap:     ${q.marketCap || getVal(s, 'marketCap')}`);
        console.log(`  P/E Ratio:      ${q.trailingPE || getVal(s, 'trailingPE')}`);
        console.log(`  EPS:            ${q.epsTrailingTwelveMonths || getVal(d, 'trailingEps')}`);
        console.log(`  Dividend Yield: ${q.trailingAnnualDividendYield || getVal(s, 'dividendYield')}`);

        console.log('\n📊 OWNERSHIP:');
        console.log(`  Shares Out:     ${getVal(d, 'sharesOutstanding')}`);
        console.log(`  Float:          ${getVal(d, 'floatShares')}`);
        console.log(`  Short Interest: ${getVal(d, 'sharesShort')}`);

        console.log('\n💰 FINANCIALS:');
        console.log(`  Revenue:        ${getVal(f, 'totalRevenue')}`);
        console.log(`  EBITDA:         ${getVal(f, 'ebitda')}`);
        console.log(`  Net Income:     ${getVal(f, 'netIncomeToCommon')}`);
        console.log(`  Profit Margin:  ${getVal(f, 'profitMargins')}`);
        console.log(`  Gross Margin:   ${getVal(f, 'grossMargins')}`);
        console.log(`  Total Cash:     ${getVal(f, 'totalCash')}`);
        console.log(`  Total Debt:     ${getVal(f, 'totalDebt')}`);
        console.log(`  ROE:            ${getVal(f, 'returnOnEquity')}`);
        console.log(`  ROA:            ${getVal(f, 'returnOnAssets')}`);

        console.log('\n📈 VALUATION:');
        console.log(`  Enterprise Val: ${getVal(d, 'enterpriseValue')}`);
        console.log(`  EV/EBITDA:      ${getVal(d, 'enterpriseToEbitda')}`);
        console.log(`  Price/Book:     ${q.priceToBook || getVal(d, 'priceToBook')}`);
        console.log(`  Forward P/E:    ${q.forwardPE || getVal(d, 'forwardPE')}`);

        console.log('\n🎯 ANALYSTS:');
        console.log(`  Target Mean:    ${getVal(f, 'targetMeanPrice')}`);
        console.log(`  Target High:    ${getVal(f, 'targetHighPrice')}`);
        console.log(`  Target Low:     ${getVal(f, 'targetLowPrice')}`);
        console.log(`  Recommendation: ${f.recommendationKey}`);

        console.log('\n✅ ALL DATA AVAILABLE!');

    } catch (e) {
        console.error(`Error:`, e.message);
    }
}

async function run() {
    await testFull('2222.SR');
}

run();
