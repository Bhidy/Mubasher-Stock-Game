// Stock Profile API - Full Company Data from Yahoo Finance
// Version: 2.0.1 - ES Module Format

import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Robust Vercel Cache
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute cache

// Helper to safely get raw values from Yahoo Finance response objects
const getVal = (obj, key) => {
    if (!obj || !key) return null;
    const val = obj[key];
    if (val === undefined || val === null) return null;
    // Yahoo sometimes returns { raw: number, fmt: string }
    if (typeof val === 'object' && val.raw !== undefined) return val.raw;
    return val;
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    // Cache Check
    if (cache.has(symbol)) {
        const c = cache.get(symbol);
        if (Date.now() - c.ts < CACHE_TTL) {
            return res.status(200).json(c.data);
        }
    }

    try {
        // STRATEGY: Fetch Quote and QuoteSummary in parallel
        // Quote gives us real-time price data
        // QuoteSummary gives us detailed fundamentals

        const [quoteResult, summaryResult] = await Promise.allSettled([
            yahooFinance.quote(symbol),
            yahooFinance.quoteSummary(symbol, {
                modules: [
                    'assetProfile',
                    'summaryDetail',
                    'defaultKeyStatistics',
                    'financialData',
                    'earnings'
                ]
            })
        ]);

        // Extract results (use empty object if failed)
        const q = quoteResult.status === 'fulfilled' ? quoteResult.value : {};
        const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : {};

        // Log any failures for debugging
        if (quoteResult.status === 'rejected') {
            console.error(`Quote failed for ${symbol}:`, quoteResult.reason?.message);
        }
        if (summaryResult.status === 'rejected') {
            console.error(`Summary failed for ${symbol}:`, summaryResult.reason?.message);
        }

        // Destructure summary modules
        const p = summary.assetProfile || {};
        const s = summary.summaryDetail || {};
        const d = summary.defaultKeyStatistics || {};
        const f = summary.financialData || {};
        const e = summary.earnings || {};

        // === SMART CALCULATIONS FOR MISSING DATA ===
        const price = q.regularMarketPrice || getVal(s, 'previousClose') || 0;
        const mktCap = q.marketCap || getVal(s, 'marketCap') || 0;
        const pe = q.trailingPE || getVal(s, 'trailingPE') || 0;

        // Calculate Shares Outstanding if missing
        let shares = getVal(d, 'sharesOutstanding');
        if (!shares && price > 0 && mktCap > 0) {
            shares = Math.round(mktCap / price);
        }

        // Calculate EPS if missing
        let eps = q.epsTrailingTwelveMonths || getVal(d, 'trailingEps');
        if (!eps && price > 0 && pe > 0) {
            eps = price / pe;
        }

        // Calculate Revenue if missing (using P/S ratio)
        let revenue = getVal(f, 'totalRevenue');
        const psRatio = getVal(s, 'priceToSalesTrailing12Months');
        if (!revenue && psRatio && mktCap > 0) {
            revenue = mktCap / psRatio;
        }

        // Calculate Dividend info
        let divYield = q.trailingAnnualDividendYield || getVal(s, 'dividendYield');
        let divRate = q.trailingAnnualDividendRate || getVal(s, 'trailingAnnualDividendRate');
        if (!divRate && divYield && price > 0) {
            divRate = price * divYield;
        }
        if (!divYield && divRate && price > 0) {
            divYield = divRate / price;
        }

        // Calculate Price to Book
        let priceToBook = q.priceToBook || getVal(d, 'priceToBook');
        const bookValue = q.bookValue || getVal(d, 'bookValue');
        if (!priceToBook && price > 0 && bookValue > 0) {
            priceToBook = price / bookValue;
        }

        // Calculate Enterprise Value
        let enterpriseValue = getVal(d, 'enterpriseValue');
        const totalDebt = getVal(f, 'totalDebt');
        const totalCash = getVal(f, 'totalCash');
        if (!enterpriseValue && mktCap > 0) {
            enterpriseValue = mktCap + (totalDebt || 0) - (totalCash || 0);
        }

        // === BUILD COMPLETE PROFILE OBJECT ===
        const profile = {
            // Basic Info
            symbol: symbol,
            name: q.longName || q.shortName || p.longName || symbol,
            description: p.longBusinessSummary || 'No company description available.',
            sector: p.sector || q.sector || 'N/A',
            industry: p.industry || q.industry || 'N/A',
            employees: p.fullTimeEmployees || null,
            website: p.website || null,
            city: p.city || null,
            country: p.country || null,
            currency: q.currency || f.financialCurrency || 'USD',
            exchange: q.exchange || 'Unknown',

            // === PRICE & TRADING (Overview Tab - Trading Information) ===
            price: q.regularMarketPrice || 0,
            change: q.regularMarketChange || 0,
            changePercent: q.regularMarketChangePercent || 0,
            open: q.regularMarketOpen || getVal(s, 'open') || null,
            high: q.regularMarketDayHigh || getVal(s, 'dayHigh') || null,
            low: q.regularMarketDayLow || getVal(s, 'dayLow') || null,
            prevClose: q.regularMarketPreviousClose || getVal(s, 'previousClose') || null,
            volume: q.regularMarketVolume || getVal(s, 'volume') || null,
            averageVolume: q.averageDailyVolume10Day || q.averageDailyVolume3Month || getVal(s, 'averageVolume') || null,

            // === 52-WEEK RANGE (Overview Tab) ===
            fiftyTwoWeekHigh: q.fiftyTwoWeekHigh || getVal(s, 'fiftyTwoWeekHigh') || null,
            fiftyTwoWeekLow: q.fiftyTwoWeekLow || getVal(s, 'fiftyTwoWeekLow') || null,
            fiftyDayAverage: q.fiftyDayAverage || getVal(s, 'fiftyDayAverage') || null,
            twoHundredDayAverage: q.twoHundredDayAverage || getVal(s, 'twoHundredDayAverage') || null,
            fiftyTwoWeekChange: q.fiftyTwoWeekChange || getVal(d, '52WeekChange') || null,
            beta: getVal(d, 'beta') || q.beta || null,

            // === KEY STATISTICS (Overview Tab) ===
            marketCap: mktCap || null,
            trailingPE: pe || null,
            forwardPE: q.forwardPE || getVal(d, 'forwardPE') || null,
            trailingEps: eps || null,
            forwardEps: q.epsForward || getVal(d, 'forwardEps') || null,

            // Dividend (Overview & Valuation)
            dividendYield: divYield || null,
            trailingAnnualDividendYield: divYield || null,
            trailingAnnualDividendRate: divRate || null,

            // === OWNERSHIP STRUCTURE (Overview Tab) ===
            sharesOutstanding: shares || null,
            floatShares: getVal(d, 'floatShares') || null,
            sharesShort: getVal(d, 'sharesShort') || null,
            shortRatio: getVal(d, 'shortRatio') || null,
            shortPercentOfFloat: getVal(d, 'shortPercentOfFloat') || null,

            // === FINANCIALS TAB - Revenue & Profitability ===
            totalRevenue: revenue || null,
            revenuePerShare: getVal(f, 'revenuePerShare') || null,
            revenueGrowth: getVal(f, 'revenueGrowth') || null,
            grossProfits: getVal(f, 'grossProfits') || null,
            ebitda: getVal(f, 'ebitda') || null,
            netIncomeToCommon: getVal(f, 'netIncomeToCommon') || getVal(d, 'netIncomeToCommon') || null,

            // === FINANCIALS TAB - Margins ===
            profitMargins: getVal(f, 'profitMargins') || null,
            grossMargins: getVal(f, 'grossMargins') || null,
            operatingMargins: getVal(f, 'operatingMargins') || null,
            ebitdaMargins: getVal(f, 'ebitdaMargins') || null,

            // === FINANCIALS TAB - Cash Flow ===
            operatingCashflow: getVal(f, 'operatingCashflow') || null,
            freeCashflow: getVal(f, 'freeCashflow') || null,
            totalCash: totalCash || null,
            totalCashPerShare: getVal(f, 'totalCashPerShare') || null,

            // === FINANCIALS TAB - Balance Sheet ===
            totalDebt: totalDebt || null,
            debtToEquity: getVal(f, 'debtToEquity') || null,
            bookValue: bookValue || null,
            currentRatio: getVal(f, 'currentRatio') || null,
            quickRatio: getVal(f, 'quickRatio') || null,

            // === VALUATION TAB ===
            enterpriseValue: enterpriseValue || null,
            enterpriseToRevenue: getVal(d, 'enterpriseToRevenue') || null,
            enterpriseToEbitda: getVal(d, 'enterpriseToEbitda') || null,
            priceToBook: priceToBook || null,
            priceToSalesTrailing12Months: psRatio || null,
            pegRatio: getVal(d, 'pegRatio') || null,

            // === VALUATION TAB - Earnings & Returns ===
            earningsGrowth: getVal(f, 'earningsGrowth') || null,
            earningsQuarterlyGrowth: getVal(d, 'earningsQuarterlyGrowth') || null,
            returnOnEquity: getVal(f, 'returnOnEquity') || null,
            returnOnAssets: getVal(f, 'returnOnAssets') || null,

            // === VALUATION TAB - Dividends ===
            payoutRatio: getVal(s, 'payoutRatio') || getVal(d, 'payoutRatio') || null,
            exDividendDate: q.exDividendDate || getVal(s, 'exDividendDate') || null,
            lastDividendValue: getVal(d, 'lastDividendValue') || null,
            lastDividendDate: getVal(d, 'lastDividendDate') || null,

            // === ANALYSTS TAB ===
            targetMeanPrice: getVal(f, 'targetMeanPrice') || null,
            targetHighPrice: getVal(f, 'targetHighPrice') || null,
            targetLowPrice: getVal(f, 'targetLowPrice') || null,
            targetMedianPrice: getVal(f, 'targetMedianPrice') || null,
            recommendationKey: f.recommendationKey || null,
            recommendationMean: getVal(f, 'recommendationMean') || null,
            numberOfAnalystOpinions: getVal(f, 'numberOfAnalystOpinions') || null,
        };

        // Cache the result
        cache.set(symbol, { data: profile, ts: Date.now() });

        res.status(200).json(profile);

    } catch (e) {
        console.error(`Stock Profile API Error for ${symbol}:`, e);
        // Return minimal data rather than error
        res.status(200).json({
            symbol,
            name: symbol,
            description: 'Data temporarily unavailable.',
            sector: 'N/A',
            price: 0
        });
    }
}
