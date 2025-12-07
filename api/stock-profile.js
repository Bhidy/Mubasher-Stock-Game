import YahooFinance from 'yahoo-finance2';

// Version: 1.0.0 - Stock Profile API with Full Fundamentals
// Deployed: 2025-12-08

// Initialize Yahoo Finance
const yahooFinance = new YahooFinance();

// Stock name metadata
const STOCK_NAMES = {
    // Saudi Stocks
    '2222.SR': 'Saudi Aramco', '1120.SR': 'Al Rajhi Bank', '2010.SR': 'SABIC',
    '7010.SR': 'STC', '2082.SR': 'ACWA Power', '1180.SR': 'Saudi National Bank',
    '2050.SR': 'Savola', '1150.SR': 'Alinma', '1010.SR': 'Riyad Bank',
    '1211.SR': "Ma'aden", '4200.SR': 'Aldrees', '4002.SR': 'Mouwasat',
    // Egypt Stocks
    'COMI.CA': 'CIB Bank', 'HRHO.CA': 'EFG Hermes', 'TMGH.CA': 'TMG Holding',
    'SWDY.CA': 'Elsewedy', 'ETEL.CA': 'Telecom Egypt', 'FWRY.CA': 'Fawry',
    // US Stocks
    'AAPL': 'Apple', 'MSFT': 'Microsoft', 'GOOG': 'Alphabet', 'AMZN': 'Amazon',
    'TSLA': 'Tesla', 'NVDA': 'Nvidia', 'META': 'Meta'
};

// List of modules to fetch for complete data
const QUOTE_MODULES = [
    'price',
    'summaryDetail',
    'summaryProfile',
    'financialData',
    'defaultKeyStatistics',
    'recommendationTrend',
    'upgradeDowngradeHistory',
    'earningsTrend'
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ error: 'Symbol required' });
    }

    try {
        // Suppress warnings
        if (typeof yahooFinance.suppressNotices === 'function') {
            yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        }

        console.log(`📊 Fetching full profile for ${symbol}...`);

        // Fetch comprehensive data using quoteSummary
        const [quoteSummary, quote] = await Promise.all([
            yahooFinance.quoteSummary(symbol, { modules: QUOTE_MODULES }).catch(e => {
                console.error(`quoteSummary error for ${symbol}:`, e.message);
                return null;
            }),
            yahooFinance.quote(symbol).catch(e => {
                console.error(`quote error for ${symbol}:`, e.message);
                return null;
            })
        ]);

        if (!quoteSummary && !quote) {
            return res.status(404).json({
                error: 'Stock not found',
                symbol
            });
        }

        // Merge all data sources
        const price = quoteSummary?.price || {};
        const summaryDetail = quoteSummary?.summaryDetail || {};
        const summaryProfile = quoteSummary?.summaryProfile || {};
        const financialData = quoteSummary?.financialData || {};
        const keyStats = quoteSummary?.defaultKeyStatistics || {};
        const recommendation = quoteSummary?.recommendationTrend?.trend || [];

        // Build comprehensive response
        const stockData = {
            // Basic Info
            symbol: symbol,
            shortName: quote?.shortName || price?.shortName || STOCK_NAMES[symbol] || symbol,
            longName: quote?.longName || price?.longName || STOCK_NAMES[symbol] || symbol,
            exchange: quote?.exchange || price?.exchange || 'Unknown',
            currency: quote?.currency || price?.currency || (symbol.includes('.SR') ? 'SAR' : (symbol.includes('.CA') ? 'EGP' : 'USD')),

            // Price Data (Real-time)
            price: quote?.regularMarketPrice || price?.regularMarketPrice || 0,
            change: quote?.regularMarketChange || price?.regularMarketChange || 0,
            changePercent: quote?.regularMarketChangePercent || price?.regularMarketChangePercent || 0,
            prevClose: quote?.regularMarketPreviousClose || summaryDetail?.previousClose || 0,
            open: quote?.regularMarketOpen || summaryDetail?.open || 0,
            high: quote?.regularMarketDayHigh || summaryDetail?.dayHigh || 0,
            low: quote?.regularMarketDayLow || summaryDetail?.dayLow || 0,
            volume: quote?.regularMarketVolume || summaryDetail?.volume || 0,
            averageVolume: summaryDetail?.averageVolume || summaryDetail?.averageDailyVolume10Day || 0,

            // 52-Week Range
            fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh || keyStats?.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow || keyStats?.fiftyTwoWeekLow || 0,
            fiftyTwoWeekChange: keyStats?.['52WeekChange'] || 0,

            // Moving Averages
            fiftyDayAverage: summaryDetail?.fiftyDayAverage || keyStats?.fiftyDayAverage || 0,
            twoHundredDayAverage: summaryDetail?.twoHundredDayAverage || keyStats?.twoHundredDayAverage || 0,

            // Risk Metrics
            beta: summaryDetail?.beta || keyStats?.beta || 0,

            // Valuation Metrics
            marketCap: quote?.marketCap || summaryDetail?.marketCap || price?.marketCap || 0,
            enterpriseValue: keyStats?.enterpriseValue || 0,
            trailingPE: summaryDetail?.trailingPE || keyStats?.trailingPE || 0,
            forwardPE: summaryDetail?.forwardPE || keyStats?.forwardPE || 0,
            priceToBook: keyStats?.priceToBook || 0,
            enterpriseToEbitda: keyStats?.enterpriseToEbitda || 0,
            priceToSalesTrailing12Months: summaryDetail?.priceToSalesTrailing12Months || 0,

            // Earnings
            trailingEps: keyStats?.trailingEps || 0,
            forwardEps: keyStats?.forwardEps || 0,
            earningsGrowth: financialData?.earningsGrowth || 0,

            // Profitability
            profitMargins: financialData?.profitMargins || keyStats?.profitMargins || 0,
            grossMargins: financialData?.grossMargins || 0,
            operatingMargins: financialData?.operatingMargins || 0,
            ebitdaMargins: financialData?.ebitdaMargins || 0,
            returnOnEquity: financialData?.returnOnEquity || 0,
            returnOnAssets: financialData?.returnOnAssets || 0,

            // Revenue & Income
            totalRevenue: financialData?.totalRevenue || 0,
            revenuePerShare: financialData?.revenuePerShare || 0,
            revenueGrowth: financialData?.revenueGrowth || 0,
            grossProfits: financialData?.grossProfits || 0,
            ebitda: financialData?.ebitda || 0,
            netIncomeToCommon: keyStats?.netIncomeToCommon || 0,

            // Cash Flow
            operatingCashflow: financialData?.operatingCashflow || 0,
            freeCashflow: financialData?.freeCashflow || 0,
            totalCash: financialData?.totalCash || 0,
            totalCashPerShare: financialData?.totalCashPerShare || 0,

            // Debt
            totalDebt: financialData?.totalDebt || 0,
            debtToEquity: financialData?.debtToEquity || 0,
            currentRatio: financialData?.currentRatio || 0,
            quickRatio: financialData?.quickRatio || 0,

            // Book Value
            bookValue: keyStats?.bookValue || 0,

            // Dividends
            trailingAnnualDividendRate: summaryDetail?.trailingAnnualDividendRate || 0,
            trailingAnnualDividendYield: summaryDetail?.trailingAnnualDividendYield || 0,
            dividendYield: summaryDetail?.dividendYield || 0,
            payoutRatio: summaryDetail?.payoutRatio || keyStats?.payoutRatio || 0,
            lastDividendValue: keyStats?.lastDividendValue || 0,
            lastDividendDate: keyStats?.lastDividendDate || null,

            // Shares
            sharesOutstanding: keyStats?.sharesOutstanding || 0,
            floatShares: keyStats?.floatShares || 0,
            sharesShort: keyStats?.sharesShort || 0,

            // Analyst Targets
            targetHighPrice: financialData?.targetHighPrice || 0,
            targetLowPrice: financialData?.targetLowPrice || 0,
            targetMeanPrice: financialData?.targetMeanPrice || 0,
            targetMedianPrice: financialData?.targetMedianPrice || 0,
            numberOfAnalystOpinions: financialData?.numberOfAnalystOpinions || 0,
            recommendationKey: financialData?.recommendationKey || 'none',
            recommendationMean: financialData?.recommendationMean || 0,
            recommendationTrend: recommendation,

            // Company Profile
            sector: summaryProfile?.sector || quote?.sector || 'Unknown',
            industry: summaryProfile?.industry || quote?.industry || 'Unknown',
            country: summaryProfile?.country || 'Unknown',
            city: summaryProfile?.city || '',
            website: summaryProfile?.website || '',
            description: summaryProfile?.longBusinessSummary || '',
            fullTimeEmployees: summaryProfile?.fullTimeEmployees || 0,

            // Metadata
            lastUpdated: new Date().toISOString(),
            source: 'yahoo-finance'
        };

        // Cache for 60 seconds
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

        console.log(`✅ Stock profile fetched for ${symbol}`);
        return res.status(200).json(stockData);

    } catch (error) {
        console.error(`❌ Stock Profile API Error for ${symbol}:`, error.message);
        return res.status(500).json({
            error: 'Failed to fetch stock profile',
            message: error.message,
            symbol
        });
    }
}
