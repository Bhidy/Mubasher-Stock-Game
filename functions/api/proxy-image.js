// Cloudflare Pages Function - Proxy Image API
// Proxies images to avoid CORS issues

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    if (!imageUrl) {
        return new Response(JSON.stringify({ error: 'URL parameter required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*'
            }
        });

        if (!response.ok) {
            // Return a placeholder on error
            return Response.redirect('https://via.placeholder.com/128?text=No+Image', 302);
        }

        const contentType = response.headers.get('content-type') || 'image/png';
        const imageData = await response.arrayBuffer();

        return new Response(imageData, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Image proxy error:', error.message);
        return Response.redirect('https://via.placeholder.com/128?text=Error', 302);
    }
}
