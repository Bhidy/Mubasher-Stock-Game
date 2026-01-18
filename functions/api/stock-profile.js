// Cloudflare Pages Function - Data Lake Proxy (Profiles)
// Version: GITHUB-DATA-LAKE-CF-V1 (Restored)

const PROFILE_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/profiles';

const normalizeSymbol = (sym) => {
    let s = sym.toUpperCase();
    if (s === 'CASE30.CA') return '^CASE30';
    if (s === '^CASE30.CA') return '^CASE30';
    return s.replace('^', '');
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) return new Response(JSON.stringify({ error: "Symbol required" }), { status: 400 });

    try {
        const safeSymbol = normalizeSymbol(symbol);
        const response = await fetch(`${PROFILE_BASE_URL}/${safeSymbol}.json`, {
            headers: { 'User-Agent': 'StockHero-CF-Proxy/1.0', 'Cache-Control': 'no-cache' },
            cf: { cacheTtl: 30, cacheEverything: true }
        });

        if (!response.ok) throw new Error(`Profile not found (Status ${response.status})`);
        const profileData = await response.json();

        return new Response(JSON.stringify(profileData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
                'X-Data-Source': 'GitHub-Data-Lake-CF'
            }
        });

    } catch (error) {
        console.error(`[Profile-CF] Error for ${symbol}:`, error.message);
        return new Response(JSON.stringify({
            symbol: symbol,
            name: symbol,
            description: "Profile data currently updating. Please try again shortly.",
            sector: "N/A",
            price: 0,
            error: "Data Lake miss"
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
