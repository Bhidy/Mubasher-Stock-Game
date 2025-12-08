import YahooFinance from 'yahoo-finance2';

// Version: 4.0.0 - Added 10 new global markets
// Deployed: 2025-12-08

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

// === ALL MARKET STOCK LISTS ===

// Saudi Arabia (Tadawul) - .SR suffix
const SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
];

// Egypt (EGX) - .CA suffix
const EGYPT_STOCKS = [
    'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
    'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
    'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
    'ADIB.CA', '^CASE30'
];

// US (NYSE/NASDAQ) - no suffix
const US_STOCKS = [
    '^GSPC', '^DJI', '^IXIC',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// India (NSE) - .NS suffix
const INDIA_STOCKS = [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS', 'ITC.NS',
    'LT.NS', 'AXISBANK.NS', 'WIPRO.NS', 'SUNPHARMA.NS', 'MARUTI.NS',
    'TATAMOTORS.NS', 'HCLTECH.NS', 'BAJFINANCE.NS', 'ASIANPAINT.NS', '^NSEI'
];

// UK (LSE) - .L suffix
const UK_STOCKS = [
    'BP.L', 'HSBA.L', 'SHEL.L', 'AZN.L', 'ULVR.L', 'GSK.L', 'RIO.L', 'DGE.L',
    'LSEG.L', 'BATS.L', 'LLOY.L', 'VOD.L', 'BARC.L', 'NWG.L', 'REL.L',
    'GLEN.L', 'NG.L', 'PRU.L', 'CPG.L', '^FTSE'
];

// Canada (TSX) - .TO suffix
const CANADA_STOCKS = [
    'SHOP.TO', 'RY.TO', 'TD.TO', 'ENB.TO', 'CNR.TO', 'BNS.TO', 'BMO.TO',
    'CP.TO', 'SU.TO', 'TRP.TO', 'BCE.TO', 'CNQ.TO', 'MFC.TO', 'ATD.TO',
    'CSU.TO', 'CM.TO', 'ABX.TO', 'T.TO', 'WCN.TO', '^GSPTSE'
];

// Australia (ASX) - .AX suffix
const AUSTRALIA_STOCKS = [
    'BHP.AX', 'CBA.AX', 'CSL.AX', 'WBC.AX', 'NAB.AX', 'ANZ.AX', 'WES.AX',
    'MQG.AX', 'FMG.AX', 'WOW.AX', 'TLS.AX', 'RIO.AX', 'GMG.AX', 'ALL.AX',
    'TCL.AX', 'COL.AX', 'REA.AX', 'JHX.AX', 'STO.AX', '^AXJO'
];

// Hong Kong (HKEX) - .HK suffix
const HONGKONG_STOCKS = [
    '0700.HK', '9988.HK', '0005.HK', '0941.HK', '1299.HK', '0883.HK',
    '2318.HK', '0939.HK', '1398.HK', '3988.HK', '0011.HK', '0016.HK',
    '0001.HK', '0027.HK', '1810.HK', '9618.HK', '3690.HK', '0066.HK',
    '0002.HK', '^HSI'
];

// Germany (XETRA) - .DE suffix
const GERMANY_STOCKS = [
    'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'MBG.DE', 'BMW.DE', 'BAS.DE',
    'DBK.DE', 'VOW3.DE', 'ADS.DE', 'MRK.DE', 'DPW.DE', 'IFX.DE', 'RWE.DE',
    'ENR.DE', 'HEN3.DE', 'MUV2.DE', 'CON.DE', 'FRE.DE', '^GDAXI'
];

// Japan (TSE) - .T suffix
const JAPAN_STOCKS = [
    '7203.T', '6758.T', '9984.T', '6861.T', '9432.T', '8306.T', '6098.T',
    '7974.T', '4502.T', '8035.T', '6501.T', '4063.T', '7267.T', '9433.T',
    '8766.T', '6902.T', '4661.T', '7751.T', '4503.T', '^N225'
];

// UAE (ADX) - .AE or .DU suffix - Using Abu Dhabi tickers
const UAE_STOCKS = [
    'EMIRATESNBD.AE', 'FAB.AE', 'ETISALAT.AE', 'ADNOCDIST.AE', 'DIB.AE',
    'ADCB.AE', 'ALDAR.AE', 'EMAAR.DU', 'DU.DU', 'DEWA.DU',
    'DAMAC.DU', 'EMIRATES.DU', 'TAQA.AE', 'ADPORTS.AE', '^ADI'
];

// South Africa (JSE) - .JO suffix
const SOUTHAFRICA_STOCKS = [
    'NPN.JO', 'SOL.JO', 'BTI.JO', 'SBK.JO', 'FSR.JO', 'AGL.JO', 'MTN.JO',
    'ABG.JO', 'CFR.JO', 'BID.JO', 'VOD.JO', 'SHP.JO', 'AMS.JO', 'IMP.JO',
    'NED.JO', '^J203'
];

// Qatar (QSE) - .QA suffix
const QATAR_STOCKS = [
    'QNBK.QA', 'QEWS.QA', 'QGTS.QA', 'QIBK.QA', 'IQCD.QA', 'MARK.QA',
    'BRES.QA', 'CBQK.QA', 'ORDS.QA', 'QFLS.QA', 'UDCD.QA', 'DHBK.QA', '^QSI'
];

// Legacy global (for backward compatibility)
const GLOBAL_TICKERS = US_STOCKS;

// Company domains for logo generation
const COMPANY_DOMAINS = {
    // Saudi
    '2222.SR': 'aramco.com', '1120.SR': 'alrajhibank.com.sa', '2010.SR': 'sabic.com',
    '7010.SR': 'stc.com.sa', '2082.SR': 'acwapower.com', '1180.SR': 'alahli.com',
    '2050.SR': 'savola.com', '1150.SR': 'alinma.com', '1010.SR': 'riyadbank.com',
    '4002.SR': 'mouwasat.com', '^TASI.SR': 'saudiexchange.sa',
    // Egypt
    'COMI.CA': 'cibeg.com', 'HRHO.CA': 'efghermes.com', 'SWDY.CA': 'elsewedyelectric.com',
    'ETEL.CA': 'te.eg', 'FWRY.CA': 'fawry.com', '^CASE30': 'egx.com.eg',
    // US
    'AAPL': 'apple.com', 'MSFT': 'microsoft.com', 'GOOG': 'google.com', 'AMZN': 'amazon.com',
    'TSLA': 'tesla.com', 'NVDA': 'nvidia.com', 'META': 'meta.com', 'NFLX': 'netflix.com',
    'AMD': 'amd.com', 'INTC': 'intel.com', 'JPM': 'jpmorganchase.com', 'V': 'visa.com',
    // India
    'RELIANCE.NS': 'ril.com', 'TCS.NS': 'tcs.com', 'HDFCBANK.NS': 'hdfcbank.com',
    'INFY.NS': 'infosys.com', 'ICICIBANK.NS': 'icicibank.com', '^NSEI': 'nseindia.com',
    // UK
    'BP.L': 'bp.com', 'HSBA.L': 'hsbc.com', 'SHEL.L': 'shell.com', 'AZN.L': 'astrazeneca.com',
    'ULVR.L': 'unilever.com', 'GSK.L': 'gsk.com', 'VOD.L': 'vodafone.com', '^FTSE': 'lseg.com',
    // Canada
    'SHOP.TO': 'shopify.com', 'RY.TO': 'rbc.com', 'TD.TO': 'td.com', 'ENB.TO': 'enbridge.com',
    '^GSPTSE': 'tsx.com',
    // Australia
    'BHP.AX': 'bhp.com', 'CBA.AX': 'commbank.com.au', 'CSL.AX': 'csl.com', '^AXJO': 'asx.com.au',
    // Hong Kong
    '0700.HK': 'tencent.com', '9988.HK': 'alibaba.com', '1810.HK': 'mi.com', '^HSI': 'hsi.com.hk',
    // Germany
    'SAP.DE': 'sap.com', 'SIE.DE': 'siemens.com', 'BMW.DE': 'bmw.com', 'MBG.DE': 'mercedes-benz.com',
    'ADS.DE': 'adidas.com', '^GDAXI': 'deutsche-boerse.com',
    // Japan
    '7203.T': 'toyota.com', '6758.T': 'sony.com', '7974.T': 'nintendo.com', '^N225': 'jpx.co.jp',
    // UAE
    'ETISALAT.AE': 'eand.com', 'FAB.AE': 'bankfab.com', '^ADI': 'adx.ae',
    // South Africa
    'NPN.JO': 'naspers.com', 'MTN.JO': 'mtn.com', '^J203': 'jse.co.za',
    // Qatar
    'QNBK.QA': 'qnb.com', 'ORDS.QA': 'ooredoo.qa'
};

const getLogoUrl = (symbol) => {
    const domain = COMPANY_DOMAINS[symbol];
    if (domain) {
        return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
    }
    return null;
};

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
    'SWDY.CA': { name: 'Elsewedy', country: '🇪🇬', sector: 'Industrial' },
    '^CASE30': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    // US
    '^GSPC': { name: 'S&P 500', country: '🇺🇸', sector: 'Index' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸', sector: 'Index' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸', sector: 'Index' },
    'AAPL': { name: 'Apple', country: '🇺🇸', sector: 'Technology' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸', sector: 'Technology' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸', sector: 'Technology' },
    'TSLA': { name: 'Tesla', country: '🇺🇸', sector: 'Consumer' },
    // India
    'RELIANCE.NS': { name: 'Reliance Industries', country: '🇮🇳', sector: 'Energy' },
    'TCS.NS': { name: 'Tata Consultancy', country: '🇮🇳', sector: 'Technology' },
    'HDFCBANK.NS': { name: 'HDFC Bank', country: '🇮🇳', sector: 'Financial' },
    'INFY.NS': { name: 'Infosys', country: '🇮🇳', sector: 'Technology' },
    'ICICIBANK.NS': { name: 'ICICI Bank', country: '🇮🇳', sector: 'Financial' },
    '^NSEI': { name: 'Nifty 50', country: '🇮🇳', sector: 'Index' },
    // UK
    'BP.L': { name: 'BP plc', country: '🇬🇧', sector: 'Energy' },
    'HSBA.L': { name: 'HSBC Holdings', country: '🇬🇧', sector: 'Financial' },
    'SHEL.L': { name: 'Shell plc', country: '🇬🇧', sector: 'Energy' },
    'AZN.L': { name: 'AstraZeneca', country: '🇬🇧', sector: 'Healthcare' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧', sector: 'Index' },
    // Canada
    'SHOP.TO': { name: 'Shopify', country: '🇨🇦', sector: 'Technology' },
    'RY.TO': { name: 'Royal Bank', country: '🇨🇦', sector: 'Financial' },
    'TD.TO': { name: 'TD Bank', country: '🇨🇦', sector: 'Financial' },
    '^GSPTSE': { name: 'TSX Composite', country: '🇨🇦', sector: 'Index' },
    // Australia
    'BHP.AX': { name: 'BHP Group', country: '🇦🇺', sector: 'Mining' },
    'CBA.AX': { name: 'Commonwealth Bank', country: '🇦🇺', sector: 'Financial' },
    'CSL.AX': { name: 'CSL Limited', country: '🇦🇺', sector: 'Healthcare' },
    '^AXJO': { name: 'ASX 200', country: '🇦🇺', sector: 'Index' },
    // Hong Kong
    '0700.HK': { name: 'Tencent', country: '🇭🇰', sector: 'Technology' },
    '9988.HK': { name: 'Alibaba', country: '🇭🇰', sector: 'Technology' },
    '0005.HK': { name: 'HSBC Holdings', country: '🇭🇰', sector: 'Financial' },
    '^HSI': { name: 'Hang Seng', country: '🇭🇰', sector: 'Index' },
    // Germany
    'SAP.DE': { name: 'SAP SE', country: '🇩🇪', sector: 'Technology' },
    'SIE.DE': { name: 'Siemens', country: '🇩🇪', sector: 'Industrial' },
    'BMW.DE': { name: 'BMW', country: '🇩🇪', sector: 'Automotive' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪', sector: 'Index' },
    // Japan
    '7203.T': { name: 'Toyota Motor', country: '🇯🇵', sector: 'Automotive' },
    '6758.T': { name: 'Sony Group', country: '🇯🇵', sector: 'Technology' },
    '7974.T': { name: 'Nintendo', country: '🇯🇵', sector: 'Consumer' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵', sector: 'Index' },
    // UAE
    'FAB.AE': { name: 'First Abu Dhabi Bank', country: '🇦🇪', sector: 'Financial' },
    'ETISALAT.AE': { name: 'e& (Etisalat)', country: '🇦🇪', sector: 'Telecom' },
    '^ADI': { name: 'ADX Index', country: '🇦🇪', sector: 'Index' },
    // South Africa
    'NPN.JO': { name: 'Naspers', country: '🇿🇦', sector: 'Technology' },
    'SOL.JO': { name: 'Sasol', country: '🇿🇦', sector: 'Energy' },
    'MTN.JO': { name: 'MTN Group', country: '🇿🇦', sector: 'Telecom' },
    '^J203': { name: 'JSE All Share', country: '🇿🇦', sector: 'Index' },
    // Qatar
    'QNBK.QA': { name: 'QNB Group', country: '🇶🇦', sector: 'Financial' },
    'ORDS.QA': { name: 'Ooredoo', country: '🇶🇦', sector: 'Telecom' },
    '^QSI': { name: 'QE Index', country: '🇶🇦', sector: 'Index' }
};

// Market category detection
const getMarketCategory = (symbol) => {
    if (symbol.endsWith('.SR') || SAUDI_STOCKS.includes(symbol)) return 'SA';
    if (symbol.endsWith('.CA') || symbol === '^CASE30' || EGYPT_STOCKS.includes(symbol)) return 'EG';
    if (symbol.endsWith('.NS') || symbol === '^NSEI' || INDIA_STOCKS.includes(symbol)) return 'IN';
    if (symbol.endsWith('.L') || symbol === '^FTSE' || UK_STOCKS.includes(symbol)) return 'UK';
    if (symbol.endsWith('.TO') || symbol === '^GSPTSE' || CANADA_STOCKS.includes(symbol)) return 'CA';
    if (symbol.endsWith('.AX') || symbol === '^AXJO' || AUSTRALIA_STOCKS.includes(symbol)) return 'AU';
    if (symbol.endsWith('.HK') || symbol === '^HSI' || HONGKONG_STOCKS.includes(symbol)) return 'HK';
    if (symbol.endsWith('.DE') || symbol === '^GDAXI' || GERMANY_STOCKS.includes(symbol)) return 'DE';
    if (symbol.endsWith('.T') || symbol === '^N225' || JAPAN_STOCKS.includes(symbol)) return 'JP';
    if (symbol.endsWith('.AE') || symbol.endsWith('.DU') || symbol === '^ADI' || UAE_STOCKS.includes(symbol)) return 'AE';
    if (symbol.endsWith('.JO') || symbol === '^J203' || SOUTHAFRICA_STOCKS.includes(symbol)) return 'ZA';
    if (symbol.endsWith('.QA') || symbol === '^QSI' || QATAR_STOCKS.includes(symbol)) return 'QA';
    return 'US';
};

const getCountryFlag = (category) => {
    const flags = {
        'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧',
        'CA': '🇨🇦', 'AU': '🇦🇺', 'HK': '🇭🇰', 'DE': '🇩🇪', 'JP': '🇯🇵',
        'AE': '🇦🇪', 'ZA': '🇿🇦', 'QA': '🇶🇦', 'Global': '🌍'
    };
    return flags[category] || '🌍';
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

// Market to ticker list mapping
const MARKET_STOCKS = {
    'SA': SAUDI_STOCKS,
    'EG': EGYPT_STOCKS,
    'US': US_STOCKS,
    'Global': US_STOCKS,  // Legacy support
    'IN': INDIA_STOCKS,
    'UK': UK_STOCKS,
    'CA': CANADA_STOCKS,
    'AU': AUSTRALIA_STOCKS,
    'HK': HONGKONG_STOCKS,
    'DE': GERMANY_STOCKS,
    'JP': JAPAN_STOCKS,
    'AE': UAE_STOCKS,
    'ZA': SOUTHAFRICA_STOCKS,
    'QA': QATAR_STOCKS
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

        // Get ticker list for the requested market
        let allTickers = MARKET_STOCKS[market];

        // If market not found, return US stocks as default
        if (!allTickers) {
            console.log(`Unknown market: ${market}, defaulting to US`);
            allTickers = US_STOCKS;
        }

        console.log(`Fetching ${market || 'default'} market: ${allTickers.length} tickers`);

        // Process in smaller chunks with RETRY logic
        const chunkSize = 5;
        const results = [];

        for (let i = 0; i < allTickers.length; i += chunkSize) {
            const chunk = allTickers.slice(i, i + chunkSize);

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
                    break;
                } catch (err) {
                    console.error(`Batch ${i} attempt ${attempt} failed:`, err.message);
                    if (attempt < 2) {
                        await new Promise(r => setTimeout(r, 300));
                    }
                }
            }

            if (i + chunkSize < allTickers.length) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        const data = results.map(mapStockData).filter(item => item !== null);

        if (data.length === 0) {
            console.error('No stock data fetched - all requests failed');
            return res.status(200).json([]);
        }

        res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=10');
        res.status(200).json(data);
    } catch (e) {
        console.error("Stocks API Error:", e);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
}
