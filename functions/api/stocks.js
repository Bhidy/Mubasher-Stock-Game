// Cloudflare Pages Function - Proxy to Vercel
// Moving execution to Vercel to avoid CF IP Blocks from Yahoo Finance
// and to centralize robust data fetching logic.

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'US';

    // Target Robust Backend (Hetzner) - Port 80 (HTTP)
    const BACKEND_API_URL = context.env.BACKEND_URL || 'http://stock-hero-backend.hetzner.app/api/stocks';

    try {
        console.log(`[Proxy] Forwarding ${market} request to Backend...`);

        const response = await fetch(`${BACKEND_API_URL}?market=${encodeURIComponent(market)}`, {
            headers: {
                'User-Agent': 'Cloudflare-Worker-Proxy/1.0',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Upstream Error: ${response.status} - ${errorText}`);
            return new Response(JSON.stringify({ error: `Upstream/Vercel Error: ${response.status}` }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();

        // Pass through the response with correct headers
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
            }
        });

    } catch (error) {
        console.error('[Proxy] Check failed:', error);
        return new Response(JSON.stringify({ error: error.message, location: 'Cloudflare Proxy' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
