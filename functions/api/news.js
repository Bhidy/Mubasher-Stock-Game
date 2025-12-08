// Cloudflare Pages Function - News API
// Hybrid approach: Proxy to Vercel for comprehensive news scraping

const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// Helper: Create JSON response
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
        }
    });
};

// Fallback news data
const FALLBACK_NEWS = {
    SA: [
        { title: 'Saudi Aramco Reports Strong Q3 Earnings', publisher: 'Argaam', time: new Date().toISOString(), link: '#' },
        { title: 'TASI Index Reaches New Highs Amid Oil Rally', publisher: 'Mubasher', time: new Date().toISOString(), link: '#' },
        { title: 'Al Rajhi Bank Announces Dividend Distribution', publisher: 'CNBC Arabia', time: new Date().toISOString(), link: '#' }
    ],
    EG: [
        { title: 'EGX 30 Shows Positive Movement', publisher: 'Enterprise', time: new Date().toISOString(), link: '#' },
        { title: 'CIB Reports Record Quarterly Profits', publisher: 'Amwal Al Ghad', time: new Date().toISOString(), link: '#' }
    ],
    US: [
        { title: 'Wall Street Closes Higher on Fed News', publisher: 'Reuters', time: new Date().toISOString(), link: '#' },
        { title: 'Tech Stocks Rally Led by Nvidia', publisher: 'Bloomberg', time: new Date().toISOString(), link: '#' }
    ]
};

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;

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

    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'SA';

    try {
        // Proxy to Vercel
        console.log(`📰 Fetching news for ${market} via Vercel proxy...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/news?market=${market}`;

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
        });

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log(`✅ Got ${data.length} news articles from Vercel`);
                return jsonResponse(data);
            }
        }
    } catch (error) {
        console.error('Vercel proxy error:', error.message);
    }

    // Fallback
    console.log(`⚠️ Using fallback news for ${market}`);
    return jsonResponse(FALLBACK_NEWS[market] || FALLBACK_NEWS.SA);
}
