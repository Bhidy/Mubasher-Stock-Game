// Cloudflare Pages Function - Direct Stock Profile
import yahooFinance from 'yahoo-finance2';

// Version: CF-DIRECT-PROFILE-1.1 - Safety Fix
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) return new Response(JSON.stringify({ error: 'Symbol required' }), { status: 400 });

    try {
        // Init config safely inside handler
        try {
            yahooFinance.setGlobalConfig({
                reqOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
                    }
                }
            });
            if (typeof yahooFinance.suppressNotices === 'function') yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        } catch (confErr) {
            console.log("Config Warning:", confErr);
        }

        // Fetch comprehensive data
        // Fetch comprehensive data with validation disabled for performance
        // This avoids the Cloudflare 1101 CPU limit
        const modules = [
            'price',
            'summaryDetail',
            'summaryProfile',
            'financialData',
            'defaultKeyStatistics',
            'earnings'
        ];

        const [quoteSummary, quote] = await Promise.all([
            yahooFinance.quoteSummary(symbol, { modules, validateResult: false }).catch(e => {
                console.error("QuoteSummary Error:", e.name, e.message);
                return null;
            }),
            yahooFinance.quote(symbol, { validateResult: false }).catch(e => null)
        ]);

        if (!quoteSummary && !quote) {
            return new Response(JSON.stringify({ error: 'Stock not found', symbol }), { status: 404 });
        }

        // Extract and map data with fallbacks
        const price = quoteSummary?.price || {};
        const summaryDetail = quoteSummary?.summaryDetail || {};
        const summaryProfile = quoteSummary?.summaryProfile || {};
        const financialData = quoteSummary?.financialData || {};
        const keyStats = quoteSummary?.defaultKeyStatistics || {};
        const earnings = quoteSummary?.earnings || {};

        const stockData = {
            symbol,
            shortName: quote?.shortName || price?.shortName || symbol,
            longName: quote?.longName || price?.longName || symbol,
            exchange: quote?.exchange || price?.exchange || 'Unknown',
            currency: quote?.currency || price?.currency || 'SAR',
            price: quote?.regularMarketPrice || price?.regularMarketPrice || 0,
            change: quote?.regularMarketChange || price?.regularMarketChange || 0,
            changePercent: quote?.regularMarketChangePercent || price?.regularMarketChangePercent || 0,
            prevClose: quote?.regularMarketPreviousClose || summaryDetail?.previousClose || 0,
            open: quote?.regularMarketOpen || summaryDetail?.open || 0,
            high: quote?.regularMarketDayHigh || summaryDetail?.dayHigh || 0,
            low: quote?.regularMarketDayLow || summaryDetail?.dayLow || 0,
            volume: quote?.regularMarketVolume || summaryDetail?.volume || 0,
            marketCap: quote?.marketCap || summaryDetail?.marketCap || 0,

            // Profile Data (Restored)
            description: summaryProfile?.longBusinessSummary || 'No description available for this market.',
            sector: summaryProfile?.sector || 'N/A',
            industry: summaryProfile?.industry || 'N/A',
            website: summaryProfile?.website || '',
            employees: summaryProfile?.fullTimeEmployees || 0,
            city: summaryProfile?.city || null,
            country: summaryProfile?.country || null,

            // Key Statistics & Ratios (Restored)
            peRatio: summaryDetail?.trailingPE || keyStats?.trailingPE || 0,
            forwardPE: summaryDetail?.forwardPE || keyStats?.forwardPE || 0,
            dividendYield: summaryDetail?.trailingAnnualDividendYield || 0,
            dividendRate: summaryDetail?.trailingAnnualDividendRate || 0,
            fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh || quote?.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow || quote?.fiftyTwoWeekLow || 0,
            beta: summaryDetail?.beta || keyStats?.beta || 0,
            trailingEps: keyStats?.trailingEps || 0,
            forwardEps: keyStats?.forwardEps || 0,
            bookValue: keyStats?.bookValue || 0,
            priceToBook: keyStats?.priceToBook || 0,

            // Financial Data (Restored)
            totalRevenue: financialData?.totalRevenue || 0,
            revenueGrowth: financialData?.revenueGrowth || 0,
            grossProfits: financialData?.grossProfits || 0,
            ebitda: financialData?.ebitda || 0,
            netIncomeToCommon: keyStats?.netIncomeToCommon || 0,
            operatingMargins: financialData?.operatingMargins || 0,
            grossMargins: financialData?.grossMargins || 0,
            profitMargins: financialData?.profitMargins || 0,
            totalCash: financialData?.totalCash || 0,
            totalDebt: financialData?.totalDebt || 0,

            // Earnings (Restored)
            earnings: earnings,

            lastUpdated: new Date().toISOString()
        };

        return new Response(JSON.stringify(stockData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60'
            }
        });

    } catch (error) {
        console.error('CF Profile Error:', error);
        return new Response(JSON.stringify({
            symbol,
            error: 'Failed to fetch data',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
