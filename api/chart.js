import yahooFinance from 'yahoo-finance2';

// Version: 2.0.0 - No simulated charts, real data only with 3x retry
// Deployed: 2025-12-07

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { symbol, range = '1d' } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    try {
        if (typeof yahooFinance.suppressNotices === 'function') {
            yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        }

        let interval = '15m';
        let qRange = range.toLowerCase();

        if (range === '1D') { interval = '15m'; qRange = '1d'; }
        else if (range === '5D') { interval = '60m'; qRange = '5d'; }
        else if (range === '1M') { interval = '1d'; qRange = '1mo'; }
        else if (range === '6M') { interval = '1d'; qRange = '6mo'; }
        else if (range === '1Y') { interval = '1d'; qRange = '1y'; }
        else if (range === 'Max') { interval = '1mo'; qRange = 'max'; }

        // --- RETRY LOGIC: Try up to 3 times ---
        let lastError = null;
        let result = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                result = await Promise.race([
                    yahooFinance.chart(symbol, { range: qRange, interval }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
                ]);
                break; // Success, exit loop
            } catch (e) {
                lastError = e;
                console.log(`Chart attempt ${attempt} failed for ${symbol}: ${e.message}`);
                if (attempt < 3) {
                    await new Promise(r => setTimeout(r, 500)); // Wait before retry
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
            // Return empty with clear error message
            return res.status(200).json({
                symbol: symbol,
                currency: 'USD',
                quotes: [],
                error: "No chart data available from market"
            });
        }

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json({
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            granularity: interval,
            range: qRange,
            quotes
        });

    } catch (e) {
        console.error(`Chart API failed for ${symbol}:`, e.message);

        // Return empty chart - NO SIMULATED DATA
        res.status(200).json({
            symbol: symbol,
            currency: 'USD',
            quotes: [],
            error: `Chart unavailable: ${e.message}`
        });
    }
}
