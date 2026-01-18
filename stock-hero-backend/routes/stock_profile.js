const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// ROUTE: GET /api/stock-profile?symbol=AAPL
router.get('/', async (req, res) => {
    const { symbol } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
    }

    try {
        console.log(`[Profile] Request for ${symbol}`);

        // 1. Check DB Cache
        const cacheRes = await pool.query('SELECT * FROM profile_cache WHERE symbol = $1', [symbol]);
        const cached = cacheRes.rows[0];

        // Cache Validity Duration (e.g., 24 hours)
        const CACHE_DURATION = 24 * 60 * 60 * 1000;
        const isFresh = cached && (new Date() - new Date(cached.updated_at) < CACHE_DURATION);
        console.log(`[Profile] Cached Row:`, cached ? 'FOUND' : 'NULL');
        if (cached) console.log(`[Profile] Freshness: ${new Date() - new Date(cached.updated_at)}ms / ${CACHE_DURATION}ms`);


        if (isFresh) {
            console.log(`[Profile] Returning Cached data for ${symbol}`);
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached.data);
        }

        console.log(`[Profile] Cache miss/stale for ${symbol}. Fetching live...`);

        // 2. Fetch Live
        try {
            const queryOptions = { modules: ['summaryProfile', 'summaryDetail', 'price', 'financialData', 'defaultKeyStatistics'] };
            const result = await yahooFinance.quoteSummary(symbol, queryOptions);

            if (!result) throw new Error('No result from Yahoo');

            const profile = result.summaryProfile || {};
            const detail = result.summaryDetail || {};
            const price = result.price || {};

            // Robust Mapping
            const data = {
                symbol: symbol,
                name: price.shortName || price.longName || symbol,
                description: profile.longBusinessSummary || 'No description available.',
                sector: profile.sector || 'N/A',
                industry: profile.industry || 'N/A',
                website: profile.website || '',
                employees: profile.fullTimeEmployees || 0,
                city: profile.city || '',
                country: profile.country || '',

                // Market Data
                currentPrice: price.regularMarketPrice,
                currency: price.currency,
                marketCap: price.marketCap,
                volume: detail.volume || price.regularMarketVolume,

                // Financials - Income Statement
                totalRevenue: result.financialData?.totalRevenue,
                revenuePerShare: result.financialData?.revenuePerShare,
                revenueGrowth: result.financialData?.revenueGrowth,
                grossProfits: result.financialData?.grossProfits, // Note: Yahoo often puts this in financialData
                ebitda: result.financialData?.ebitda,
                netIncomeToCommon: result.defaultKeyStatistics?.netIncomeToCommon,

                // Margins
                profitMargins: result.financialData?.profitMargins,
                grossMargins: result.financialData?.grossMargins,
                operatingMargins: result.financialData?.operatingMargins,
                ebitdaMargins: result.financialData?.ebitdaMargins,

                // Cash Flow
                operatingCashflow: result.financialData?.operatingCashflow,
                freeCashflow: result.financialData?.freeCashflow,
                totalCash: result.financialData?.totalCash,
                totalCashPerShare: result.financialData?.totalCashPerShare,

                // Balance Sheet & Ratios
                totalDebt: result.financialData?.totalDebt,
                debtToEquity: result.financialData?.debtToEquity, // Yahoo returns as percentage usually (e.g. 50.5 for 50.5%)
                currentRatio: result.financialData?.currentRatio,
                quickRatio: result.financialData?.quickRatio,
                bookValue: result.defaultKeyStatistics?.bookValue,

                // Valuation
                peRatio: detail.trailingPE || result.summaryDetail?.trailingPE,
                forwardPE: result.summaryDetail?.forwardPE,
                pegRatio: result.defaultKeyStatistics?.pegRatio,
                priceToBook: result.defaultKeyStatistics?.priceToBook,
                priceToSales: result.summaryDetail?.priceToSalesTrailing12Months,
                enterpriseValue: result.defaultKeyStatistics?.enterpriseValue,
                trailingEps: result.defaultKeyStatistics?.trailingEps,
                forwardEps: result.defaultKeyStatistics?.forwardEps,
                dividendYield: detail.dividendYield || result.summaryDetail?.dividendYield,
                beta: detail.beta || result.summaryDetail?.beta,

                // Key Statistics
                sharesOutstanding: result.defaultKeyStatistics?.sharesOutstanding,
                floatShares: result.defaultKeyStatistics?.floatShares,
                sharesShort: result.defaultKeyStatistics?.sharesShort,
                shortRatio: result.defaultKeyStatistics?.shortRatio,
                heldPercentInsiders: result.defaultKeyStatistics?.heldPercentInsiders,
                heldPercentInstitutions: result.defaultKeyStatistics?.heldPercentInstitutions,

                // High/Low
                fiftyTwoWeekHigh: detail.fiftyTwoWeekHigh || null,
                fiftyTwoWeekLow: detail.fiftyTwoWeekLow || null,
                fiftyDayAverage: detail.fiftyDayAverage,
                twoHundredDayAverage: detail.twoHundredDayAverage,
                fiftyTwoWeekChange: result.defaultKeyStatistics?.['52WeekChange'], // Yahoo might key this as "52WeekChange"
                dayHigh: price.regularMarketDayHigh || null,
                dayLow: price.regularMarketDayLow || null,

                officers: (profile.companyOfficers || []).slice(0, 3).map(o => ({
                    name: o.name,
                    title: o.title,
                    pay: o.totalPay || 'N/A'
                })),

                logo: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${symbol.split('.')[0].toLowerCase()}.com&size=128`,
                lastUpdated: new Date().toISOString()
            };

            // 3. Upsert Cache
            await pool.query(
                `INSERT INTO profile_cache (symbol, data, updated_at)
                 VALUES ($1, $2, NOW())
                 ON CONFLICT (symbol) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
                [symbol, data]
            );

            res.setHeader('X-Cache', 'MISS');
            res.json(data);

        } catch (yahooErr) {
            console.error(`[Profile] Yahoo Error: ${yahooErr.message}`);

            // 4. Fallback to Stale Cache
            if (cached) {
                console.warn(`[Profile] Returning STALE data for ${symbol} due to upstream error.`);
                res.setHeader('X-Cache', 'STALE');
                return res.json({ ...cached.data, _stale: true, _error: yahooErr.message });
            }

            throw yahooErr; // Bubble up if no cache
        }

    } catch (error) {
        console.error(`[Profile] Fatal Error fetching ${symbol}:`, error.message);
        if (error.message.includes('404')) {
            res.status(404).json({ error: 'Stock not found' });
        } else if (error.message.includes('429')) {
            res.status(429).json({ error: 'Rate Limited by Yahoo' });
        } else {
            res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
        }
    }
});

module.exports = router;
