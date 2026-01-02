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

        // Fetch basic data only (quoteSummary causes 1101 CPU limit/crash on Workers)
        const quote = await yahooFinance.quote(symbol).catch(e => null);

        if (!quote) {
            return new Response(JSON.stringify({ error: 'Stock not found', symbol }), { status: 404 });
        }

        // Extract and map data (Simplified from quote only)
        // Note: quote() contains price, volume, marketCap, and basic ranges

        const stockData = {
            symbol,
            shortName: quote.shortName || quote.longName || symbol,
            longName: quote.longName || quote.shortName || symbol,
            exchange: quote.exchange || 'Unknown',
            currency: quote.currency || 'SAR',
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            prevClose: quote.regularMarketPreviousClose || 0,
            open: quote.regularMarketOpen || 0,
            high: quote.regularMarketDayHigh || 0,
            low: quote.regularMarketDayLow || 0,
            volume: quote.regularMarketVolume || 0,
            marketCap: quote.marketCap || 0,
            // Fields unavailable in simple quote:
            peRatio: quote.trailingPE || 0,
            dividendYield: quote.trailingAnnualDividendYield || 0,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
            description: `Real-time data for ${symbol}. Detailed profile temporarily limited for performance.`,
            sector: 'N/A', // quote() doesn't always have sector
            industry: 'N/A',
            website: '',
            employees: 0,
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
