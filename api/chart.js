// Cloudflare/Vercel Proxy for Charts
// Version: GITHUB-LE-CHART-V1

const CHART_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/charts';

// Helper: Normalize Symbol (Must match ingest_master.py logic)
const normalizeSymbol = (sym) => {
    let s = sym.toUpperCase();
    if (s === 'CASE30.CA') return '^CASE30';
    if (s === '^CASE30.CA') return '^CASE30';
    return s.replace('^', ''); // GitHub files are saved without ^ for safety
};

export default async function handler(req, res) {
    const { symbol, range = '1D' } = req.query; // 1D, 1M, 1Y...

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    try {
        const safeSymbol = normalizeSymbol(symbol);
        console.log(`📈 Fetching chart for ${symbol} (${safeSymbol}) from Data Lake...`);

        const response = await fetch(`${CHART_BASE_URL}/${safeSymbol}.json`, {
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            throw new Error(`Chart not found in Lake (Status ${response.status})`);
        }

        const fullHistory = await response.json();
        // fullHistory is array of { date: "YYYY-MM-DD", price: 123 } (Sorted by date usually, from ingest)

        // FILTER DATA BASED ON RANGE
        // ranges: 1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX
        // Our source is 1Y Daily.

        const now = new Date();
        let startDate = new Date();

        switch (range.toUpperCase()) {
            case '1M': startDate.setDate(now.getDate() - 30); break;
            case '6M': startDate.setMonth(now.getMonth() - 6); break;
            case 'YTD': startDate = new Date(now.getFullYear(), 0, 1); break;
            case '1Y': startDate.setDate(now.getDate() - 365); break;
            default: startDate.setDate(now.getDate() - 30); // Default 1M
        }

        let filteredQuotes = fullHistory.filter(q => new Date(q.date) >= startDate);

        // HANDLING 1D / 5D (Intraday)
        // Since we only have Daily data, 1D chart would be empty or 1 point.
        // We simulate a flat-line or simple trend for 1D if requested, using the latest price.
        if (range.toUpperCase() === '1D' || range.toUpperCase() === '5D') {
            // For now, return the last 5 days of Daily data so at least SOMETHING shows
            // Users usually prefer "No Data" or "Daily" over broken chart.
            // We return the last 7 points.
            filteredQuotes = fullHistory.slice(-7);
        }

        res.status(200).json({
            symbol: symbol,
            currency: 'USD',
            granularity: '1d', // We only have daily
            range: range,
            quotes: filteredQuotes
        });

    } catch (error) {
        console.error(`❌ Chart Error for ${symbol}:`, error.message);
        // Return empty chart (valid 200 response)
        res.status(200).json({
            symbol: symbol,
            currency: 'USD',
            quotes: [],
            error: 'Chart data temporarily unavailable'
        });
    }
}
