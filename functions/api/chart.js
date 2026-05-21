// Cloudflare Pages Function — Chart API with Range Filtering
// Version: RANGE-FILTER-V2 (2026-05-21)
// Data lake: pre-computed 1Y daily OHLCV JSON per symbol on GitHub

const CHART_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/charts';

// Normalize symbol to match the filenames saved by ingest_master.py
const normalizeSymbol = (sym) => {
    let s = sym.toUpperCase();
    if (s === 'CASE30.CA') return '^CASE30';
    if (s === '^CASE30.CA') return '^CASE30';
    return s.replace('^', ''); // files are saved without ^ prefix
};

/**
 * Filter a sorted (oldest-first) quotes array to the requested time range.
 * Quotes have a `date` field in "YYYY-MM-DD" format.
 */
function filterByRange(quotes, range) {
    if (!quotes || quotes.length === 0) return quotes;

    const now = new Date();

    switch (range) {
        case '1D':
            // No intraday data — return last 5 trading days so the chart
            // still shows meaningful short-term movement (not a single dot).
            return quotes.slice(-5);

        case '5D': {
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - 7); // 7 calendar days ≈ 5 trading days
            return sliceFrom(quotes, cutoff) || quotes.slice(-7);
        }

        case '1M': {
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - 31);
            return sliceFrom(quotes, cutoff) || quotes.slice(-22);
        }

        case '6M': {
            const cutoff = new Date(now);
            cutoff.setMonth(cutoff.getMonth() - 6);
            return sliceFrom(quotes, cutoff) || quotes.slice(-130);
        }

        case 'YTD': {
            const cutoff = new Date(`${now.getFullYear()}-01-01`);
            return sliceFrom(quotes, cutoff) || quotes;
        }

        // 1Y, 5Y, Max — return everything we have (1 year of daily data)
        default:
            return quotes;
    }
}

/** Return all quotes whose date >= cutoff date string, or null if < 2 entries found. */
function sliceFrom(quotes, cutoffDate) {
    const cutoffStr = cutoffDate.toISOString().slice(0, 10);
    const filtered = quotes.filter(q => (q.date || '') >= cutoffStr);
    return filtered.length >= 2 ? filtered : null;
}

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');
    const range  = url.searchParams.get('range') || '1Y';

    if (!symbol) {
        return new Response(JSON.stringify({ error: 'Symbol required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    try {
        const safeSymbol = normalizeSymbol(symbol);

        const response = await fetch(`${CHART_BASE_URL}/${safeSymbol}.json`, {
            headers: { 'User-Agent': 'StockHero-CF-Proxy/2.0', 'Cache-Control': 'no-cache' },
            cf: { cacheTtl: 300, cacheEverything: true }
        });

        if (!response.ok) {
            throw new Error(`Chart not found (${response.status}) for ${safeSymbol}`);
        }

        const fullData = await response.json();

        // Support both {quotes:[...]} envelope and raw array
        const allQuotes = Array.isArray(fullData) ? fullData : (fullData.quotes || []);

        // Apply range filter
        const filtered = filterByRange(allQuotes, range);

        return new Response(JSON.stringify({ quotes: filtered }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
                'X-Data-Source': 'GitHub-Data-Lake-CF',
                'X-Range': range,
                'X-Points': String(filtered?.length ?? 0)
            }
        });

    } catch (error) {
        console.error(`[Chart-CF] Error for ${symbol} (${range}):`, error.message);

        // Return empty quotes envelope (not bare array) so frontend json.quotes check works
        return new Response(JSON.stringify({ quotes: [], error: error.message }), {
            status: 200, // 200 with empty data to avoid red network errors in browser
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
