// Cloudflare Pages Function - Stock Profile API
// Hybrid approach: Proxy to Vercel for reliable Yahoo Finance access

const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// Stock name metadata
const STOCK_NAMES = {
    '2222.SR': 'Saudi Aramco', '1120.SR': 'Al Rajhi Bank', '2010.SR': 'SABIC',
    '7010.SR': 'STC', '2082.SR': 'ACWA Power', '1180.SR': 'Saudi National Bank',
    'COMI.CA': 'CIB Bank', 'HRHO.CA': 'EFG Hermes', 'FWRY.CA': 'Fawry',
    'AAPL': 'Apple', 'MSFT': 'Microsoft', 'NVDA': 'Nvidia', 'TSLA': 'Tesla'
};

// Helper: Create JSON response
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
        }
    });
};

// Generate fallback profile
function generateFallbackProfile(symbol) {
    const isSaudi = symbol.includes('.SR');
    const isEgypt = symbol.includes('.CA');

    return {
        symbol,
        shortName: STOCK_NAMES[symbol] || symbol,
        longName: STOCK_NAMES[symbol] || symbol,
        exchange: isSaudi ? 'Tadawul' : (isEgypt ? 'EGX' : 'NASDAQ'),
        currency: isSaudi ? 'SAR' : (isEgypt ? 'EGP' : 'USD'),
        price: isSaudi ? 50 : (isEgypt ? 30 : 150),
        change: Math.random() * 2 - 1,
        changePercent: Math.random() * 2 - 1,
        marketCap: isSaudi ? 500000000000 : 50000000000,
        trailingPE: 15 + Math.random() * 10,
        sector: 'Various',
        industry: 'Various',
        description: `${STOCK_NAMES[symbol] || symbol} is a publicly traded company.`,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
    };
}

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
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
        return jsonResponse({ error: 'Symbol required' }, 400);
    }

    try {
        // Proxy to Vercel
        console.log(`📊 Fetching profile for ${symbol} via Vercel proxy...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/stock-profile?symbol=${encodeURIComponent(symbol)}`;

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.symbol) {
                console.log(`✅ Got profile from Vercel for ${symbol}`);
                return jsonResponse(data);
            }
        }
    } catch (error) {
        console.error('Vercel proxy error:', error.message);
    }

    // Fallback
    console.log(`⚠️ Using fallback profile for ${symbol}`);
    return jsonResponse(generateFallbackProfile(symbol));
}
