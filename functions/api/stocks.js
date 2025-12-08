// Cloudflare Pages Function - Enterprise-Grade Stocks API
// HIGH PERFORMANCE: 5-second cache, real-time data, institutional-grade

const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// In-memory cache for blazing fast responses
let stocksCache = {
    SA: { data: null, timestamp: 0 },
    EG: { data: null, timestamp: 0 },
    Global: { data: null, timestamp: 0 },
    all: { data: null, timestamp: 0 }
};

// ENTERPRISE CONFIG: Fast cache TTL for near real-time data
const CACHE_TTL = {
    SA: 5000,      // 5 seconds for Saudi stocks (market hours)
    EG: 5000,      // 5 seconds for Egypt stocks
    Global: 5000,  // 5 seconds for US stocks
    default: 10000 // 10 seconds default
};

// Helper: Create JSON response with optimized headers
const jsonResponse = (data, status = 200, cacheSeconds = 5) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            // Edge caching: short TTL for real-time feel
            'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=2`,
            // Performance headers
            'X-Response-Time': `${Date.now()}`,
            'X-Cache-Status': 'DYNAMIC'
        }
    });
};

// Fallback stock data (always have something to show)
const FALLBACK_STOCKS = {
    SA: [
        { symbol: '2222.SR', name: 'Saudi Aramco', category: 'SA', country: '🇸🇦', sector: 'Energy', price: 32.45, change: 0.25, changePercent: 0.78, volume: 12500000 },
        { symbol: '1120.SR', name: 'Al Rajhi Bank', category: 'SA', country: '🇸🇦', sector: 'Financial', price: 98.30, change: 1.10, changePercent: 1.13, volume: 8200000 },
        { symbol: '2010.SR', name: 'SABIC', category: 'SA', country: '🇸🇦', sector: 'Materials', price: 73.60, change: -0.40, changePercent: -0.54, volume: 3500000 },
        { symbol: '7010.SR', name: 'STC', category: 'SA', country: '🇸🇦', sector: 'Telecom', price: 45.20, change: 0.15, changePercent: 0.33, volume: 4100000 },
        { symbol: '2082.SR', name: 'ACWA Power', category: 'SA', country: '🇸🇦', sector: 'Utilities', price: 180.00, change: 2.00, changePercent: 1.12, volume: 1200000 },
        { symbol: '1180.SR', name: 'SNB', category: 'SA', country: '🇸🇦', sector: 'Financial', price: 44.85, change: 0.35, changePercent: 0.79, volume: 5600000 }
    ],
    EG: [
        { symbol: 'COMI.CA', name: 'CIB Bank', category: 'EG', country: '🇪🇬', sector: 'Financial', price: 82.50, change: 1.20, changePercent: 1.48, volume: 2100000 },
        { symbol: 'HRHO.CA', name: 'EFG Hermes', category: 'EG', country: '🇪🇬', sector: 'Financial', price: 28.75, change: -0.25, changePercent: -0.86, volume: 1500000 }
    ],
    Global: [
        { symbol: 'AAPL', name: 'Apple', category: 'Global', country: '🇺🇸', sector: 'Technology', price: 195.50, change: 2.30, changePercent: 1.19, volume: 45000000 },
        { symbol: 'MSFT', name: 'Microsoft', category: 'Global', country: '🇺🇸', sector: 'Technology', price: 378.90, change: 4.10, changePercent: 1.09, volume: 22000000 },
        { symbol: 'NVDA', name: 'Nvidia', category: 'Global', country: '🇺🇸', sector: 'Technology', price: 485.20, change: 8.50, changePercent: 1.78, volume: 38000000 }
    ]
};

// Check market hours for smart refresh
function isMarketOpen(market) {
    const now = new Date();
    const hour = now.getUTCHours();
    const day = now.getUTCDay();

    // Weekend check
    if (day === 0 || day === 6) {
        if (market === 'SA') return false; // Friday-Saturday weekend for Saudi
    }
    if (day === 5 || day === 6) {
        if (market !== 'SA') return false; // Friday-Saturday for others
    }

    // Market hours (UTC)
    if (market === 'SA') return hour >= 7 && hour < 12;  // 10 AM - 3 PM AST
    if (market === 'EG') return hour >= 8 && hour < 12;  // 10 AM - 2:30 PM EET
    if (market === 'Global') return hour >= 14 && hour < 21; // 9:30 AM - 4 PM EST

    return true;
}

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;
    const startTime = Date.now();

    // Handle CORS preflight
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
    const market = url.searchParams.get('market') || '';
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const cacheKey = market || 'all';

    // Check in-memory cache (ultra-fast)
    const cached = stocksCache[cacheKey];
    const ttl = CACHE_TTL[market] || CACHE_TTL.default;
    const marketOpen = isMarketOpen(market);

    // Use longer TTL when market is closed
    const effectiveTtl = marketOpen ? ttl : ttl * 6;

    if (!forceRefresh && cached && cached.data && (Date.now() - cached.timestamp) < effectiveTtl) {
        const response = jsonResponse(cached.data, 200, Math.floor(effectiveTtl / 1000));
        return new Response(response.body, {
            status: 200,
            headers: {
                ...Object.fromEntries(response.headers),
                'X-Cache-Status': 'HIT',
                'X-Cache-Age': `${Date.now() - cached.timestamp}ms`,
                'X-Market-Open': marketOpen ? 'true' : 'false',
                'X-Response-Time': `${Date.now() - startTime}ms`
            }
        });
    }

    try {
        // Fetch from Vercel (has Yahoo Finance access)
        console.log(`📊 Fetching ${market || 'all'} stocks from Vercel...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/stocks${market ? `?market=${market}` : ''}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Enterprise-Proxy' },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                // Update cache
                stocksCache[cacheKey] = { data, timestamp: Date.now() };

                console.log(`✅ Got ${data.length} stocks in ${Date.now() - startTime}ms`);

                const res = jsonResponse(data, 200, Math.floor(effectiveTtl / 1000));
                return new Response(res.body, {
                    status: 200,
                    headers: {
                        ...Object.fromEntries(res.headers),
                        'X-Cache-Status': 'MISS',
                        'X-Stocks-Count': data.length.toString(),
                        'X-Market-Open': marketOpen ? 'true' : 'false',
                        'X-Response-Time': `${Date.now() - startTime}ms`
                    }
                });
            }
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }

    // Fallback to demo data
    let fallbackData = [];
    if (market === 'SA') fallbackData = FALLBACK_STOCKS.SA;
    else if (market === 'EG') fallbackData = FALLBACK_STOCKS.EG;
    else if (market === 'Global') fallbackData = FALLBACK_STOCKS.Global;
    else fallbackData = [...FALLBACK_STOCKS.SA, ...FALLBACK_STOCKS.EG, ...FALLBACK_STOCKS.Global];

    // Add timestamps
    const now = new Date().toISOString();
    fallbackData = fallbackData.map(s => ({
        ...s,
        regularMarketPrice: s.price,
        regularMarketChange: s.change,
        regularMarketChangePercent: s.changePercent,
        lastUpdated: now
    }));

    return new Response(JSON.stringify(fallbackData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=30',
            'X-Cache-Status': 'FALLBACK',
            'X-Response-Time': `${Date.now() - startTime}ms`
        }
    });
}
