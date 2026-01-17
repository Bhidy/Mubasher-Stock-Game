// Cloudflare Pages Function - Proxy to Vercel (Chart)
// Forwarding to Vercel to handle data fetching and avoid Edge runtime issues

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');
    const range = url.searchParams.get('range') || '1d';
    const interval = url.searchParams.get('interval') || '5m';

    // Target Robust Backend (Hetzner)
    const BACKEND_API_URL = context.env.BACKEND_URL || 'https://stock-hero-backend.hetzner.app/api/chart';

    try {
        const response = await fetch(`${BACKEND_API_URL}?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`, {
            headers: {
                'User-Agent': 'Cloudflare-Worker-Proxy/1.0',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.ok ? 200 : response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60'
            }
        });

    } catch (error) {
        console.error('[Proxy-Chart] Check failed:', error);
        return new Response(JSON.stringify({ error: error.message, location: 'Cloudflare Proxy' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
