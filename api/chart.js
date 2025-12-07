import YahooFinance from 'yahoo-finance2';

// Version: 2.2.0 - Fixed chart options to match backend
// Deployed: 2025-12-07

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

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
        // Determine range and interval (matching backend logic)
        let queryRange, interval;
        switch (range.toUpperCase()) {
            case '1D': queryRange = '1d'; interval = '5m'; break;
            case '5D': queryRange = '5d'; interval = '15m'; break;
            case '1M': queryRange = '1mo'; interval = '60m'; break;
            case '6M': queryRange = '6mo'; interval = '1d'; break;
            case 'YTD': queryRange = 'ytd'; interval = '1d'; break;
            case '1Y': queryRange = '1y'; interval = '1d'; break;
            case '5Y': queryRange = '5y'; interval = '1wk'; break;
            case 'MAX': queryRange = 'max'; interval = '1mo'; break;
            default: queryRange = '1d'; interval = '5m';
        }

        // --- RETRY LOGIC: Try up to 3 times ---
        let lastError = null;
        let result = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                result = await Promise.race([
                    yahooFinance.chart(symbol, {
                        period1: '2020-01-01', // Required by validation
                        range: queryRange,
                        interval: interval,
                        includePrePost: false
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
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            granularity: result.meta.dataGranularity,
            range: result.meta.range,
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
