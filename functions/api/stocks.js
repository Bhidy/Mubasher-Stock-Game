// Cloudflare Pages Function - Stocks API
// Hybrid approach: Proxy to Vercel for reliable Yahoo Finance access

// Vercel production URL (existing deployment)
const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// Helper: Create JSON response with CORS headers
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 's-maxage=15, stale-while-revalidate=10'
        }
    });
};

// Fallback stock data when all else fails
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

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;

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

    const url = new URL(request.url);
    const market = url.searchParams.get('market') || '';

    try {
        // Strategy 1: Proxy to Vercel (has reliable Yahoo Finance access)
        console.log('📊 Fetching stocks via Vercel proxy...');
        const vercelUrl = `${VERCEL_API_BASE}/api/stocks${market ? `?market=${market}` : ''}`;

        const response = await fetch(vercelUrl, {
            headers: {
                'User-Agent': 'Cloudflare-Pages-Proxy',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log(`✅ Got ${data.length} stocks from Vercel`);
                return jsonResponse(data);
            }
        }

        console.log('⚠️ Vercel proxy failed, using fallback data');
    } catch (error) {
        console.error('Vercel proxy error:', error.message);
    }

    // Strategy 2: Return fallback data
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

    return jsonResponse(fallbackData);
}
