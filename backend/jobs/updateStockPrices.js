const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/stocks.json');

// 20 Saudi Stocks
// 30 Saudi Stocks (Expanded)
const SAUDI_STOCKS = [
    '2222.SR', // Saudi Aramco
    '1120.SR', // Al Rajhi Bank
    '2010.SR', // SABIC
    '7010.SR', // STC
    '2082.SR', // ACWA Power
    '1180.SR', // SNB
    '2380.SR', // Petro Rabigh
    '4030.SR', // Al Babtain
    '2350.SR', // SIDC
    '4200.SR', // Aldrees
    '1211.SR', // Ma'aden
    '4001.SR', // Abdullah Al-Othaim
    '2310.SR', // Sipchem
    '4003.SR', // Extra
    '2050.SR', // Savola
    '1150.SR', // Alinma Bank
    '4190.SR', // Jarir
    '2290.SR', // Yanbu Cement
    '4002.SR', // Mouwasat
    '1010.SR', // Riyad Bank
    '2020.SR', // SABIC Agri-Nutrients
    '2280.SR', // Almarai
    '5110.SR', // Saudi Electricity
    '1140.SR', // Bank Albilad
    '1060.SR', // SABB (Saudi Awwal)
    '7200.SR', // Al Moammar
    '4220.SR', // Emaar
    '4090.SR', // Taiba
    '4040.SR', // SAPTCO
    '^TASI.SR' // Tadawul All Share Index
];

// 20 Egypt Stocks (Expanded)
const EGYPT_STOCKS = [
    'COMI.CA', // CIB
    'EAST.CA', // Eastern Company
    'HRHO.CA', // EFG Hermes
    'TMGH.CA', // TMG Holding
    'SWDY.CA', // Elsewedy Electric
    'ETEL.CA', // Telecom Egypt
    'AMOC.CA', // AMOC
    'EKHO.CA', // Egypt Kuwait Holding
    'HELI.CA', // Heliopolis Housing
    'ORAS.CA', // Orascom Construction
    'ESRS.CA', // Ezz Steel
    'ABUK.CA', // Abu Qir Fertilizers
    'MFPC.CA', // Misr Fertilizers
    'ISPH.CA', // Ibnsina Pharma
    'PHDC.CA', // Palm Hills
    'AUTO.CA', // GB Auto
    'CIEB.CA', // Credit Agricole
    'FWRY.CA', // Fawry
    'ADIB.CA', // Abu Dhabi Islamic Bank
    '^EGX30.CA' // EGX 30 Index
];

const GLOBAL_TICKERS = [
    '^GSPC', // S&P 500
    '^DJI',  // Dow Jones
    '^IXIC', // Nasdaq
    '^FTSE', // FTSE 100
    '^GDAXI', // DAX
    '^N225', // Nikkei 225
    'BZ=F',  // Brent Crude Oil
    'GC=F',   // Gold
    // Tech Giants
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    // Finance & Retail
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// Map tickers to display names and countries
const GLOBAL_META = {
    // Indices
    '^GSPC': { name: 'S&P 500', country: '🇺🇸' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵' },
    'BZ=F': { name: 'Oil (Brent)', country: '🛢️' },
    'GC=F': { name: 'Gold', country: '🥇' },

    // US Stocks
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
    'JPM': { name: 'JPMorgan', country: '🇺🇸' },
    'V': { name: 'Visa', country: '🇺🇸' },
    'MA': { name: 'Mastercard', country: '🇺🇸' },
    'WMT': { name: 'Walmart', country: '🇺🇸' },
    'HD': { name: 'Home Depot', country: '🇺🇸' },
    'PG': { name: 'P&G', country: '🇺🇸' },
    'KO': { name: 'Coca-Cola', country: '🇺🇸' },
    'PEP': { name: 'PepsiCo', country: '🇺🇸' },
    'DIS': { name: 'Disney', country: '🇺🇸' },
    'NKE': { name: 'Nike', country: '🇺🇸' },

    // Egypt Stocks
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

    // Saudi (Additional Manual Meta if needed - basic fallback is code)
    '1211.SR': { name: "Ma'aden", country: '🇸🇦' },
    '1150.SR': { name: 'Alinma', country: '🇸🇦' },
    '2020.SR': { name: 'SABIC Agri', country: '🇸🇦' },
    '2280.SR': { name: 'Almarai', country: '🇸🇦' },
    '5110.SR': { name: 'Saudi Elec', country: '🇸🇦' },
    '1140.SR': { name: 'Albilad', country: '🇸🇦' },
    '1060.SR': { name: 'SAB الأول', country: '🇸🇦' }
};

// In-memory cache
let stockCache = [];

/**
 * Check if Tadawul (Saudi Stock Exchange) is currently open
 * Trading hours: Sunday-Thursday, 10:00 AM - 3:00 PM Saudi Arabian time (GMT+3)
 * @returns {boolean} - true if market is open, false otherwise
 */
/**
 * Check if a specific market is currently open
 * @param {string} market - 'SA', 'EG', or 'US'
 * @returns {boolean} - true if market is open
 */
function isMarketOpen(market) {
    const now = new Date();

    // SAUDI ARABIA (GMT+3)
    // Sun-Thu, 10:00 - 15:20 (including pre/post? usually 10-3pm strictly trading)
    if (market === 'SA') {
        const saudiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
        const day = saudiTime.getDay(); // 0=Sun, 6=Sat
        const minutes = saudiTime.getHours() * 60 + saudiTime.getMinutes();
        if (day >= 0 && day <= 4) { // Sun-Thu
            // 10:00 AM to 3:15 PM (giving buffer)
            return minutes >= 600 && minutes <= 915;
        }
        return false;
    }

    // EGYPT (GMT+2 or +3, using Cairo time)
    // Sun-Thu, 10:00 - 14:30
    if (market === 'EG') {
        const egyptTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
        const day = egyptTime.getDay();
        const minutes = egyptTime.getHours() * 60 + egyptTime.getMinutes();
        if (day >= 0 && day <= 4) { // Sun-Thu
            return minutes >= 600 && minutes <= 870; // 10:00 - 14:30
        }
        return false;
    }

    // USA (ET)
    // Mon-Fri, 09:30 - 16:00
    if (market === 'US') {
        const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const day = nyTime.getDay();
        const minutes = nyTime.getHours() * 60 + nyTime.getMinutes();
        if (day >= 1 && day <= 5) { // Mon-Fri
            return minutes >= 570 && minutes <= 960; // 09:30 - 16:00
        }
        return false;
    }

    return false;
}

/**
 * Get market status info for display
 * @param {string} market - 'SA', 'EG', or 'US', defaults to SA if omitted (backwards compatibility)
 * @returns {object} - market status details
 */
function getMarketStatus(market = 'SA') {
    const isOpen = isMarketOpen(market);
    // Return simple object (can be expanded)
    return {
        isOpen,
        message: isOpen
            ? 'Market Open'
            : 'Market Closed'
    };
}

async function updateStockPrices() {
    try {
        // Updated Tickers: Use ^CASE30 for EGX30 (Correct val ~41k)
        const allTickers = [...new Set([...SAUDI_STOCKS, ...GLOBAL_TICKERS, ...EGYPT_STOCKS, '^TASI.SR', '^CASE30', '^DJI'])];

        // --- ADDED BATCHING TO PREVENT RATE LIMITS ---
        const chunkSize = 5;
        const results = [];

        for (let i = 0; i < allTickers.length; i += chunkSize) {
            const chunk = allTickers.slice(i, i + chunkSize);
            const chunkPromises = chunk.map(symbol =>
                yahooFinance.quote(symbol).catch(e => {
                    console.error(`Error fetching ${symbol}:`, e.message);
                    return null;
                })
            );

            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);

            // Short delay between chunks
            if (i + chunkSize < allTickers.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        const updates = [];

        results.forEach(quote => {
            if (!quote) return;

            const isGlobal = GLOBAL_TICKERS.includes(quote.symbol) || quote.symbol === '^DJI';
            const isEgypt = EGYPT_STOCKS.includes(quote.symbol) || quote.symbol === '^EGX30.CA' || quote.symbol === 'CASE30.CA' || quote.symbol === '^CASE30';
            const isSaudi = SAUDI_STOCKS.includes(quote.symbol) || quote.symbol === '^TASI.SR';

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

            // Volume: Indices often don't have volume on Yahoo Finance.
            // If 0, try to find an average volume if available, or keep 0
            let volume = quote.regularMarketVolume || quote.averageDailyVolume3Month || quote.averageDailyVolume10Day || 0;

            // Mapping Fallback
            let symbol = quote.symbol;
            // Removed re-mapping to ensure ^CASE30 stays as ^CASE30 for frontend consistency
            if (symbol === 'CASE30.CA') symbol = '^CASE30';

            // Get metadata - DO NOT fallback to EGX30 for all unknown symbols!
            const meta = GLOBAL_META[quote.symbol] || null;

            // Determine name: Use meta first, then API shortName, then symbol
            let displayName = quote.shortName || quote.longName || quote.symbol;
            if (meta && meta.name) displayName = meta.name;

            // Determine country
            let displayCountry = isEgypt ? '🇪🇬' : (isSaudi ? '🇸🇦' : '🇺🇸');
            if (meta && meta.country) displayCountry = meta.country;

            const stockData = {
                symbol: symbol,
                name: displayName,
                category: isGlobal ? 'Global' : (isEgypt ? 'EG' : 'SA'),
                country: displayCountry,
                sector: meta?.sector || quote.sector || null, // Include sector from meta
                regularMarketPrice: price,
                price: price, // Unified field
                regularMarketChange: change,
                change: change, // Unified
                regularMarketChangePercent: changePercent,
                changePercent: changePercent, // Unified
                regularMarketTime: quote.regularMarketTime,
                prevClose: prevClose,
                high: quote.regularMarketDayHigh || price,
                low: quote.regularMarketDayLow || price,
                volume: volume,
                open: quote.regularMarketOpen || price,
                fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
                marketCap: quote.marketCap,
                peRatio: quote.trailingPE,
                eps: quote.epsTrailingTwelveMonths,
                dividendYield: quote.trailingAnnualDividendYield,
                lastUpdated: new Date().toISOString()
            };
            updates.push(stockData);
        });

        if (updates.length > 0) {
            stockCache = updates; // Update memory cache
            fs.writeFileSync(DATA_FILE, JSON.stringify(updates, null, 2));
            const now = new Date().toLocaleTimeString();
            console.log(`✅ Updated ${updates.length} stocks at ${now}`);
        }

        return updates;
    } catch (error) {
        console.error('❌ Global update failed:', error.message);
        return stockCache; // Return stale data on error
    }
}

// Helper to get stocks from file
function getStocksFromFile() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

const { updateStockProfiles, getStockProfiles } = require('./updateStockProfiles');

function getStocks() {
    let liveData = [];

    // Get live data from memory or file
    if (stockCache.length > 0) {
        liveData = stockCache;
    } else if (fs.existsSync(DATA_FILE)) {
        try {
            liveData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            liveData = [];
        }
    }

    // Get static profile data
    const profiles = getStockProfiles();

    // Merge datasets - profile data takes precedence for fundamental data
    return liveData.map(stock => {
        const profile = profiles[stock.symbol] || {};
        return {
            // Live price data (updates every 5s during market hours)
            symbol: stock.symbol,
            name: stock.name,
            category: stock.category || 'SA',
            country: stock.country || '🇸🇦',
            price: stock.regularMarketPrice || stock.price,
            regularMarketPrice: stock.regularMarketPrice,
            change: stock.regularMarketChange || stock.change,
            regularMarketChange: stock.regularMarketChange,
            changePercent: stock.regularMarketChangePercent || stock.changePercent,
            regularMarketChangePercent: stock.regularMarketChangePercent,
            prevClose: stock.prevClose,
            regularMarketPreviousClose: stock.prevClose,
            high: stock.high,
            regularMarketDayHigh: stock.high,
            low: stock.low,
            regularMarketDayLow: stock.low,
            volume: stock.volume,
            regularMarketVolume: stock.volume,
            open: stock.open,
            regularMarketOpen: stock.open,
            fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
            marketCap: stock.marketCap,
            peRatio: stock.peRatio,
            eps: stock.eps,
            dividendYield: stock.dividendYield,
            lastUpdated: stock.lastUpdated,
            regularMarketTime: stock.lastUpdated,

            // Static profile data (from quoteSummary)
            ...profile
        };
    });
}

module.exports = {
    updateStockPrices,
    getStocks,
    isMarketOpen,
    getMarketStatus,
    SAUDI_STOCKS,
    EGYPT_STOCKS,
    GLOBAL_TICKERS
};
