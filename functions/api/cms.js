// Cloudflare Pages Function - CMS Proxy
// Proxies requests to Vercel backend for CMS operations

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    // Forward all query params to Vercel
    const vercelUrl = `https://bhidy.vercel.app/api/cms${url.search}`;

    try {
        const fetchOptions = {
            method: request.method,
            headers: {
                'User-Agent': 'StocksHero-Cloudflare/1.0',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        // Forward body for POST/PUT requests
        if (request.method === 'POST' || request.method === 'PUT') {
            fetchOptions.body = await request.text();
        }

        const response = await fetch(vercelUrl, fetchOptions);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });

    } catch (error) {
        console.error('CMS Proxy Error:', error);
        return new Response(JSON.stringify({ error: 'Backend unavailable', fallback: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
