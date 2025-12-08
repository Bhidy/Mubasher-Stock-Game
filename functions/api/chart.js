// Cloudflare Pages Function - Chart API
// Hybrid approach: Proxy to Vercel for reliable Yahoo Finance access

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
            'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
        }
    });
};

// Generate fallback chart data
function generateFallbackChart(symbol, range) {
    const points = range === '1D' ? 30 : 50;
    const basePrice = symbol.includes('.SR') ? 50 : (symbol.includes('.CA') ? 30 : 150);
    const quotes = [];
    const now = Date.now();
    const intervalMs = range === '1D' ? 30 * 60 * 1000 : 4 * 60 * 60 * 1000;

    for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * basePrice * 0.02;
        quotes.push({
            date: new Date(now - (points - i) * intervalMs).toISOString(),
            price: parseFloat((basePrice + variation).toFixed(2))
        });
    }

    return {
        symbol,
        currency: symbol.includes('.SR') ? 'SAR' : (symbol.includes('.CA') ? 'EGP' : 'USD'),
        granularity: 'generated',
        range,
        quotes
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
    const range = url.searchParams.get('range') || '1D';

    if (!symbol) {
        return jsonResponse({ error: 'Symbol required' }, 400);
    }

    try {
        // Proxy to Vercel
        console.log(`📈 Fetching chart for ${symbol} via Vercel proxy...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/chart?symbol=${encodeURIComponent(symbol)}&range=${range}`;

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.quotes && data.quotes.length > 0) {
                console.log(`✅ Got ${data.quotes.length} chart points from Vercel`);
                return jsonResponse(data);
            }
        }
    } catch (error) {
        console.error('Vercel proxy error:', error.message);
    }

    // Fallback: Generate chart
    console.log(`⚠️ Using fallback chart for ${symbol}`);
    return jsonResponse(generateFallbackChart(symbol, range));
}
