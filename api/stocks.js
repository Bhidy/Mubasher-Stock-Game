import YahooFinance from 'yahoo-finance2';

// Version: 3.0.0 - Added stock logos
// Deployed: 2025-12-07

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

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
    'ADIB.CA', '^CASE30'  // Use ^CASE30 instead of ^EGX30.CA - has correct volume/change data
];

const GLOBAL_TICKERS = [
    '^GSPC', '^DJI', '^IXIC', '^FTSE', '^GDAXI', '^N225', 'BZ=F', 'GC=F',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// Company domains for logo generation (Google Favicon API)
const COMPANY_DOMAINS = {
    '2222.SR': 'aramco.com', '1120.SR': 'alrajhibank.com.sa', '2010.SR': 'sabic.com',
    '7010.SR': 'stc.com.sa', '2082.SR': 'acwapower.com', '1180.SR': 'alahli.com',
    '2050.SR': 'savola.com', '1150.SR': 'alinma.com', '1010.SR': 'riyadbank.com',
    '1211.SR': 'maaden.com.sa', '4200.SR': 'aldrees.com', '4002.SR': 'mouwasat.com',
    '^TASI.SR': 'saudiexchange.sa', '^CASE30': 'egx.com.eg', '^EGX30.CA': 'egx.com.eg',
    'COMI.CA': 'cibeg.com', 'EAST.CA': 'easterncompany.com', 'HRHO.CA': 'efghermes.com',
    'TMGH.CA': 'talaatmoustafa.com', 'SWDY.CA': 'elsewedyelectric.com', 'ETEL.CA': 'te.eg',
    'ORAS.CA': 'orascom.com', 'FWRY.CA': 'fawry.com', 'PHDC.CA': 'palmhillsdevelopments.com',
    'AAPL': 'apple.com', 'MSFT': 'microsoft.com', 'GOOG': 'google.com', 'AMZN': 'amazon.com',
    'TSLA': 'tesla.com', 'NVDA': 'nvidia.com', 'META': 'meta.com', 'NFLX': 'netflix.com',
    'AMD': 'amd.com', 'INTC': 'intel.com', 'JPM': 'jpmorganchase.com', 'V': 'visa.com',
    'MA': 'mastercard.com', 'WMT': 'walmart.com', 'HD': 'homedepot.com', 'PG': 'pg.com',
    'KO': 'coca-colacompany.com', 'PEP': 'pepsico.com', 'DIS': 'disney.com', 'NKE': 'nike.com',
    '^GSPC': 'spglobal.com', '^DJI': 'dowjones.com', '^IXIC': 'nasdaq.com',
    '^FTSE': 'lseg.com', '^GDAXI': 'deutsche-boerse.com', '^N225': 'jpx.co.jp',
    'BZ=F': 'ice.com', 'GC=F': 'cmegroup.com'
};

const getLogoUrl = (symbol) => {
    const domain = COMPANY_DOMAINS[symbol];
    if (domain) {
        return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
    }
    return null;
};

// Metadata Mapping for cleaner display names
const GLOBAL_META = {
    '^GSPC': { name: 'S&P 500', country: '🇺🇸', sector: 'Index' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸', sector: 'Index' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸', sector: 'Index' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧', sector: 'Index' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪', sector: 'Index' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵', sector: 'Index' },
    'BZ=F': { name: 'Oil (Brent)', country: '🛢️', sector: 'Commodities' },
    'GC=F': { name: 'Gold', country: '🥇', sector: 'Commodities' },
    'AAPL': { name: 'Apple', country: '🇺🇸', sector: 'Technology' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸', sector: 'Technology' },
    'GOOG': { name: 'Alphabet', country: '🇺🇸', sector: 'Technology' },
    'AMZN': { name: 'Amazon', country: '🇺🇸', sector: 'Consumer Cyclical' },
    'TSLA': { name: 'Tesla', country: '🇺🇸', sector: 'Consumer Cyclical' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸', sector: 'Technology' },
    'META': { name: 'Meta', country: '🇺🇸', sector: 'Technology' },
    'NFLX': { name: 'Netflix', country: '🇺🇸', sector: 'Communication' },
    'AMD': { name: 'AMD', country: '🇺🇸', sector: 'Technology' },
    'INTC': { name: 'Intel', country: '🇺🇸', sector: 'Technology' },
    'JPM': { name: 'JPMorgan', country: '🇺🇸', sector: 'Financial' },
    'V': { name: 'Visa', country: '🇺🇸', sector: 'Financial' },
    'MA': { name: 'Mastercard', country: '🇺🇸', sector: 'Financial' },
    'WMT': { name: 'Walmart', country: '🇺🇸', sector: 'Consumer Defensive' },
    'HD': { name: 'Home Depot', country: '🇺🇸', sector: 'Consumer Cyclical' },
    'PG': { name: 'P&G', country: '🇺🇸', sector: 'Consumer Defensive' },
    'KO': { name: 'Coca-Cola', country: '🇺🇸', sector: 'Consumer Defensive' },
    'PEP': { name: 'PepsiCo', country: '🇺🇸', sector: 'Consumer Defensive' },
    'DIS': { name: 'Disney', country: '🇺🇸', sector: 'Communication' },
    'NKE': { name: 'Nike', country: '🇺🇸', sector: 'Consumer Cyclical' },
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
    '^CASE30': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    '2222.SR': { name: 'Saudi Aramco', country: '🇸🇦', sector: 'Energy' },
    '1120.SR': { name: 'Al Rajhi Bank', country: '🇸🇦', sector: 'Financial' },
    '2010.SR': { name: 'SABIC', country: '🇸🇦', sector: 'Materials' },
    '7010.SR': { name: 'STC', country: '🇸🇦', sector: 'Telecom' },
    '2082.SR': { name: 'ACWA Power', country: '🇸🇦', sector: 'Utilities' },
    '1180.SR': { name: 'SNB', country: '🇸🇦', sector: 'Financial' },
    '2380.SR': { name: 'Petrochemical', country: '🇸🇦', sector: 'Materials' },
    '4030.SR': { name: 'Al Babtain', country: '🇸🇦', sector: 'Industrial' },
    '2350.SR': { name: 'Kwanif', country: '🇸🇦', sector: 'Materials' },
    '4200.SR': { name: 'Aldrees', country: '🇸🇦', sector: 'Consumer' },
    '1211.SR': { name: "Ma'aden", country: '🇸🇦', sector: 'Materials' },
    '4001.SR': { name: 'Rawabi', country: '🇸🇦', sector: 'Industrial' },
    '2310.SR': { name: 'SIG', country: '🇸🇦', sector: 'Industrial' },
    '4003.SR': { name: 'Extra', country: '🇸🇦', sector: 'Consumer' },
    '2050.SR': { name: 'Savola', country: '🇸🇦', sector: 'Consumer' },
    '1150.SR': { name: 'Alinma', country: '🇸🇦', sector: 'Financial' },
    '4190.SR': { name: 'Jarir', country: '🇸🇦', sector: 'Consumer' },
    '2290.SR': { name: 'Yanbu Cement', country: '🇸🇦', sector: 'Materials' },
    '4002.SR': { name: 'Mouwasat', country: '🇸🇦', sector: 'Healthcare' },
    '1010.SR': { name: 'Riyad Bank', country: '🇸🇦', sector: 'Financial' },
    '2020.SR': { name: 'SABIC Agri', country: '🇸🇦', sector: 'Materials' },
    '2280.SR': { name: 'Almarai', country: '🇸🇦', sector: 'Consumer' },
    '5110.SR': { name: 'Saudi Elec', country: '🇸🇦', sector: 'Utilities' },
    '1140.SR': { name: 'Albilad', country: '🇸🇦', sector: 'Financial' },
    '1060.SR': { name: 'SAB', country: '🇸🇦', sector: 'Financial' },
    '7200.SR': { name: 'Rabigh', country: '🇸🇦', sector: 'Materials' },
    '4220.SR': { name: 'Emaar', country: '🇸🇦', sector: 'Real Estate' },
    '4090.SR': { name: 'Tasnee', country: '🇸🇦', sector: 'Materials' },
    '4040.SR': { name: 'SPCC', country: '🇸🇦', sector: 'Materials' },
    '^TASI.SR': { name: 'TASI', country: '🇸🇦', sector: 'Index' }
};

const mapStockData = (quote) => {
    if (!quote || !quote.symbol) return null;

    const symbol = quote.symbol;
    const isEg = EGYPT_STOCKS.includes(symbol) || symbol.includes('.CA');
    const isSa = SAUDI_STOCKS.includes(symbol) || symbol.includes('.SR');

    // Use Metadata - All stocks now have proper names
    const meta = GLOBAL_META[symbol] || {};

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
        category: isEg ? 'EG' : (isSa ? 'SA' : 'Global'),
        country: meta.country || (isEg ? '🇪🇬' : (isSa ? '🇸🇦' : '🇺🇸')),
        sector: meta.sector || quote.sector || null,
        logo: getLogoUrl(symbol),
        price: price,
        regularMarketPrice: price,
        change: change || 0,
        regularMarketChange: change || 0,
        changePercent: changePercent || 0,
        regularMarketChangePercent: changePercent || 0,
        prevClose: prevClose,
        volume: quote.regularMarketVolume || quote.averageDailyVolume3Month || 0,
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

        // Process in smaller chunks with RETRY logic
        const chunkSize = 5; // Smaller chunks for reliability
        const results = [];

        for (let i = 0; i < allTickers.length; i += chunkSize) {
            const chunk = allTickers.slice(i, i + chunkSize);

            // Retry each chunk up to 2 times
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const chunkResult = await Promise.race([
                        yahooFinance.quote(chunk),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
                    ]);

                    if (Array.isArray(chunkResult)) {
                        results.push(...chunkResult);
                    } else if (chunkResult) {
                        results.push(chunkResult);
                    }
                    break; // Success, exit retry loop
                } catch (err) {
                    console.error(`Batch ${i} attempt ${attempt} failed:`, err.message);
                    if (attempt < 2) {
                        await new Promise(r => setTimeout(r, 300));
                    }
                }
            }

            // Delay between chunks
            if (i + chunkSize < allTickers.length) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        const data = results.map(mapStockData).filter(item => item !== null);

        if (data.length === 0) {
            console.error('No stock data fetched - all requests failed');
            return res.status(200).json([]);
        }

        // Cache for 15 seconds
        res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=10');
        res.status(200).json(data);
    } catch (e) {
        console.error("Stocks API Error:", e);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
}
