// Cloudflare Pages Function - Data Lake Proxy (Legacy Yahoo Fallback)
// Version: GITHUB-LAKE-FALLBACK-V1

const PROFILE_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/profiles';

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
        return new Response(JSON.stringify({ error: 'Symbol required' }), { status: 400 });
    }

    try {
        const safeSymbol = symbol.replace('^', '');
        // Redirect to Profile Lake which has the price
        const response = await fetch(`${PROFILE_BASE_URL}/${safeSymbol}.json`, {
            headers: { 'User-Agent': 'StockHero-CF-Proxy/1.0' },
            cf: { cacheTtl: 60, cacheEverything: true }
        });

        if (!response.ok) throw new Error('Data Lake miss');
        const data = await response.json();

        return new Response(JSON.stringify({
            symbol: data.symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            currency: data.currency,
            lastUpdated: data.lastUpdated
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Data unavailable", price: 0 }), { status: 200 });
    }
}
