const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');

const PROFILE_FILE = path.join(__dirname, '../data/stock_profiles.json');

const SAUDI_STOCKS = [
    '2222.SR', // Saudi Aramco
    '1120.SR', // Al Rajhi Bank
    '2010.SR', // SABIC
    '7010.SR', // STC
    '2082.SR'  // ACWA Power
];

let profileCache = {};

async function updateStockProfiles(specificSymbols = null) {
    console.log('📚 Fetching deep stock profiles (Fundamentals, Description)...');

    // Load existing profiles to get symbols if not provided
    let symbolsToUpdate = specificSymbols;
    if (!symbolsToUpdate) {
        // If not provided, we should ideally get these from the master stock list
        // For now, we'll default to the known SA list BUT allow external calls to pass any list (US/EG)
        symbolsToUpdate = SAUDI_STOCKS;
    }

    const updates = {};
    const existingData = getStockProfiles();

    // Merge existing
    Object.assign(updates, existingData);

    for (const symbol of symbolsToUpdate) {
        try {
            // Fetch rich data modules - ALL AVAILABLE MODULES
            const result = await yahooFinance.quoteSummary(symbol, {
                modules: [
                    'summaryProfile',
                    'summaryDetail',
                    'financialData',
                    'defaultKeyStatistics',
                    'price',
                    'earnings',
                    'earningsHistory',
                    'recommendationTrend'
                ]
            });

            if (!result) continue;

            const profile = result.summaryProfile || {};
            const detail = result.summaryDetail || {};
            const financial = result.financialData || {};
            const stats = result.defaultKeyStatistics || {};
            const price = result.price || {};
            const earnings = result.earnings || {};
            const recommendationTrend = result.recommendationTrend || {};

            // Generate Logo URL from website domain
            const MANUAL_DOMAINS = {
                'COMI.CA': 'cibeg.com',
                'HRHO.CA': 'efghermes.com',
                'ORAS.CA': 'orascom.com',
                'ETEL.CA': 'te.eg',
                'EAST.CA': 'easterneompany.com',
                'TMGH.CA': 'talaatmoustafa.com',
                'SWDY.CA': 'elsewedyelectric.com',
                'EGX': 'egx.com.eg',
                '2222.SR': 'aramco.com',
                '1120.SR': 'alrajhibank.com.sa',
                '2010.SR': 'sabic.com',
                '7010.SR': 'stc.com.sa',
                '2082.SR': 'acwapower.com'
            };

            let logoUrl = null;
            let website = profile.website || MANUAL_DOMAINS[symbol];

            if (website) {
                try {
                    let domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname.replace('www.', '');

                    // Robust Logo Strategy:
                    // 1. Google High-Res Favicon (Most reliable for international)
                    // 2. Clearbit (Good for US/Major)
                    // 3. Fallback to placeholder handled by frontend

                    // Construct Google URL
                    logoUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;

                } catch (e) { /* ignore invalid url */ }
            }

            updates[symbol] = {
                // Logo
                logo: logoUrl || null,

                // F. Static Business Profile
                sector: profile.sector || 'N/A',
                industry: profile.industry || 'N/A',
                country: profile.country || 'Saudi Arabia',
                description: profile.longBusinessSummary || 'No description available.',
                website: profile.website || 'N/A',

                // E. Fundamentals - Valuation
                marketCap: price.marketCap || detail.marketCap || 'N/A',
                enterpriseValue: stats.enterpriseValue || 'N/A',
                trailingPE: detail.trailingPE || 'N/A',
                forwardPE: stats.forwardPE || detail.forwardPE || 'N/A',
                priceToBook: stats.priceToBook || 'N/A',
                priceToSalesTrailing12Months: stats.priceToSalesTrailing12Months || 'N/A',
                enterpriseToRevenue: stats.enterpriseToRevenue || 'N/A',
                enterpriseToEbitda: stats.enterpriseToEbitda || 'N/A',

                // Earnings
                eps: stats.trailingEps || 'N/A',
                trailingEps: stats.trailingEps || 'N/A',
                forwardEps: stats.forwardEps || 'N/A',
                earningsGrowth: financial.earningsGrowth || 'N/A',
                earningsQuarterlyGrowth: stats.earningsQuarterlyGrowth || 'N/A',

                // Dividends
                dividendRate: detail.dividendRate || stats.trailingAnnualDividendRate || 'N/A',
                dividendYield: detail.dividendYield || stats.trailingAnnualDividendYield || 'N/A',
                trailingAnnualDividendRate: stats.trailingAnnualDividendRate || 'N/A',
                trailingAnnualDividendYield: stats.trailingAnnualDividendYield || 'N/A',
                payoutRatio: detail.payoutRatio || stats.payoutRatio || 'N/A',
                lastDividendValue: stats.lastDividendValue || 'N/A',
                lastDividendDate: stats.lastDividendDate || 'N/A',

                // D. 52-Week & Trend Stats
                fiftyDayAverage: detail.fiftyDayAverage || 'N/A',
                twoHundredDayAverage: detail.twoHundredDayAverage || 'N/A',
                fiftyTwoWeekHigh: detail.fiftyTwoWeekHigh || 'N/A',
                fiftyTwoWeekLow: detail.fiftyTwoWeekLow || 'N/A',
                fiftyTwoWeekChange: stats['52WeekChange'] || 'N/A',
                allTimeHigh: detail.allTimeHigh || 'N/A',
                allTimeLow: detail.allTimeLow || 'N/A',

                // C. Today's Trading (Static parts)
                averageVolume: detail.averageVolume || 'N/A',
                averageDailyVolume10Day: detail.averageDailyVolume10Day || price.averageDailyVolume10Day || 'N/A',
                averageDailyVolume3Month: detail.averageDailyVolume3Month || price.averageDailyVolume3Month || 'N/A',
                bid: detail.bid || 'N/A',
                ask: detail.ask || 'N/A',

                // Financial Data - Revenue & Profitability
                totalRevenue: financial.totalRevenue || 'N/A',
                revenuePerShare: financial.revenuePerShare || 'N/A',
                revenueGrowth: financial.revenueGrowth || 'N/A',
                grossProfits: financial.grossProfits || 'N/A',
                ebitda: financial.ebitda || 'N/A',
                netIncomeToCommon: stats.netIncomeToCommon || 'N/A',

                // Margins
                profitMargins: financial.profitMargins || 'N/A',
                grossMargins: financial.grossMargins || 'N/A',
                operatingMargins: financial.operatingMargins || 'N/A',
                ebitdaMargins: financial.ebitdaMargins || 'N/A',

                // Returns
                returnOnAssets: financial.returnOnAssets || 'N/A',
                returnOnEquity: financial.returnOnEquity || 'N/A',

                // Cash Flow
                operatingCashflow: financial.operatingCashflow || 'N/A',
                freeCashflow: financial.freeCashflow || 'N/A',
                totalCash: financial.totalCash || 'N/A',
                totalCashPerShare: financial.totalCashPerShare || 'N/A',

                // Balance Sheet
                totalDebt: financial.totalDebt || 'N/A',
                debtToEquity: financial.debtToEquity || 'N/A',
                currentRatio: financial.currentRatio || 'N/A',
                quickRatio: financial.quickRatio || 'N/A',
                bookValue: stats.bookValue || 'N/A',

                // Share Statistics
                sharesOutstanding: stats.sharesOutstanding || 'N/A',
                floatShares: stats.floatShares || 'N/A',
                heldPercentInsiders: stats.heldPercentInsiders || 'N/A',
                heldPercentInstitutions: stats.heldPercentInstitutions || 'N/A',
                beta: stats.beta || 'N/A',

                // Analyst Data
                recommendationKey: financial.recommendationKey || 'N/A',
                recommendationMean: financial.recommendationMean || 'N/A',
                numberOfAnalystOpinions: financial.numberOfAnalystOpinions || 'N/A',
                targetMeanPrice: financial.targetMeanPrice || 'N/A',
                targetMedianPrice: financial.targetMedianPrice || 'N/A',
                targetHighPrice: financial.targetHighPrice || 'N/A',
                targetLowPrice: financial.targetLowPrice || 'N/A',
                currentPrice: financial.currentPrice || 'N/A',

                // Earnings Data
                earningsChart: earnings.earningsChart || null,
                financialsChart: earnings.financialsChart || null,

                // Recommendation Trend
                recommendationTrend: recommendationTrend.trend || null,

                // A. Basic Info
                exchange: price.exchangeName || 'N/A',
                currency: price.currency || 'SAR',
                shortName: price.shortName || price.longName,
                longName: price.longName || price.shortName
            };

            console.log(`✅ Loaded profile for ${symbol} (Logo: ${logoUrl ? 'Yes' : 'No'})`);

        } catch (error) {
            console.error(`❌ Failed to fetch profile for ${symbol}:`, error.message);
        }
    }

    if (Object.keys(updates).length > 0) {
        fs.writeFileSync(PROFILE_FILE, JSON.stringify(updates, null, 2));
    }

    return updates;
}

function getStockProfiles() {
    if (Object.keys(profileCache).length > 0) return profileCache;
    if (fs.existsSync(PROFILE_FILE)) {
        try {
            profileCache = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
            return profileCache;
        } catch (e) { return {}; }
    }
    return {};
}

module.exports = { updateStockProfiles, getStockProfiles };
