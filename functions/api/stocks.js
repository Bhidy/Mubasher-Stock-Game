// Cloudflare Pages Function - Enterprise Stock Sync
// Fully Synchronized with Frontend "23 Markets" Requirement
import yahooFinance from 'yahoo-finance2';

// Version: CF-GLOBAL-23-MARKETS
// Full Market Catalog matching src/context/MarketContext.jsx

// --- MARKET CATALOG DEFINITIONS ---

// 1. SAUDI ARABIA (SA)
const SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
];

// 2. EGYPT (EG)
const EGYPT_STOCKS = [
    'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
    'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
    'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
    'ADIB.CA', '^CASE30'
];

// 3. USA (US)
const US_STOCKS = [
    '^GSPC', '^DJI', '^IXIC',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE', 'BRK-B', 'LLY'
];

// 4. INDIA (IN)
const INDIA_STOCKS = [
    '^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'LICI.NS'
];

// 5. UNITED KINGDOM (UK)
const UK_STOCKS = [
    '^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'DGE.L', 'RIO.L', 'GSK.L', 'GLEN.L'
];

// 6. GERMANY (DE)
const GERMANY_STOCKS = [
    '^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE', 'VOW3.DE', 'BAS.DE', 'ADS.DE'
];

// 7. FRANCE (FR)
const FRANCE_STOCKS = [
    '^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA', 'SU.PA', 'EL.PA', 'KER.PA'
];

// 8. JAPAN (JP)
const JAPAN_STOCKS = [
    '^N225', '7203.T', '6758.T', '9984.T', '6861.T', '8306.T', '9432.T', '7974.T', '6098.T', '4063.T'
];

// 9. CANADA (CA)
const CANADA_STOCKS = [
    '^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO', 'BMO.TO', 'BNS.TO', 'TRP.TO'
];

// 10. AUSTRALIA (AU)
const AUSTRALIA_STOCKS = [
    '^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'FMG.AX', 'WDS.AX', 'TLS.AX'
];

// 11. HONG KONG (HK)
const HK_STOCKS = [
    '^HSI', '0700.HK', '09988.HK', '0939.HK', '01299.HK', '0941.HK', '03690.HK', '00005.HK', '00388.HK'
];

// 12. SWITZERLAND (CH)
const SWISS_STOCKS = [
    '^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW', 'CFR.SW', 'ZURN.SW', 'LONN.SW'
];

// 13. NETHERLANDS (NL)
const NETHERLANDS_STOCKS = [
    '^AEX', 'ASML.AS', 'UNA.AS', 'SHELL.AS', 'HEIA.AS', 'INGA.AS', 'PHIA.AS', 'ADYEN.AS', 'DSM.AS'
];

// 14. SPAIN (ES)
const SPAIN_STOCKS = [
    '^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC', 'REP.MC', 'CLNX.MC'
];

// 15. ITALY (IT)
const ITALY_STOCKS = [
    'FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'ENI.MI', 'UCG.MI', 'RACE.MI', 'G.MI', 'MB.MI' // RACE is Ferrari
];

// 16. BRAZIL (BR)
const BRAZIL_STOCKS = [
    '^BVSP', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA', 'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA'
];

// 17. MEXICO (MX)
const MEXICO_STOCKS = [
    '^MXX', 'WALMEX.MX', 'AMXL.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'BIMBOA.MX', 'CEMEXCPO.MX', 'TLEVISACPO.MX'
];

// 18. SOUTH KOREA (KR)
const KOREA_STOCKS = [
    '^KS11', '005930.KS', '000660.KS', '005380.KS', '207940.KS', '051910.KS', '005490.KS' // Note: Yahoo might need suffix adjustments
];

// 19. TAIWAN (TW)
const TAIWAN_STOCKS = [
    '^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2881.TW'
];

// 20. SINGAPORE (SG)
const SINGAPORE_STOCKS = [
    '^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C52.SI'
];

// 21. UAE (AE)
const UAE_STOCKS = [
    'EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AD', 'DIB.AE', 'ENBD.AE', 'TAQA.AD'
];

// 22. SOUTH AFRICA (ZA)
const SOUTH_AFRICA_STOCKS = [
    'JSE.JO', 'NPN.JO', 'FSR.JO', 'SBK.JO', 'ABG.JO', 'SOL.JO', 'MTN.JO'
];

// 23. QATAR (QA)
const QATAR_STOCKS = [
    'QNBK.QA', 'IQCD.QA', 'QIBK.QA', 'CBQK.QA', 'MARK.QA'
];

// Map Market Codes to Stock Lists
const MARKET_STOCKS = {
    'SA': SAUDI_STOCKS,
    'EG': EGYPT_STOCKS,
    'US': US_STOCKS,
    'Global': US_STOCKS,
    'IN': INDIA_STOCKS,
    'UK': UK_STOCKS,
    'DE': GERMANY_STOCKS,
    'FR': FRANCE_STOCKS,
    'JP': JAPAN_STOCKS,
    'CA': CANADA_STOCKS,
    'AU': AUSTRALIA_STOCKS,
    'HK': HK_STOCKS,
    'CH': SWISS_STOCKS,
    'NL': NETHERLANDS_STOCKS,
    'ES': SPAIN_STOCKS,
    'IT': ITALY_STOCKS,
    'BR': BRAZIL_STOCKS,
    'MX': MEXICO_STOCKS,
    'KR': KOREA_STOCKS,
    'TW': TAIWAN_STOCKS,
    'SG': SINGAPORE_STOCKS,
    'AE': UAE_STOCKS,
    'ZA': SOUTH_AFRICA_STOCKS,
    'QA': QATAR_STOCKS
};

// Flags for fallback
const COUNTRY_FLAGS = {
    'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'CA': '🇨🇦', 'AU': '🇦🇺',
    'HK': '🇭🇰', 'CH': '🇨🇭', 'NL': '🇳🇱', 'ES': '🇪🇸', 'IT': '🇮🇹',
    'BR': '🇧🇷', 'MX': '🇲🇽', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬',
    'AE': '🇦🇪', 'ZA': '🇿🇦', 'QA': '🇶🇦'
};

// ROBUST MAPPING LOGIC
const mapStockData = (quote, marketCode) => {
    if (!quote || !quote.symbol) return null;

    let symbol = quote.symbol;
    // Map special cases
    if (symbol === 'CASE30.CA') symbol = '^CASE30';

    const flag = COUNTRY_FLAGS[marketCode] || '🌍';

    // Pricing & Normalization
    let price = quote.regularMarketPrice || quote.regularMarketPreviousClose || quote.regularMarketOpen || quote.regularMarketDayHigh || 0;
    let prevClose = quote.regularMarketPreviousClose || quote.regularMarketOpen || price;

    let change = quote.regularMarketChange;
    let changePercent = quote.regularMarketChangePercent;

    // Zero-Fix Logic
    if ((change === undefined || change === 0) && prevClose > 0 && price > 0) {
        change = price - prevClose;
        changePercent = (change / prevClose) * 100;
    }
    if (!change) change = 0;
    if (!changePercent) changePercent = 0;

    // Volume Fallbacks
    let volume = quote.regularMarketVolume || quote.averageDailyVolume3Month || 0;

    return {
        symbol: symbol,
        name: quote.shortName || quote.longName || symbol,
        category: marketCode,
        country: flag,
        sector: quote.sector || (symbol.startsWith('^') ? 'Index' : 'General'),
        logo: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${symbol.split('.')[0].toLowerCase()}.com&size=128`,

        price: price,
        change: change,
        changePercent: changePercent,
        prevClose: prevClose,
        high: quote.regularMarketDayHigh || price,
        low: quote.regularMarketDayLow || price,
        open: quote.regularMarketOpen || price,
        volume: volume,
        marketCap: quote.marketCap,

        lastUpdated: new Date().toISOString()
    };
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'US';

    try {
        // 1. Init Config
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

        // 2. Select Tickers for Market
        let allTickers = MARKET_STOCKS[market];

        // Fallback checks
        if (!allTickers) {
            console.log(`Market ${market} not found, defaulting to Global/US`);
            allTickers = US_STOCKS;
        }

        console.log(`CF Functions: Fetching ${market} (${allTickers.length} tickers)`);

        // 3. Batch Fetch
        let quoteResult;
        try {
            quoteResult = await yahooFinance.quote(allTickers, { validateResult: false });
        } catch (e) {
            console.error("Batch fetch failed:", e.message);
            return new Response(JSON.stringify({ error: "Batch fetch failed", details: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        // 4. Map Data
        const data = (Array.isArray(quoteResult) ? quoteResult : [quoteResult])
            .map(q => mapStockData(q, market))
            .filter(item => item !== null);

        if (data.length === 0) {
            return new Response(JSON.stringify({ error: "No data returned" }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        // 5. Response
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
