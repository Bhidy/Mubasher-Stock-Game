// Cloudflare Pages Function - Proxy to Vercel (Stock Profile)
// Forwarding to Vercel to handle data fetching and avoid Edge runtime issues

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    // Target Robust Backend (Hetzner)
    const BACKEND_API_URL = context.env.BACKEND_URL || 'https://stock-hero-backend.hetzner.app/api/stock-profile';

    try {
        const response = await fetch(`${BACKEND_API_URL}?symbol=${encodeURIComponent(symbol)}`, {
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
        console.error('[Proxy-Profile] Check failed:', error);
        return new Response(JSON.stringify({ error: error.message, location: 'Cloudflare Proxy' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
