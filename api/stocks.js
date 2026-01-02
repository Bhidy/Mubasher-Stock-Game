// Cloudflare/Vercel Proxy for Stocks
import yahooFinance from 'yahoo-finance2';

// Version: DEBUG-5.0 - Testing Deployment
yahooFinance.setGlobalConfig({
    reqOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    }
});

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { market } = req.query;
    console.log(`DEBUG: Fetching stocks for market: ${market}`);

    try {
        // Test single fetch first to verify connectivity
        const testSymbol = '2222.SR'; // Aramco
        console.log(`DEBUG: Testing connectivity with ${testSymbol}`);

        let testQuote;
        try {
            testQuote = await yahooFinance.quote(testSymbol);
            console.log('DEBUG: Test quote success:', testQuote?.regularMarketPrice);
        } catch (e) {
            console.error('DEBUG: Test quote failed:', e.message);
            throw new Error(`Yahoo Connection Failed: ${e.message}`);
        }

        // Response
        const responseData = [{
            symbol: testSymbol,
            name: "Test Connection (Aramco)",
            price: testQuote.regularMarketPrice,
            change: testQuote.regularMarketChange,
            market: market,
            ver: "DEBUG-5.0",
            timestamp: new Date().toISOString()
        }];

        res.status(200).json(responseData);

    } catch (e) {
        console.error("Stocks API Critical Error:", e);
        res.status(500).json({
            error: "Critical Failure",
            message: e.message,
            stack: e.stack,
            ver: "DEBUG-5.0"
        });
    }
}
