// Cloudflare Pages Function - News Proxy
// Proxies requests to Vercel backend

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const market = url.searchParams.get('market') || 'SA';

    try {
        const vercelUrl = `https://bhidy.vercel.app/api/news?market=${encodeURIComponent(market)}`;

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
                'Cache-Control': 'public, max-age=300'
            }
        });

    } catch (error) {
        console.error('News Proxy Error:', error);
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
