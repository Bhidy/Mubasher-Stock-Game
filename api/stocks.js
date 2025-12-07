import yahooFinance from 'yahoo-finance2';
import { FALLBACK_STOCKS } from './fallbackData.js';

// Fully expanded lists matching backend/jobs/updateStockPrices.js
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
    'ADIB.CA', '^EGX30.CA', 'CASE30.CA'
];

const GLOBAL_TICKERS = [
    '^GSPC', '^DJI', '^IXIC', '^FTSE', '^GDAXI', '^N225', 'BZ=F', 'GC=F',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// Metadata Mapping for cleaner display names
const GLOBAL_META = {
    '^GSPC': { name: 'S&P 500', country: '🇺🇸' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵' },
    'BZ=F': { name: 'Oil (Brent)', country: '🛢️' },
    'GC=F': { name: 'Gold', country: '🥇' },
    'AAPL': { name: 'Apple', country: '🇺🇸' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸' },
    'GOOG': { name: 'Alphabet', country: '🇺🇸' },
    'AMZN': { name: 'Amazon', country: '🇺🇸' },
    'TSLA': { name: 'Tesla', country: '🇺🇸' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸' },
    'META': { name: 'Meta', country: '🇺🇸' },
    'NFLX': { name: 'Netflix', country: '🇺🇸' },
    'AMD': { name: 'AMD', country: '🇺🇸' },
    'INTC': { name: 'Intel', country: '🇺🇸' },
    'COMI.CA': { name: 'CIB Bank', country: '🇪🇬', sector: 'Financial' },
    'EAST.CA': { name: 'Eastern Co', country: '🇪🇬', sector: 'Consumer' },
    'HRHO.CA': { name: 'EFG Hermes', country: '🇪🇬', sector: 'Financial' },
    'TMGH.CA': { name: 'TMG Holding', country: '🇪🇬', sector: 'Real Estate' },
    'SWDY.CA': { name: 'Elsewedy', country: '🇪🇬', sector: 'Industrial' },
    'ETEL.CA': { name: 'Telecom Egy', country: '🇪🇬', sector: 'Telecom' },
    'AMOC.CA': { name: 'AMOC', country: '🇪🇬', sector: 'Energy' },
    'EKHO.CA': { name: 'Egypt Kuwait', country: '🇪🇬', sector: 'Financial' },
    'HELI.CA': { name: 'Heliopolis', country: '🇪🇬', sector: 'Real Estate' },
    'ORAS.CA': { name: 'Orascom', country: '🇪🇬', sector: 'Industrial' },
    'ESRS.CA': { name: 'Ezz Steel', country: '🇪🇬', sector: 'Industrial' },
    'ABUK.CA': { name: 'Abu Qir', country: '🇪🇬', sector: 'Industrial' },
    'MFPC.CA': { name: 'MOPCO', country: '🇪🇬', sector: 'Industrial' },
    'ISPH.CA': { name: 'Ibnsina', country: '🇪🇬', sector: 'Healthcare' },
    'PHDC.CA': { name: 'Palm Hills', country: '🇪🇬', sector: 'Real Estate' },
    'AUTO.CA': { name: 'GB Auto', country: '🇪🇬', sector: 'Consumer' },
    'CIEB.CA': { name: 'Crédit Agri', country: '🇪🇬', sector: 'Financial' },
    'FWRY.CA': { name: 'Fawry', country: '🇪🇬', sector: 'Tech' },
    'ADIB.CA': { name: 'ADIB Egypt', country: '🇪🇬', sector: 'Financial' },
    '^EGX30.CA': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    '2222.SR': { name: 'Saudi Aramco', country: '🇸🇦' },
    '1120.SR': { name: 'Al Rajhi Bank', country: '🇸🇦' },
    '2010.SR': { name: 'SABIC', country: '🇸🇦' },
    '7010.SR': { name: 'STC', country: '🇸🇦' },
    '1180.SR': { name: 'SNB', country: '🇸🇦' },
    '^TASI.SR': { name: 'TASI', country: '🇸🇦' }
};

// Helper: Fetch with Timeout
const fetchQuoteWithTimeout = async (symbol) => {
    try {
        const result = await Promise.race([
            yahooFinance.quote(symbol),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        return result;
    } catch (e) {
        return null;
    }
};

const mapStockData = (quote) => {
    if (!quote || !quote.symbol) return null;

    const symbol = quote.symbol === 'CASE30.CA' ? '^CASE30' : quote.symbol;
    const isEg = EGYPT_STOCKS.includes(quote.symbol) || quote.symbol.includes('.CA');
    const isSa = SAUDI_STOCKS.includes(quote.symbol) || quote.symbol.includes('.SR');

    // Use Metadata if available, otherwise fallback to API data
    const meta = GLOBAL_META[quote.symbol] || GLOBAL_META[symbol] || {};

    // Price normalization
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
        name: meta.name || quote.shortName || quote.longName || quote.symbol,
        category: isEg ? 'EG' : (isSa ? 'SA' : 'Global'),
        country: meta.country || (isEg ? '🇪🇬' : (isSa ? '🇸🇦' : '🇺🇸')),
        sector: meta.sector || quote.sector || 'General',
        price: price,
        regularMarketPrice: price,
        change: change || 0,
        regularMarketChange: change || 0,
        changePercent: changePercent || 0,
        regularMarketChangePercent: changePercent || 0,
        prevClose: prevClose,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.trailingAnnualDividendYield,
        lastUpdated: new Date().toISOString()
    };
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (typeof yahooFinance.suppressNotices === 'function') {
            yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        }

        const { market } = req.query;
        let allTickers = [];

        if (market === 'SA') allTickers = SAUDI_STOCKS;
        else if (market === 'EG') allTickers = EGYPT_STOCKS;
        else if (market === 'Global') allTickers = GLOBAL_TICKERS;
        else allTickers = [...new Set([...SAUDI_STOCKS, ...EGYPT_STOCKS, ...GLOBAL_TICKERS])];

        // Process in smaller chunks to avoid Vercel Function Timeouts
        const chunkSize = 5;
        const results = [];

        for (let i = 0; i < allTickers.length; i += chunkSize) {
            const chunk = allTickers.slice(i, i + chunkSize);
            const promises = chunk.map(s => fetchQuoteWithTimeout(s));
            const chunkRes = await Promise.all(promises);
            results.push(...chunkRes);
            if (i + chunkSize < allTickers.length) await new Promise(r => setTimeout(r, 50));
        }

        let validResults = results.filter(q => q);

        // Fallback Logic
        if (validResults.length === 0) {
            console.log('Using Fallback Data');
            validResults = FALLBACK_STOCKS.filter(s => allTickers.includes(s.symbol));
        }

        const data = validResults.map(mapStockData).filter(item => item !== null);

        // Cache for 60 seconds
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(200).json(data);
    } catch (e) {
        console.error("API Error:", e);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
}
