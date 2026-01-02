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
        const modules = [
            'price', 'summaryDetail', 'summaryProfile', 'financialData',
            'defaultKeyStatistics', 'recommendationTrend'
        ];

        const [quoteSummary, quote] = await Promise.all([
            yahooFinance.quoteSummary(symbol, { modules }).catch(e => null),
            yahooFinance.quote(symbol).catch(e => null)
        ]);

        if (!quoteSummary && !quote) {
            return new Response(JSON.stringify({ error: 'Stock not found', symbol }), { status: 404 });
        }

        // Extract and map data (Simplified robust mapping)
        const price = quoteSummary?.price || {};
        const summaryDetail = quoteSummary?.summaryDetail || {};
        const summaryProfile = quoteSummary?.summaryProfile || {};
        const financialData = quoteSummary?.financialData || {};
        const keyStats = quoteSummary?.defaultKeyStatistics || {};
        const recommendation = quoteSummary?.recommendationTrend?.trend || [];

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
            // Add key stats as requested
            peRatio: summaryDetail?.trailingPE || keyStats?.trailingPE || 0,
            dividendYield: summaryDetail?.trailingAnnualDividendYield || 0,
            fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow || 0,
            description: summaryProfile?.longBusinessSummary || 'No description available.',
            sector: summaryProfile?.sector || 'Unknown',
            industry: summaryProfile?.industry || 'Unknown',
            website: summaryProfile?.website || '',
            employees: summaryProfile?.fullTimeEmployees || 0,
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
