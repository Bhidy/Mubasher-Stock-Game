
// Cloudflare Pages Function - Direct Stocks Fetching
// Eliminates Vercel dependency which is failing deployment
import yahooFinance from 'yahoo-finance2';

// Version: CF-DIRECT-1.1 - Safety Fix
// Reuse the robust mapping logic from the previous iteration
// Metadata mapping for all markets
const STOCK_META = {
    // Saudi Arabia
    '2222.SR': { name: 'Saudi Aramco', country: '🇸🇦', sector: 'Energy' },
    '1120.SR': { name: 'Al Rajhi Bank', country: '🇸🇦', sector: 'Financial' },
    '2010.SR': { name: 'SABIC', country: '🇸🇦', sector: 'Materials' },
    '7010.SR': { name: 'STC', country: '🇸🇦', sector: 'Telecom' },
    '2082.SR': { name: 'ACWA Power', country: '🇸🇦', sector: 'Utilities' },
    '1180.SR': { name: 'SNB', country: '🇸🇦', sector: 'Financial' },
    '^TASI.SR': { name: 'TASI', country: '🇸🇦', sector: 'Index' },
    // Egypt
    'COMI.CA': { name: 'CIB Bank', country: '🇪🇬', sector: 'Financial' },
    'HRHO.CA': { name: 'EFG Hermes', country: '🇪🇬', sector: 'Financial' },
    'TMGH.CA': { name: 'Talaat Moustafa', country: '🇪🇬', sector: 'Real Estate' },
    'SWDY.CA': { name: 'Elsewedy Electric', country: '🇪🇬', sector: 'Industrial' },
    '^CASE30': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    // US
    '^GSPC': { name: 'S&P 500', country: '🇺🇸', sector: 'Index' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸', sector: 'Index' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸', sector: 'Index' },
    'AAPL': { name: 'Apple', country: '🇺🇸', sector: 'Technology' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸', sector: 'Technology' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸', sector: 'Technology' },
    'TSLA': { name: 'Tesla', country: '🇺🇸', sector: 'Consumer' }
};

// Complete Ticker Lists (Miniaturized for specific endpoint to save bandwidth if needed, but we use full list here)
const SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
];

const EGYPT_STOCKS = [
    'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
    'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
    'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
    'ADIB.CA', '^CASE30'
];

const US_STOCKS = [
    '^GSPC', '^DJI', '^IXIC',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

const MARKET_STOCKS = {
    'SA': SAUDI_STOCKS,
    'EG': EGYPT_STOCKS,
    'US': US_STOCKS,
    'Global': US_STOCKS
};

// Helper Functions
const getMarketCategory = (symbol) => {
    if (symbol.endsWith('.SR') || SAUDI_STOCKS.includes(symbol)) return 'SA';
    if (symbol.endsWith('.CA') || symbol === '^CASE30' || EGYPT_STOCKS.includes(symbol)) return 'EG';
    return 'US';
};

const getCountryFlag = (category) => {
    const flags = { 'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'Global': '🌍' };
    return flags[category] || '🌍';
};

const getLogoUrl = (symbol) => {
    // Simple logo fetcher
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${symbol.split('.')[0].toLowerCase()}.com&size=128`;
};

const mapStockData = (quote) => {
    if (!quote || !quote.symbol) return null;
    const symbol = quote.symbol;
    const category = getMarketCategory(symbol);
    const meta = STOCK_META[symbol] || {};
    const price = quote.regularMarketPrice || quote.regularMarketOpen || quote.previousClose || 0;
    const prevClose = quote.regularMarketPreviousClose || quote.previousClose || price;
    let change = quote.regularMarketChange;
    let changePercent = quote.regularMarketChangePercent;

    if ((change === undefined || change === 0) && prevClose > 0 && price > 0) {
        change = price - prevClose;
        changePercent = (change / prevClose) * 100;
    }

    return {
        symbol: symbol,
        name: meta.name || quote.shortName || quote.longName || symbol,
        category: category,
        country: meta.country || getCountryFlag(category),
        sector: meta.sector || quote.sector || null,
        logo: getLogoUrl(symbol),
        price: price,
        change: change || 0,
        changePercent: changePercent || 0,
        prevClose: prevClose,
        marketCap: quote.marketCap,
        lastUpdated: new Date().toISOString()
    };
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'US';

    try {
        // Init config safely inside handler
        try {
            yahooFinance.setGlobalConfig({
                reqOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    }
                }
            });
            if (typeof yahooFinance.suppressNotices === 'function') yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        } catch (confErr) {
            console.log("Config Warning:", confErr);
        }

        let allTickers = MARKET_STOCKS[market] || US_STOCKS;
        console.log(`CF Functions: Fetching ${market} - ${allTickers.length} tickers`);

        // Use Promise.allSettled for robustness? No, quote handles arrays.
        // Yahoo Finance v2 quote(array) works well.

        let quoteResult;
        try {
            quoteResult = await yahooFinance.quote(allTickers, { validateResult: false });
        } catch (e) {
            // Handle partial failure?
            console.error("Batch fetch failed:", e.message);
            // Fallback to single fetches if batch fails? Too slow for serverless.
            return new Response(JSON.stringify({ error: "Batch fetch failed", details: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = (Array.isArray(quoteResult) ? quoteResult : [quoteResult])
            .map(mapStockData)
            .filter(item => item !== null);

        if (data.length === 0) {
            return new Response(JSON.stringify({ error: "No data returned" }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
            }
        });

    } catch (error) {
        console.error('CF Function Error:', error);
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
