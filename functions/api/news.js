// Cloudflare Pages Function - Enterprise News API
// HIGH PERFORMANCE: 2-minute cache, real-time scraping via Vercel

const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// In-memory cache
const newsCache = {
    SA: { data: null, timestamp: 0 },
    EG: { data: null, timestamp: 0 },
    US: { data: null, timestamp: 0 }
};

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes for fresh news

// Helper: Create JSON response
const jsonResponse = (data, status = 200, cacheSeconds = 60) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=30`,
            'X-Response-Time': `${Date.now()}`
        }
    });
};

// Fallback news data
const FALLBACK_NEWS = {
    SA: [
        { title: 'Saudi Aramco Reports Strong Q3 Earnings', publisher: 'Argaam', time: new Date().toISOString(), link: '#', content: 'Saudi Aramco reported better than expected quarterly results...' },
        { title: 'TASI Index Reaches New Highs Amid Oil Rally', publisher: 'Mubasher', time: new Date().toISOString(), link: '#', content: 'The Saudi stock market continues its upward trajectory...' },
        { title: 'Al Rajhi Bank Announces Dividend Distribution', publisher: 'CNBC Arabia', time: new Date().toISOString(), link: '#', content: 'Al Rajhi Bank declared quarterly dividends for shareholders...' },
        { title: 'Vision 2030 Projects Accelerate Investment Flow', publisher: 'Saudi Gazette', time: new Date().toISOString(), link: '#', content: 'Government initiatives continue to attract foreign investment...' }
    ],
    EG: [
        { title: 'EGX 30 Shows Positive Movement', publisher: 'Enterprise', time: new Date().toISOString(), link: '#', content: 'Egyptian market shows resilience amid regional tensions...' },
        { title: 'CIB Reports Record Quarterly Profits', publisher: 'Amwal Al Ghad', time: new Date().toISOString(), link: '#', content: 'Commercial International Bank posted strong results...' }
    ],
    US: [
        { title: 'Wall Street Closes Higher on Fed News', publisher: 'Reuters', time: new Date().toISOString(), link: '#', content: 'US markets rallied after Federal Reserve comments...' },
        { title: 'Tech Stocks Rally Led by Nvidia', publisher: 'Bloomberg', time: new Date().toISOString(), link: '#', content: 'Technology sector continues to outperform...' }
    ]
};

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;
    const startTime = Date.now();

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'SA';
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    // Check cache
    const cached = newsCache[market];
    if (!forceRefresh && cached && cached.data && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return new Response(JSON.stringify(cached.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, s-maxage=60',
                'X-Cache-Status': 'HIT',
                'X-Cache-Age': `${Date.now() - cached.timestamp}ms`,
                'X-Response-Time': `${Date.now() - startTime}ms`
            }
        });
    }

    try {
        // Fetch from Vercel
        console.log(`📰 Fetching ${market} news from Vercel...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/news?market=${market}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Enterprise-Proxy' },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                newsCache[market] = { data, timestamp: Date.now() };

                console.log(`✅ Got ${data.length} news articles in ${Date.now() - startTime}ms`);

                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'public, s-maxage=60',
                        'X-Cache-Status': 'MISS',
                        'X-News-Count': data.length.toString(),
                        'X-Response-Time': `${Date.now() - startTime}ms`
                    }
                });
            }
        }
    } catch (error) {
        console.error('News fetch error:', error.message);
    }

    // Fallback
    console.log(`⚠️ Using fallback news for ${market}`);
    return new Response(JSON.stringify(FALLBACK_NEWS[market] || FALLBACK_NEWS.SA), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=120',
            'X-Cache-Status': 'FALLBACK',
            'X-Response-Time': `${Date.now() - startTime}ms`
        }
    });
}
