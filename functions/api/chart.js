// Cloudflare Pages Function - Data Lake Proxy (Charts)
// Version: GITHUB-CHART-LAKE-CF-V1

const CHART_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/charts';

// Helper: Normalize Symbol (Must match ingest_master.py logic)
const normalizeSymbol = (sym) => {
    let s = sym.toUpperCase();
    if (s === 'CASE30.CA') return '^CASE30';
    if (s === '^CASE30.CA') return '^CASE30';
    return s.replace('^', ''); // GitHub files are saved without ^ for safety
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
        return new Response(JSON.stringify({ error: "Symbol required" }), { status: 400 });
    }

    try {
        const safeSymbol = normalizeSymbol(symbol);

        // Fetch the PRE-COMPUTED JSON file
        const response = await fetch(`${CHART_BASE_URL}/${safeSymbol}.json`, {
            headers: {
                'User-Agent': 'StockHero-CF-Proxy/1.0',
                'Cache-Control': 'no-cache'
            },
            cf: { cacheTtl: 300, cacheEverything: true }
        });

        if (!response.ok) {
            throw new Error(`Chart not found in Lake (Status ${response.status})`);
        }

        const fullHistory = await response.json();

        // Simple 1D/1W/1M filtering could happen here if file is huge, 
        // but for now we just return the full history (1Y) and let frontend slice it.
        // It's static JSON, usually small (<50KB).

        return new Response(JSON.stringify(fullHistory), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
                'X-Data-Source': 'GitHub-Data-Lake-CF'
            }
        });

    } catch (error) {
        console.error(`[Chart-CF] Error for ${symbol}:`, error.message);

        // Fallback: Return empty array to verify frontend doesn't crash
        return new Response(JSON.stringify([]), {
            status: 200, // Return 200 with empty data to avoid red errors
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
