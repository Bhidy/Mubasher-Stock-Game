// Cloudflare Pages Function - AI Insight API
// Hybrid approach: Proxy to Vercel for reliable data

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

// Generate fallback insight
function generateFallbackInsight(symbol) {
    return {
        success: true,
        symbol,
        insight: {
            summary: `${symbol} is showing stable trading patterns. Monitor key support and resistance levels for potential entry points.`,
            sentiment: 'neutral',
            recommendation: 'Hold',
            confidence: 60,
            keyPoints: [
                'Market conditions appear stable',
                'Volume levels are within normal range',
                'Technical indicators show consolidation',
                'Watch for breakout signals'
            ],
            generatedAt: new Date().toISOString()
        }
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
        console.log(`🧠 Fetching AI insight for ${symbol} via Vercel proxy...`);
        const vercelUrl = `${VERCEL_API_BASE}/api/ai-insight?symbol=${encodeURIComponent(symbol)}`;

        const response = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.insight) {
                console.log(`✅ Got AI insight from Vercel for ${symbol}`);
                return jsonResponse(data);
            }
        }
    } catch (error) {
        console.error('Vercel proxy error:', error.message);
    }

    // Fallback
    console.log(`⚠️ Using fallback insight for ${symbol}`);
    return jsonResponse(generateFallbackInsight(symbol));
}
