// Cloudflare Pages Function - Proxy Image API
// Proxies images to avoid CORS issues

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
        return new Response('URL parameter required', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            return new Response('Failed to fetch image', { status: 502 });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
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
        return new Response('Error fetching image', { status: 500 });
    }
}
