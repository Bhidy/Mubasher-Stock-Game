// Cloudflare Pages Function - News Content Proxy
// Proxies requests to Vercel backend

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const articleUrl = url.searchParams.get('url');
    const title = url.searchParams.get('title') || '';

    if (!articleUrl) {
        return new Response(JSON.stringify({ error: 'URL required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const vercelUrl = `https://bhidy.vercel.app/api/content?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}`;

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
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('Content Proxy Error:', error);
        return new Response(JSON.stringify({
            content: '<p>Unable to load content.</p>'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
