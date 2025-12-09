// Cloudflare Pages Function - Stock Profile Proxy
// Proxies requests to Vercel backend for Yahoo Finance data

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Get symbol from query string
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
        return new Response(JSON.stringify({ error: 'Symbol required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Proxy to Vercel backend
        const vercelUrl = `https://bhidy.vercel.app/api/stock-profile?symbol=${encodeURIComponent(symbol)}`;

        const response = await fetch(vercelUrl, {
            headers: {
                'User-Agent': 'StocksHero-Cloudflare/1.0',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60'
            }
        });

    } catch (error) {
        console.error('Stock Profile Proxy Error:', error);
        return new Response(JSON.stringify({
            symbol,
            error: 'Failed to fetch data',
            description: 'Data temporarily unavailable.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
