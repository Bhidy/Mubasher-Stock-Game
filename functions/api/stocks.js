// Cloudflare Pages Function - Data Lake Proxy (Stocks)
// Version: GITHUB-DATA-LAKE-CF-V1 (Restored)
// Sourcing from Static GitHub Assets to prevent 429 blocking

const STATIC_DATA_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/stocks.json';

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'Global';

    try {
        const response = await fetch(STATIC_DATA_URL, {
            headers: {
                'User-Agent': 'StockHero-CF-Proxy/1.0',
                'Cache-Control': 'no-cache'
            },
            cf: { cacheTtl: 60, cacheEverything: true }
        });

        if (!response.ok) {
            throw new Error(`Data Lake unreachable: ${response.status}`);
        }

        const rawData = await response.json();
        const marketData = rawData[market] || [];

        return new Response(JSON.stringify(marketData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                'X-Data-Source': 'GitHub-Data-Lake-CF'
            }
        });

    } catch (error) {
        console.error('[Stocks-CF] Error:', error.message);
        return new Response(JSON.stringify({
            error: 'Failed to retrieve market data',
            details: error.message,
            source: 'Static Data Lake'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
