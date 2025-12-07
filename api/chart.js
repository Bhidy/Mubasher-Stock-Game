import YahooFinance from 'yahoo-finance2';

// Version: 2.3.0 - Fixed for yahoo-finance2 v3 (period1/period2 required)
// Deployed: 2025-12-07

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

// Helper: Get date string for period calculation
const getDateString = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { symbol, range = '1D' } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    try {
        // Calculate period1 and period2 based on range
        const today = getDateString(0);
        let period1, interval;

        switch (range.toUpperCase()) {
            case '1D':
                period1 = getDateString(1);
                interval = '5m';
                break;
            case '5D':
                period1 = getDateString(5);
                interval = '15m';
                break;
            case '1M':
                period1 = getDateString(30);
                interval = '60m';
                break;
            case '6M':
                period1 = getDateString(180);
                interval = '1d';
                break;
            case 'YTD':
                period1 = new Date().getFullYear() + '-01-01';
                interval = '1d';
                break;
            case '1Y':
                period1 = getDateString(365);
                interval = '1d';
                break;
            case '5Y':
                period1 = getDateString(365 * 5);
                interval = '1wk';
                break;
            case 'MAX':
                period1 = '2000-01-01';
                interval = '1mo';
                break;
            default:
                period1 = getDateString(1);
                interval = '5m';
        }

        // --- RETRY LOGIC: Try up to 3 times ---
        let lastError = null;
        let result = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                result = await Promise.race([
                    yahooFinance.chart(symbol, {
                        period1: period1,
                        period2: today,
                        interval: interval
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
                ]);
                break;
            } catch (e) {
                lastError = e;
                console.log(`Chart attempt ${attempt} failed for ${symbol}: ${e.message}`);
                if (attempt < 3) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        }

        if (!result) {
            throw lastError || new Error("All retries failed");
        }

        const quotes = (result.quotes || []).map(q => ({
            date: q.date,
            price: q.close || q.open
        })).filter(q => q.price);

        if (quotes.length === 0) {
            return res.status(200).json({
                symbol: symbol,
                currency: 'USD',
                quotes: [],
                error: "No chart data available"
            });
        }

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json({
            symbol: result.meta?.symbol || symbol,
            currency: result.meta?.currency || 'USD',
            granularity: interval,
            range: range,
            quotes
        });

    } catch (e) {
        console.error(`Chart API failed for ${symbol}:`, e.message);
        res.status(200).json({
            symbol: symbol,
            currency: 'USD',
            quotes: [],
            error: `Chart unavailable: ${e.message}`
        });
    }
}
