// Cloudflare Pages Function - Enterprise Stock Sync
// Fully Synchronized with Backend "Golden Source"
import yahooFinance from 'yahoo-finance2';

// Version: CF-ENTERPRISE-1.0
// FULL MARKET CATALOG (Ported from backend/jobs/updateStockPrices.js)

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

const GLOBAL_TICKERS = [
    '^GSPC', '^DJI', '^IXIC', // US Indices
    '^FTSE', // UK (FTSE 100)
    '^GDAXI', // Germany (DAX)
    '^N225', // Japan (Nikkei)
    'BZ=F', // Brent Crude Oil
    'GC=F', // Gold
    // Tech Giants
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    // Finance & Retail
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// METADATA MAPPING (Ported from backend)
const GLOBAL_META = {
    // Indices & Commodities
    '^GSPC': { name: 'S&P 500', country: '🇺🇸', sector: 'Index' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸', sector: 'Index' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸', sector: 'Index' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧', sector: 'Index' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪', sector: 'Index' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵', sector: 'Index' },
    'BZ=F': { name: 'Oil (Brent)', country: '🛢️', sector: 'Commodity' },
    'GC=F': { name: 'Gold', country: '🥇', sector: 'Commodity' },
    '^CASE30': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    '^TASI.SR': { name: 'TASI', country: '🇸🇦', sector: 'Index' },

    // US Stocks
    'AAPL': { name: 'Apple', country: '🇺🇸', sector: 'Technology' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸', sector: 'Technology' },
    'GOOG': { name: 'Alphabet', country: '🇺🇸', sector: 'Technology' },
    'AMZN': { name: 'Amazon', country: '🇺🇸', sector: 'Consumer' },
    'TSLA': { name: 'Tesla', country: '🇺🇸', sector: 'Automotive' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸', sector: 'Technology' },
    'META': { name: 'Meta', country: '🇺🇸', sector: 'Technology' },
    'NFLX': { name: 'Netflix', country: '🇺🇸', sector: 'Media' },
    'AMD': { name: 'AMD', country: '🇺🇸', sector: 'Technology' },
    'INTC': { name: 'Intel', country: '🇺🇸', sector: 'Technology' },
    'JPM': { name: 'JPMorgan', country: '🇺🇸', sector: 'Financial' },
    'V': { name: 'Visa', country: '🇺🇸', sector: 'Financial' },
    'MA': { name: 'Mastercard', country: '🇺🇸', sector: 'Financial' },
    'WMT': { name: 'Walmart', country: '🇺🇸', sector: 'Retail' },
    'HD': { name: 'Home Depot', country: '🇺🇸', sector: 'Retail' },
    'PG': { name: 'P&G', country: '🇺🇸', sector: 'Consumer' },
    'KO': { name: 'Coca-Cola', country: '🇺🇸', sector: 'Consumer' },
    'PEP': { name: 'PepsiCo', country: '🇺🇸', sector: 'Consumer' },
    'DIS': { name: 'Disney', country: '🇺🇸', sector: 'Media' },
    'NKE': { name: 'Nike', country: '🇺🇸', sector: 'Consumer' },

    // Saudi Metadata
    '2222.SR': { name: 'Saudi Aramco', country: '🇸🇦', sector: 'Energy' },
    '1120.SR': { name: 'Al Rajhi Bank', country: '🇸🇦', sector: 'Financial' },
    '2010.SR': { name: 'SABIC', country: '🇸🇦', sector: 'Materials' },
    '7010.SR': { name: 'STC', country: '🇸🇦', sector: 'Telecom' },
    '2082.SR': { name: 'ACWA Power', country: '🇸🇦', sector: 'Utilities' },
    '1180.SR': { name: 'SNB', country: '🇸🇦', sector: 'Financial' },
    '1211.SR': { name: "Ma'aden", country: '🇸🇦', sector: 'Materials' },
    '1150.SR': { name: 'Alinma', country: '🇸🇦', sector: 'Financial' },
    '2020.SR': { name: 'SABIC Agri', country: '🇸🇦', sector: 'Materials' },
    '2280.SR': { name: 'Almarai', country: '🇸🇦', sector: 'Consumer' },
    '5110.SR': { name: 'Saudi Elec', country: '🇸🇦', sector: 'Utilities' },
    '1140.SR': { name: 'Albilad', country: '🇸🇦', sector: 'Financial' },
    '1060.SR': { name: 'SAB الأول', country: '🇸🇦', sector: 'Financial' },

    // Egypt Metadata
    'COMI.CA': { name: 'CIB Bank', country: '🇪🇬', sector: 'Financial' },
    'HRHO.CA': { name: 'EFG Hermes', country: '🇪🇬', sector: 'Financial' },
    'TMGH.CA': { name: 'TMG Holding', country: '🇪🇬', sector: 'Real Estate' },
    'SWDY.CA': { name: 'Elsewedy', country: '🇪🇬', sector: 'Industrial' },
};

const MARKET_STOCKS = {
    'SA': SAUDI_STOCKS,
    'EG': EGYPT_STOCKS,
    'Global': GLOBAL_TICKERS,
    'US': GLOBAL_TICKERS // Fallback alias
};

// ROBUST MAPPING LOGIC (Ported from Backend)
const mapStockData = (quote) => {
    if (!quote || !quote.symbol) return null;

    let symbol = quote.symbol;
    // Map CASE30.CA to ^CASE30 for frontend
    if (symbol === 'CASE30.CA') symbol = '^CASE30';

    const meta = GLOBAL_META[symbol] || {};

    // Classification
    const isGlobal = GLOBAL_TICKERS.includes(symbol) || symbol.startsWith('^G') || symbol.startsWith('^D') || symbol.startsWith('^F') || symbol.startsWith('^N') || symbol.includes('=F');
    const isEgypt = EGYPT_STOCKS.includes(symbol) || symbol.includes('.CA') || symbol.includes('CASE30');
    const isSaudi = SAUDI_STOCKS.includes(symbol) || symbol.includes('.SR');

    const category = isGlobal ? 'Global' : (isEgypt ? 'EG' : 'SA');
    const country = meta.country || (isEgypt ? '🇪🇬' : (isSaudi ? '🇸🇦' : '🇺🇸'));

    // --- DATA NORMALIZATION & ZERO FIX ---
    // Price: Try regular price, then previous close, then Open/High/Low as fallbacks
    let price = quote.regularMarketPrice || quote.regularMarketPreviousClose || quote.regularMarketOpen || quote.regularMarketDayHigh || 0;
    let prevClose = quote.regularMarketPreviousClose || quote.regularMarketOpen || price;

    // Change: API often returns 0/undefined when market is closed. Recalculate if possible.
    let change = quote.regularMarketChange;
    let changePercent = quote.regularMarketChangePercent;

    if ((change === undefined || change === 0) && prevClose > 0 && price > 0) {
        change = price - prevClose;
        changePercent = (change / prevClose) * 100;
    }
    // If still zero/undefined, default to 0
    if (!change) change = 0;
    if (!changePercent) changePercent = 0;

    // Volume Fallbacks
    let volume = quote.regularMarketVolume || quote.averageDailyVolume3Month || quote.averageDailyVolume10Day || 0;

    return {
        symbol: symbol,
        name: meta.name || quote.shortName || quote.longName || symbol,
        category: category,
        country: country,
        sector: meta.sector || quote.sector || null,
        logo: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${symbol.split('.')[0].toLowerCase()}.com&size=128`,

        // Unified fields
        price: price,
        change: change,
        changePercent: changePercent,
        prevClose: prevClose,
        high: quote.regularMarketDayHigh || price,
        low: quote.regularMarketDayLow || price,
        open: quote.regularMarketOpen || price,
        volume: volume,

        // Fundamentals
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        eps: quote.epsTrailingTwelveMonths,
        dividendYield: quote.trailingAnnualDividendYield,

        lastUpdated: new Date().toISOString()
    };
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'US';

    try {
        // Init config safely (Lazy Load)
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
        } catch (confErr) { console.log("Config Warning:", confErr); }

        // Select Tickers
        let allTickers = MARKET_STOCKS[market] || GLOBAL_TICKERS;

        // Fallback for 'US' to 'Global' if not explicitly defined
        if (market === 'US' && !MARKET_STOCKS['US']) allTickers = GLOBAL_TICKERS;

        console.log(`CF Functions: Fetching ${market} - ${allTickers.length} tickers`);

        // Batch Fetch
        let quoteResult;
        try {
            quoteResult = await yahooFinance.quote(allTickers, { validateResult: false });
        } catch (e) {
            console.error("Batch fetch failed:", e.message);
            // Fallback: If partial failure isn't handled by lib, we might return error.
            // But yahoo-finance2 quote(array) usually returns what it can or throws.
            return new Response(JSON.stringify({ error: "Batch fetch failed", details: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = (Array.isArray(quoteResult) ? quoteResult : [quoteResult])
            .map(mapStockData)
            .filter(item => item !== null);

        // Sort: Indices first? (Optional)
        // Only for global usually indices come first in list.

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
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}
